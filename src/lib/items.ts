import { Collection } from 'discord.js';
import { ItemType } from './types/Data';
import { ItemTypes } from './types/Enums';
import { DropTypes } from './classes/DropManager';
import { DugEmojis } from '#constants';

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
		value: `mythiccrate`
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
		value: `goldcrate`
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
		value: `silvercrate`
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
		value: `bronzecrate`
	}
];

const allItemsArray: ReadonlyArray<ItemType> = [...shopItemsArray, ...dropItemsArray];

export const DropItems = new Collection<string, ItemType>();
dropItemsArray.map((item) => {
	DropItems.set(item.value, item);
});

export const ShopItems = new Collection<string, ItemType>();
shopItemsArray.map((item) => {
	ShopItems.set(item.value, item);
});

export const AllItems = new Collection<string, ItemType>();
allItemsArray.map((item) => {
	AllItems.set(item.value, item);
});
