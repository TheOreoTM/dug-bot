import { LongWidthSpace } from '#constants';
import { PET_EMOJIS } from '#lib/data/petData';
import { PetHandler } from '#lib/services/PetService';
import { DugEmbedBuilder } from '#lib/structures';
import { Pet } from '@prisma/client';

export class PetListEmbedBuilder {
	private readonly pets: Pet[];
	private readonly embed: DugEmbedBuilder;
	public constructor(pets: Pet[]) {
		this.pets = pets;
		this.embed = new DugEmbedBuilder();
	}

	public build(): DugEmbedBuilder {
		const highestIdx = this.getHighestIdx();
		let description = ``;
		for (const pet of this.pets) {
			const petHandler = new PetHandler(pet);
			description += this.formatItem(petHandler, highestIdx);
		}
		this.embed.setDescription(description);
		this.embed.setTitle('Your pets');

		return this.embed;
	}

	private getHighestIdx(): number {
		const idxArray: number[] = this.pets.map((p) => p.idx);
		console.log('🚀 ~ file: PetEmbedBuilder.ts:30 ~ PetListEmbedBuilder ~ getHighestIdx ~ idxArray:', idxArray);
		console.log('🚀 ~ file: PetEmbedBuilder.ts:33 ~ PetListEmbedBuilder ~ getHighestIdx ~ Math.max(...idxArray):', Math.max(...idxArray));

		return Math.max(...idxArray);
	}

	private formatItem(pet: PetHandler, maxIdx: number): string {
		let text = ``;
		const seperator = `${LongWidthSpace}•${LongWidthSpace}`;
		const idxText = `\`${pet.pet.idx}\``.padStart(`${maxIdx}`.length, ' ');

		text += `${idxText}${LongWidthSpace}`;
		text += `${PET_EMOJIS[pet.pet.registryId] ?? '❔'} ${pet.formatName('nif')}${seperator}`;
		text += `Lvl. ${pet.pet.level}${seperator}`;
		text += `${pet.pet.averageIv}%\n`;

		return text;
	}
}
