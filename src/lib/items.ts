import { Item } from './types/Data';
import { ItemTypes } from './types/Enums';

export const Items = {
	levelUp1: {
		description: 'Gain +1 Level',
		name: '+1 Level',
		emoji: '⬆️',
		price: 1000,
		sellable: true,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Use to gain +1 Level',
		value: 'levelUp1',
		sellPrice: 750
	},
	levelUp2: {
		description: 'Gain +2 Levels',
		name: '+2 Levels',
		emoji: '⬆️',
		price: 1000,
		sellable: true,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Use to gain +2 Level',
		value: 'levelUp2',
		sellPrice: 750
	},
	levelUp3: {
		description: 'Gain +3 Levels',
		name: '+3 Levels',
		emoji: '⬆️',
		price: 1000,
		sellable: true,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Use to gain +3 Levels',
		value: 'levelUp3',
		sellPrice: 750
	},
	xpBoost30: {
		description: 'Gain +30% XP',
		name: '30% XP Boost',
		emoji: '⬆️',
		price: 1000,
		sellable: true,
		type: ItemTypes.Boost,
		usable: true,
		usage: 'Use to gain +30 XP',
		value: 'levelUp3',
		sellPrice: 750
	}
} as const;

const shopItemsArray: ReadonlyArray<Item> = Object.values(Items);
export { shopItemsArray };
