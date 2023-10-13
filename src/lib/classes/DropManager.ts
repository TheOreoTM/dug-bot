import { DugColors, DugEvents } from '#constants';
import { DropType } from '#lib/types/Data';
import { container } from '@sapphire/framework';

export class DropManager {
	private static instance: DropManager;
	private dropsAvailable: Record<string, DropType> = DropTypes;
	public allowDrop: boolean = true;

	// Singleton pattern to ensure only one instance of DropManager exists
	private constructor() {}

	public static getInstance(): DropManager {
		if (!DropManager.instance) {
			DropManager.instance = new DropManager();
		}
		return DropManager.instance;
	}

	public performDropLogic() {
		if (!this.allowDrop) return;
		const randomDrop = this.getRandomDrop();
		if (!randomDrop) return;

		this.triggerDrop(randomDrop);
	}

	public triggerDrop(drop: DropType) {
		container.client.emit(DugEvents.TriggerDrop, drop);
		this.allowDrop = false;
	}

	public getAvailableDrops() {
		return this.dropsAvailable;
	}

	private getRandomDrop(): DropType | null {
		const totalWeight = Object.values(this.dropsAvailable).reduce((acc, drop) => acc + drop.weight, 0);
		if (totalWeight === 0) return null;

		let randomWeight = Math.random() * totalWeight;

		for (const dropName in this.dropsAvailable) {
			if (Object.prototype.hasOwnProperty.call(this.dropsAvailable, dropName)) {
				const drop = this.dropsAvailable[dropName];
				randomWeight -= drop.weight;
				if (randomWeight <= 0) {
					return drop;
				}
			}
		}
		return null;
	}
}

export class Drop {}

const DropTypes: Record<string, DropType> = {
	legendary: {
		color: DugColors.Halloween,
		image: 'https://i.imgur.com/pPdhdOa.png',
		description: 'A crate with legendary items. Derived from the blood of ancient demons, these relics are steeped in mystery and power.',
		items: ['sword', 'elixir'],
		weight: 1
	},
	mythic: {
		color: DugColors.Halloween,
		image: 'https://i.imgur.com/iLpFghe.png',
		description: 'A crate with mythic items. Forged by mythical beings, these artifacts carry the essence of fabled heroes and gods.',
		items: ['sword', 'elixir'],
		weight: 2
	},
	gold: {
		color: DugColors.Halloween,
		image: 'https://i.imgur.com/Knvbi1Z.png',
		description: 'A crate with gold items. Treasures of prosperity, crafted from the finest materials and adorned with precious gems.',
		items: ['sword', 'elixir'],
		weight: 20
	},
	silver: {
		color: DugColors.Halloween,
		image: 'https://i.imgur.com/pXCDght.png',
		description:
			'A crate with silver items. Enchanted with lunar magic, these items offer ethereal abilities and guidance from celestial realms.',
		items: ['gold'],
		weight: 30
	},
	bronze: {
		color: DugColors.Halloween,
		image: 'https://i.imgur.com/TlTfwV9.png',
		description: 'A crate with bronze items. Holding ancient relics from a bygone era, these treasures carry the weight of history.',
		items: ['gold'],
		weight: 50
	}
};
