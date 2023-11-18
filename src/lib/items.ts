import { CrateAssets } from '#constants';
import { ItemTypes, LevelingDropType, Item, BoostItemValue, CrateItemValue, CrateDropType, CreateNewItem, ItemValue } from '#lib/types';
import { hours } from '#utils/common';
import { ILootTableEntry, LootTable, LootTableEntry } from 'loot-table-advanced';

export const Items = {
	levelUp1: CreateNewItem({
		description: 'Gain +1 Level',
		name: '+1 Level',
		emoji: '⬆️',
		price: 500,
		sellable: true,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Use to gain +1 Level',
		value: 'levelUp1',
		sellPrice: 750
	}),
	levelUp2: CreateNewItem({
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
	}),
	levelUp3: CreateNewItem({
		description: 'Gain +3 Levels',
		name: '+3 Levels',
		emoji: '⬆️',
		price: 1500,
		sellable: true,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Use to gain +3 Levels',
		value: 'levelUp3',
		sellPrice: 750
	}),
	xpBoost20: CreateNewItem({
		description: 'Gain +20% XP',
		name: '20% XP Boost',
		emoji: '⬆️',
		price: 800,
		sellable: true,
		type: ItemTypes.Boost,
		usable: true,
		usage: 'Use to gain +20 XP',
		value: 'xpBoost20',
		sellPrice: 750
	}),
	xpBoost30: CreateNewItem({
		description: 'Gain +30% XP',
		name: '30% XP Boost',
		emoji: '⬆️',
		price: 1200,
		sellable: true,
		type: ItemTypes.Boost,
		usable: true,
		usage: 'Use to gain +30 XP',
		value: 'xpBoost30',
		sellPrice: 750
	}),
	xpBoost50: CreateNewItem({
		description: 'Gain +50% XP',
		name: '50% XP Boost',
		emoji: '⬆️',
		price: 1600,
		sellable: true,
		type: ItemTypes.Boost,
		usable: true,
		usage: 'Use to gain +50 XP',
		value: 'xpBoost50',
		sellPrice: 750
	}),
	commonCrate: CreateNewItem({
		description: 'A crate with common items',
		name: 'Common Crate',
		emoji: CrateAssets.Common.Emoji,
		price: 200,
		sellable: false,
		type: ItemTypes.Crate,
		usable: true,
		usage: 'Open to get some items',
		value: 'commonCrate',
		sellPrice: 0
	}),
	uncommonCrate: CreateNewItem({
		description: 'A crate with uncommon items',
		name: 'Uncommon Crate',
		emoji: CrateAssets.Uncommon.Emoji,
		price: 500,
		sellable: false,
		type: ItemTypes.Crate,
		usable: true,
		usage: 'Open to get some items',
		value: 'uncommonCrate',
		sellPrice: 0
	}),
	rareCrate: CreateNewItem({
		description: 'A crate with rare items',
		name: 'Rare Crate',
		emoji: CrateAssets.Rare.Emoji,
		price: 1000,
		sellable: false,
		type: ItemTypes.Crate,
		usable: true,
		usage: 'Open to get some items',
		value: 'rareCrate',
		sellPrice: 0
	}),
	mythicCrate: CreateNewItem({
		description: 'A crate with mythic items',
		name: 'Mythical Crate',
		emoji: CrateAssets.Mythic.Emoji,
		price: 2000,
		sellable: false,
		type: ItemTypes.Crate,
		usable: true,
		usage: 'Open to get some items',
		value: 'mythicCrate',
		sellPrice: 0
	}),
	grimoire: CreateNewItem({
		name: 'Ghoulish Grimoire',
		description: 'Ohh, look at this fancy magical book! I wonder what it does.',
		emoji: '<a:magical_book:1162824200243912754>',
		type: ItemTypes.Item,
		usable: true,
		usage: 'Use Ghoulish Grimoire to redeem 1 item from the magical shop.',
		value: 'grimoire',
		price: 3000,
		sellPrice: 0,
		sellable: false
	}),
	ticket: CreateNewItem({
		name: 'Lottery Ticket',
		description: "Nah bro I ain't selling this shit, I'm broke and I need money",
		emoji: '<:Ticket:1163384283755466804>',
		type: ItemTypes.Item,
		price: 2500,
		usable: true,
		usage: 'Use to participate in the nitro hunt',
		value: 'ticket',
		sellable: false,
		sellPrice: 0
	}),
	ticketFragment: CreateNewItem({
		name: 'Ticket Fragment',
		description: 'MARK! MARK! I found the last lottery fragment! We just need 5 more to be rich now',
		emoji: '<:Ticket_Fragment:1163386943875317821>',
		type: ItemTypes.Item,
		price: 500,
		usable: true,
		usage: 'Use 5 fragments to make a lottery ticket',
		value: 'ticketFragment',
		sellable: false,
		sellPrice: 0
	}),
	hat: CreateNewItem({
		name: 'Halloween Hat',
		description: 'Another witch be-hatted, you better use this before the witch steals it off you.',
		emoji: '<:Halloween_Hat:1163382021943480360>',
		sellable: true,
		sellPrice: 0,
		price: 1500,
		type: ItemTypes.Boost,
		usable: true,
		usage: 'Use Halloween Hat to gain 1 level worth of xp',
		value: 'halloweenHat'
	}),
	candyCane: CreateNewItem({
		name: 'Halloween Candy Cane',
		description: "NO GRANDA, THIS ARE NOT THOSE CANES! OH C'MON NOW DON'T FAKE IT",
		emoji: '<a:Candy_Cane:1163381494094508035>',
		sellable: true,
		sellPrice: 0,
		price: 800,
		type: ItemTypes.Boost,
		usable: true,
		usage: 'Use Halloween Candy Cane to gain 30% coin bonus for 1 minute!',
		value: 'candyCane'
	}),
	coin: CreateNewItem({
		name: 'Coin',
		description: 'Nice one Jerry! The Dollar coins machine works perfectly now, we managed to fool ISA for the fifth time now.',
		emoji: '<:coin:1164253043991253116>',
		sellable: true,
		sellPrice: 1,
		price: 1,
		type: ItemTypes.Item,
		usable: false,
		usage: 'Currency for the shop!',
		value: 'coin'
	}),
	potionWeak: CreateNewItem({
		name: 'Weak Vampiric Vitality Vile',
		description: "Yo, I ain't even lyin', she guzzled down that whole bottle of that weird-lookin' liquid and, like, passed out cold. ",
		emoji: '<:Vampiric_Vitality_Vile_weak:1163161116277477526>',
		sellable: true,
		sellPrice: 0,
		price: 600,
		type: ItemTypes.Boost,
		usable: true,
		usage: "Use this potion to give 30% xp boost for 1 hour. Standard xp cooldowns apply even after consuming this bottle. There's also a chance you die to this drink",
		value: 'potionWeak'
	}),
	potionMild: CreateNewItem({
		name: 'Mild Vampiric Vitality Vile',
		description:
			"And then, her neighbors come knockin' on her door the next day, see her laid out on the floor. They hit up her sister, and 10 minutes later. ",
		emoji: '<:Vampiric_Vitality_Vile_mild:1163161198016069702>',
		sellable: true,
		sellPrice: 0,
		price: 1000,
		type: ItemTypes.Boost,
		usable: true,
		usage: "Use this potion to give 40% xp boost for 1 hour. Standard xp cooldowns apply even after consuming this bottle. There's also a chance you die to this drink x 2",
		value: 'potionMild'
	}),
	potionStrong: CreateNewItem({
		name: 'Strong Vampiric Vitality Vile',
		description:
			"And then, her neighbors come knockin' on her door the next day, see her laid out on the floor. They hit up her sister, and 10 minutes later. ",
		emoji: '<:Vampiric_Vitality_Vile_mild:1163161198016069702>',
		sellable: true,
		sellPrice: 0,
		price: 1500,
		type: ItemTypes.Boost,
		usable: true,
		usage: "Use this potion to give 50% xp boost for 1 hour. Standard xp cooldowns apply even after consuming this bottle. There's also a chance you die to this drink x 3",
		value: 'potionStrong'
	})
} as const;

export const Crates: Record<CrateItemValue, CrateDropType> = {
	commonCrate: {
		name: 'Common Crate',
		value: 'commonCrate',
		image: CrateAssets.Common.Image,
		weight: 90,
		emoji: CrateAssets.Common.Emoji,
		description: 'A crate with common items.'
	},
	uncommonCrate: {
		name: 'Uncommon Crate',
		value: 'uncommonCrate',
		image: CrateAssets.Uncommon.Image,
		weight: 50,
		emoji: CrateAssets.Uncommon.Emoji,
		description: 'A crate with uncommon items.'
	},
	rareCrate: {
		name: 'Rare Crate',
		value: 'rareCrate',
		image: CrateAssets.Rare.Image,
		weight: 5,
		emoji: CrateAssets.Rare.Emoji,
		description: 'A crate with rare items.'
	},
	mythicCrate: {
		name: 'Mythical Crate',
		value: 'mythicCrate',
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
		weight: 10
	},
	levelUp2: {
		name: '+2 Level',
		amount: 2,
		description: 'Gain +2 Levels',
		type: 'levelUp',
		weight: 5
	},
	levelUp3: {
		name: '+3 Levels',
		amount: 3,
		description: 'Gain +3 Levels',
		type: 'levelUp',
		weight: 2
	},
	xpBoost20: {
		name: Items.xpBoost20.name,
		amount: 0.2,
		description: Items.xpBoost20.description,
		type: 'xpBoost',
		weight: 65,
		durationMs: hours(2)
	},
	xpBoost30: {
		name: '+30% XP Boost',
		amount: 0.3,
		description: 'Gain +30% XP',
		type: 'xpBoost',
		weight: 40,
		durationMs: hours(2)
	},
	xpBoost50: {
		name: Items.xpBoost50.name,
		amount: 0.5,
		description: Items.xpBoost50.description,
		type: 'xpBoost',
		weight: 20,
		durationMs: hours(2)
	}
};

export const CommonLootTable = [
	LootTableEntry<ItemValue>('coin', 80, 20, 80, 3, 0),
	LootTableEntry<ItemValue>('potionWeak', 5, 1, 1, 1, 1),
	LootTableEntry<ItemValue>(null, 95, 1, 1, 1, 1) // Placeholder entry for illustration
];

export const UncommonLootTable = [
	// Include items from common crate
	...CommonLootTable,
	LootTableEntry<ItemValue>('potionMild', 15, 1, 1, 1, 1),
	LootTableEntry<ItemValue>('hat', 10, 1, 1, 1, 1)
	// Add more uncommon items as needed
];

export const RareLootTable = [
	// Include items from common and uncommon crates
	...CommonLootTable,
	...UncommonLootTable,
	LootTableEntry<ItemValue>('candyCane', 10, 1, 1, 1, 1),
	LootTableEntry<ItemValue>('ticket', 5, 1, 1, 1, 1)
	// Add more rare items as needed
];

export const MythicLootTable = [
	// Include items from common, uncommon, and rare crates
	...CommonLootTable,
	...UncommonLootTable,
	...RareLootTable,
	LootTableEntry<ItemValue>('grimoire', 5, 1, 1, 1, 1)
	// Add more mythic items as needed
];

export const LootTables: Record<string, ILootTableEntry<string, number, LootTable<string, number>>[]> = {
	commonCrate: CommonLootTable,
	uncommonCrate: UncommonLootTable,
	rareCrate: RareLootTable,
	mythicCrate: MythicLootTable
};

const shopItemsArray: ReadonlyArray<Item> = Object.values(Items);
export { shopItemsArray };
