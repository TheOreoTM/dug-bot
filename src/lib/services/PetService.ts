import { PET_DATA } from '#lib/data/petData';
import { PetData } from '#lib/types';
import { genRandomInt } from '#lib/util/utils';
import { Pet, Prisma } from '@prisma/client';
import { container } from '@sapphire/pieces';
import { HexColorString } from 'discord.js';

class PetRegistry {
	private petMap: Map<number, PetData>;

	constructor() {
		this.petMap = new Map(PET_DATA.map((pet) => [pet.id, { ...pet }]));
	}

	getRandomPet(): PetData {
		const entriesArray = Array.from(this.petMap.entries());

		const randomIndex = Math.floor(Math.random() * entriesArray.length);
		return entriesArray[randomIndex][1];
	}

	getPetById(id: number): PetData | null {
		return this.petMap.get(id) ?? null;
	}

	getPetByName(name: string): PetData | null {
		// Search for a pet by name
		for (const [_, petData] of this.petMap) {
			if (petData.names.includes(name)) {
				return petData;
			}
		}
		return null;
	}

	getPetName(id: number): string {
		const pet = this.petMap.get(id);
		if (!pet) return `Unknown Pet`;

		return pet.names[0];
	}

	getPetNames(id: number): string[] {
		const pet = this.petMap.get(id);
		if (!pet) return [`Unknown Pet`];

		return pet.names;
	}

	getAllPets(): IterableIterator<[number, PetData]> {
		return this.petMap.entries();
	}
}

export class UserPetHandler {
	private readonly db = container.db;
	private readonly petRegistry = new PetRegistry();
	private readonly userPets: Pet[] = [];
	private readonly userId: string;

	constructor(userId: string, userPets: Pet[]) {
		this.userId = userId;
		this.userPets = userPets;
	}

	public fetchNextIdx(): number {
		return this.userPets.length + 1;
	}

	public async createPet(): Promise<Pet> {
		const MAX_IV = 31;
		const NUM_STAGES = 4;

		const randomPet = this.petRegistry.getRandomPet();
		const ivs = [genRandomIv(), genRandomIv(), genRandomIv(), genRandomIv()];
		const [atkIv, hpIv, spdIv, defIv] = ivs;
		const totalIv = ivs.reduce((partialSum, a) => partialSum + a, 0);
		const averageIv = +((totalIv / (MAX_IV * NUM_STAGES)) * 100).toFixed(2);

		const pet = await this.db.pet.create({
			data: {
				atkIv,
				hpIv,
				spdIv,
				defIv,
				averageIv,
				totalIv,
				chromatic: Math.random() < 1 / 512,
				idx: this.fetchNextIdx(),
				level: genRandomInt(10, 20),
				registryId: randomPet.id,
				xp: 0,
				ownerId: this.userId
			}
		});

		return pet;

		function genRandomIv() {
			return genRandomInt(0, 31);
		}
	}

	public async getSelectedPet(): Promise<Pet | null> {
		const userData = await this.db.user.findUnique({
			where: { id: this.userId },
			select: { selectedPet: true }
		});

		const pet = userData ? userData?.selectedPet ?? null : null;
		return pet;
	}

	public async getPetHandler(pet?: Pet): Promise<PetHandler | null> {
		if (pet) return new PetHandler(pet);
		const selectedPet = await this.getSelectedPet();
		if (!selectedPet) return null;
		return new PetHandler(selectedPet);
	}

	public async getPets(): Promise<Array<Pet>> {
		return this.userPets;
	}

	public async selectPet(idx: number): Promise<Pet | null> {
		const user = await this.db.user.update({
			where: { id: this.userId },
			data: { selectedPet: { connect: { ownerId_idx: { idx, ownerId: this.userId } } } },
			select: { selectedPet: true }
		});

		return user.selectedPet;
	}
}

export class PetHandler {
	private readonly db = container.db;
	public readonly pet: Pet;
	private readonly registry = new PetRegistry();

	constructor(pet: Pet) {
		this.pet = pet;
	}

	public async resetColor() {
		await this.updatePet({
			color: null,
			hasColor: false
		});
	}

	public async setColor(color: HexColorString) {
		await this.updatePet({
			color,
			hasColor: true
		});
	}

	public async toggleFavorite() {
		if (this.pet.favorite) await this.unfavorite();
		if (!this.pet.favorite) await this.favorite();
	}

	public async unfavorite() {
		await this.updatePet({ favorite: false });
	}

	public async favorite() {
		await this.updatePet({ favorite: true });
	}

	public async setNickname(nickname: string) {
		await this.updatePet({
			nickname
		});
	}

	/**
	 *
	 * @param {Pet} pet The pet you want to format the name for
	 * @param {string} spec The formatting you want
	 * l -> Level {level}
	 * L -> L{level}
	 * n -> nickname
	 * f -> favourite
	 * @returns The formated name
	 */
	public formatName(spec: string) {
		let name: string = '';

		if (this.pet.chromatic) name = `🌟 `; // shiny emoji
		if (spec.includes('l')) name += `Level ${this.pet.level} `; // long
		if (spec.includes('L')) name += `L${this.pet.level} `; // short
		// if (spec.includes('e')) name = emoji + ' ' + name // emoji
		const petName = this.registry.getPetName(this.pet.registryId);

		name += petName;

		if (spec.includes('n') && this.pet.nickname) name += ` "${this.pet.nickname}"`; // nickname
		if (spec.includes('f') && this.pet.favorite) name += ` ❤️`; // favourite

		return name;
	}

	public async getUserPetHandler(): Promise<UserPetHandler> {
		const userId = this.pet.ownerId;
		const userPets = await this.db.pet.findMany({
			where: {
				ownerId: userId
			}
		});

		return new UserPetHandler(userId, userPets);
	}

	private async updatePet(options: Prisma.PetUpdateInput) {
		await this.db.pet.update({
			where: {
				id: this.pet.id
			},
			data: { ...options }
		});
	}
}

export class PetService {
	private readonly petRegistry = new PetRegistry();
	private readonly db = container.db;

	public constructor() {}

	/**
	 * Get a pet handler for a user
	 * @param userId
	 * @returns
	 */
	public async getUserPetHandler(userId: string): Promise<UserPetHandler> {
		const userPets = await this.db.pet.findMany({
			where: {
				ownerId: userId
			}
		});

		return new UserPetHandler(userId, userPets);
	}

	get registry(): PetRegistry {
		return this.petRegistry;
	}
}
