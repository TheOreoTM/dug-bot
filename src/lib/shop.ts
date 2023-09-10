import { ShopItem } from './types/Data';

const itemsArray: ShopItem[] = [
	{
		name: 'Minor cipher hint',
		description: 'A Minor Hint for the cipher task',
		value: 'minor cipher hint',
		usage: 'Use this item to get a minor hint for the ongoing cipher',
		usable: true,
		type: 'Tool',
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
		type: 'Tool',
		emoji: '🧩🧩',
		price: 60,
		sellable: true
	},
	{
		name: 'Major cipher hint',
		description: 'A Major Hint for the cipher task',
		value: 'major cipher hint',
		usage: 'Use this item to get a major hint for the ongoing cipher',
		usable: true,
		type: 'Tool',
		emoji: '🧩🧩🧩',
		price: 90,
		sellable: true
	}
];

const ShopItems = new Map<string, ShopItem>();
itemsArray.map((item) => {
	ShopItems.set(item.value, item);
});
