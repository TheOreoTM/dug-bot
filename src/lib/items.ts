import { DugColors } from '#constants';
import { Item, ItemValue } from './types/Data';
import { LevelingDropType } from './types/Drops';
import { ItemTypes } from './types/Enums';
import { hours } from './util/common';

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
		value: 'xpBoost30',
		sellPrice: 750
	},
	xpBoost50: {
		description: 'Gain +50% XP',
		name: '50% XP Boost',
		emoji: '⬆️',
		price: 1000,
		sellable: true,
		type: ItemTypes.Boost,
		usable: true,
		usage: 'Use to gain +50 XP',
		value: 'xpBoost50',
		sellPrice: 750
	}
} as const;

export const BoostItems: Record<ItemValue, LevelingDropType> = {
	levelUp1: {
		name: '+1 Level',
		amount: 1,
		color: DugColors.Default,
		description: 'Gain +1 Level',
		type: 'levelUp',
		weight: 30
	},
	levelUp2: {
		name: '+2 Level',
		amount: 2,
		color: DugColors.Default,
		description: 'Gain +2 Levels',
		type: 'levelUp',
		weight: 15
	},
	levelUp3: {
		name: '+3 Levels',
		amount: 3,
		color: DugColors.Default,
		description: 'Gain +3 Levels',
		type: 'levelUp',
		weight: 5
	},
	xpBoost30: {
		name: '+30% XP Boost',
		amount: 0.3,
		color: DugColors.Default,
		description: 'Gain +30% XP',
		type: 'xpBoost',
		weight: 80,
		durationMs: hours(2)
	},
	xpBoost50: {
		name: Items.xpBoost50.name,
		amount: 0.5,
		color: DugColors.Default,
		description: Items.xpBoost50.description,
		type: 'xpBoost',
		weight: 60,
		durationMs: hours(2)
	}
};

const shopItemsArray: ReadonlyArray<Item> = Object.values(Items);
export { shopItemsArray };
