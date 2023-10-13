import { Collection } from 'discord.js';
import { ItemType } from './types/Data';
import { ItemTypes } from './types/Enums';
import { DropTypes } from './classes/DropManager';
import { DugEmojis } from '#constants';

const shopItemsArray: ItemType[] = [
	{
		name: 'Minor cipher hint',
		description: 'A Minor Hint for the cipher task',
		value: 'minor cipher hint',
		usage: 'Use this item to get a minor hint for the ongoing cipher',
		usable: true,
		type: ItemTypes.Tool,
		emoji: '🧩',
		price: 30,
		sellable: true
	},
	{
		name: 'Medium cipher hint',
		description: 'A Medium Hint for the cipher task',
		value: 'medium cipher hint',
		usage: 'Use this item to get a medium hint for the ongoing cipher',
		usable: true,
		type: ItemTypes.Tool,
		emoji: '🧩',
		price: 60,
		sellable: true
	},
	{
		name: 'Major cipher hint',
		description: 'A Major Hint for the cipher task',
		value: 'major cipher hint',
		usage: 'Use this item to get a major hint for the ongoing cipher',
		usable: true,
		type: ItemTypes.Tool,
		emoji: '🧩',
		price: 90,
		sellable: true
	},
	{
		name: 'Points booster',
		description: 'This item is used to gain +3% of points after the end of the day',
		value: 'rose',
		usage: 'Use this item to gain +3% of points after the end of the day',
		usable: true,
		type: ItemTypes.Tool,
		emoji: '🪙',
		price: -1,
		sellable: true
	},
	{
		name: 'Aha Badge',
		description: 'The struggle is real',
		value: 'aha badge',
		usage: 'None',
		usable: false,
		type: ItemTypes.Badge,
		emoji: '🫀',
		price: 0,
		sellable: false
	}
];

const dropItemsArray: ItemType[] = [
	{
		name: 'Legendary Crate',
		description: DropTypes['legendary'].description,
		emoji: DugEmojis.LegendaryCrate,
		price: 0,
		sellable: false,
		type: ItemTypes.Item,
		usable: true,
		usage: 'Open a legendary crate',
		value: `legendarycrate`
	},

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

const allItemsArray: ItemType[] = [...shopItemsArray, ...dropItemsArray];

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
