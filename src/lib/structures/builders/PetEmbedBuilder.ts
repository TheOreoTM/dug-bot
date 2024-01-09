import { DugEmbedBuilder } from '#lib/structures/builders/DugEmbedBuillder';
import { PetData } from '#lib/types';
import { Pet } from '@prisma/client';
import { container } from '@sapphire/pieces';

export class PetEmbedBuilder {
	private readonly petData: PetData;
	private readonly registry = container.pet.registry;
	public constructor(private readonly pet: Pet) {
		const petData = this.registry.getPetById(pet.registryId);
		if (!petData) throw new Error(`Pet with id ${pet.registryId} not found in registry`);
		this.petData = petData;
	}

	public build(): DugEmbedBuilder {
		this.pet;
		const embed = new DugEmbedBuilder();
		const name = this.registry.getPetName(this.petData.id);
		embed.setTitle(name);

		return embed;
	}
}
