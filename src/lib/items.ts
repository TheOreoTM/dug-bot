import { Collection } from 'discord.js';
import { ItemType } from './types/Data';
import { ItemTypes, Items } from './types/Enums';
import { DropTypes } from './classes/DropManager';
import { DugEmojis } from '#constants';
import { LootTable, LootTableEntry } from 'loot-table-advanced';

const shopItemsArray: ReadonlyArray<ItemType> = [];

const dropItemsArray: ReadonlyArray<ItemType> = [
	// {
	// 	name: 'Legendary Crate',
	// 	description: DropTypes['legendary'].description,
	// 	emoji: DugEmojis.LegendaryCrate,
	// 	price: 0,
	// 	sellable: false,
	// 	type: ItemTypes.Item,
	// 	usable: true,
	// 	usage: 'Open a legendary crate',
	// 	value: `legendarycrate`
	// },

	{
		name: 'Mythical Crate',
		description: DropTypes['mythic'].description,
		emoji: DugEmojis.MythicCrate,
		price: 0,
		sellable: false,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Open a mythical crate',
		value: Items.MythicCrate
	},

	{
		name: 'Golden Crate',
		description: DropTypes['gold'].description,
		emoji: DugEmojis.GoldCrate,
		price: 0,
		sellable: false,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Open a golden crate',
		value: Items.GoldCrate
	},
	{
		name: 'Silver Crate',
		description: DropTypes['silver'].description,
		emoji: DugEmojis.SilverCrate,
		price: 0,
		sellable: false,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Open a silver crate',
		value: Items.SilverCrate
	},
	{
		name: 'Bronze Crate',
		description: DropTypes['bronze'].description,
		emoji: DugEmojis.BronzeCrate,
		price: 0,
		sellable: false,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Open a bronze crate',
		value: Items.BronzeCrate
	}
];

const lootItemsArray: ReadonlyArray<ItemType> = [
	{
		name: 'Lotto Ticket',
		description: 'Get a chance to win nitro',
		emoji: '🎫',
		price: 0,
		sellable: true,
		value: Items.Ticket,
		usable: true,
		sellPrice: 10000,
		type: ItemTypes.Item,
		usage: 'Use this item to participate in the nitro giveaway'
	},
	{
		name: 'Lotto Ticket Fragment',
		description: 'A small piece of the Lotto Ticket',
		emoji: '🎫',
		price: 0,
		sellable: true,
		value: Items.TicketFragment,
		usable: true,
		sellPrice: 1500,
		type: ItemTypes.Item,
		usage: 'Collect 5 of these fragments to craft a Lotto Ticket'
	},
	{
		name: 'Coins',
		description: 'Use coins to buy items from the shop',
		emoji: '🪙',
		price: 0,
		sellable: true,
		sellPrice: 1,
		type: ItemTypes.Item,
		usable: false,
		usage: 'Spend it in the shop',
		value: Items.Coins
	}
];

const allItemsArray: ReadonlyArray<ItemType> = [...shopItemsArray, ...dropItemsArray, ...lootItemsArray];

export const DropItems = new Collection<string, ItemType>();
dropItemsArray.map((item) => {
	DropItems.set(item.value, item);
});

export const ShopItems = new Collection<string, ItemType>();
shopItemsArray.map((item) => {
	ShopItems.set(item.value, item);
});

export const LootItems = new Collection<string, ItemType>();
lootItemsArray.map((item) => {
	LootItems.set(item.value, item);
});

export const AllItems = new Collection<string, ItemType>();
allItemsArray.map((item) => {
	AllItems.set(item.value, item);
});

export const MythicLootTable: LootTable = [
	LootTableEntry('coins', 55, 50, 150, 6, 1),
	LootTableEntry('sword', 8, 1, 1, 1, 2),
	LootTableEntry('gold', 15, 1, 4, 1, 2),
	LootTableEntry('silver', 25, 4, 10, 2, 2),
	LootTableEntry('diamond', 8, 1, 3, 1, 2)
];

export const GoldLootTable: LootTable = [
	LootTableEntry('coin', 60, 15, 70, 8, 1),
	LootTableEntry('sword', 8, 1, 1, 1, 2),
	LootTableEntry('gold', 10, 1, 4, 1, 2),
	LootTableEntry('silver', 20, 4, 10, 2, 2)
];

export const SilverLootTable: LootTable = [
	LootTableEntry('coin', 80, 20, 60, 8, 1),
	LootTableEntry('sword', 8, 1, 1, 1, 2),
	LootTableEntry('silver', 20, 4, 10, 2, 2),
	LootTableEntry(null, 20, 1, 1, 1, 2)
];

export const BronzeLootTable: LootTable = [
	LootTableEntry('coin', 85, 20, 60, 8, 1),
	LootTableEntry('sword', 4, 1, 1, 1, 2),
	LootTableEntry(Items.Ticket, 90, 1, 5, 1, 3),
	LootTableEntry(null, 10, 1, 1, 1, 2)
];
