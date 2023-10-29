import { CrateAssets } from '#constants';
import { ItemTypes, LevelingDropType, Item, BoostItemValue, CrateItemValue, CrateDropType } from '#lib/types';
import { hours } from '#utils/common';

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
	},
	commonCrate: {
		description: 'A crate with common items',
		name: 'Common Crate',
		emoji: CrateAssets.Common.Emoji,
		price: 0,
		sellable: false,
		type: ItemTypes.Crate,
		usable: true,
		usage: 'Open to get some items',
		value: 'commonCrate',
		sellPrice: 0
	},
	uncommonCrate: {
		description: 'A crate with uncommon items',
		name: 'Uncommon Crate',
		emoji: CrateAssets.Uncommon.Emoji,
		price: 0,
		sellable: false,
		type: ItemTypes.Crate,
		usable: true,
		usage: 'Open to get some items',
		value: 'uncommonCrate',
		sellPrice: 0
	},
	rareCrate: {
		description: 'A crate with rare items',
		name: 'Rare Crate',
		emoji: CrateAssets.Rare.Emoji,
		price: 0,
		sellable: false,
		type: ItemTypes.Crate,
		usable: true,
		usage: 'Open to get some items',
		value: 'rareCrate',
		sellPrice: 0
	},
	mythicCrate: {
		description: 'A crate with mythic items',
		name: 'Mythical Crate',
		emoji: CrateAssets.Mythic.Emoji,
		price: 0,
		sellable: false,
		type: ItemTypes.Crate,
		usable: true,
		usage: 'Open to get some items',
		value: 'mythicCrate',
		sellPrice: 0
	}
} as const;

export const Crates: Record<CrateItemValue, CrateDropType> = {
	commonCrate: {
		name: 'Common Crate',
		image: CrateAssets.Common.Image,
		weight: 90,
		emoji: CrateAssets.Common.Emoji,
		description: 'A crate with common items.'
	},
	uncommonCrate: {
		name: 'Uncommon Crate',
		image: CrateAssets.Uncommon.Image,
		weight: 50,
		emoji: CrateAssets.Uncommon.Emoji,
		description: 'A crate with uncommon items.'
	},
	rareCrate: {
		name: 'Rare Crate',
		image: CrateAssets.Rare.Image,
		weight: 5,
		emoji: CrateAssets.Rare.Emoji,
		description: 'A crate with rare items.'
	},
	mythicCrate: {
		name: 'Mythical Crate',
		image: CrateAssets.Mythic.Image,
		weight: 1,
		emoji: CrateAssets.Mythic.Emoji,
		description: 'A crate with mythic items.'
	}
} as const;

export const BoostItems: Record<BoostItemValue, LevelingDropType> = {
	levelUp1: {
		name: '+1 Level',
		amount: 1,
		description: 'Gain +1 Level',
		type: 'levelUp',
		weight: 30
	},
	levelUp2: {
		name: '+2 Level',
		amount: 2,
		description: 'Gain +2 Levels',
		type: 'levelUp',
		weight: 15
	},
	levelUp3: {
		name: '+3 Levels',
		amount: 3,
		description: 'Gain +3 Levels',
		type: 'levelUp',
		weight: 5
	},
	xpBoost30: {
		name: '+30% XP Boost',
		amount: 0.3,
		description: 'Gain +30% XP',
		type: 'xpBoost',
		weight: 80,
		durationMs: hours(2)
	},
	xpBoost50: {
		name: Items.xpBoost50.name,
		amount: 0.5,
		description: Items.xpBoost50.description,
		type: 'xpBoost',
		weight: 60,
		durationMs: hours(2)
	}
};

const shopItemsArray: ReadonlyArray<Item> = Object.values(Items);
export { shopItemsArray };
