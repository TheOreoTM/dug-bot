import { BaseItemType, InventoryItemType, ItemType, ItemValue } from '#lib/types/Data';
import { ItemTypes } from '#lib/types/Enums';
import { convertValueToBadge } from '#lib/util/formatter';
import { container } from '@sapphire/framework';

export namespace Economy {
	export class Item implements BaseItemType {
		public name: string;
		public description: string;
		public usage: string;
		public usable: boolean;
		public type: ItemType;
		public emoji: string;
		public sellable: boolean;
		public sellPrice?: number | undefined;
		public value: ItemValue;
		public price: number;

		public constructor(data: BaseItemType) {
			this.name = data.name;
			this.description = data.description;
			this.usable = data.usable;
			this.usage = data.usage;
			this.type = data.type;
			this.emoji = data.emoji;
			this.sellable = data.sellable;
			this.value = data.value;
			this.price = data.price;
		}

		public canBuy(balance: number) {
			return balance >= this.price;
		}

		public async buy(customer: string, free = false) {
			const item = new Item(this);
			const data: InventoryItemType = {
				...item,
				ownerId: customer
			};
			const inventoryItem = new InventoryItem(data);

			if (item.type !== ItemTypes.Badge) {
				const purchase = await container.db.item
					.create({
						data: {
							...inventoryItem,
							ownerId: customer
						}
					})
					.then(async () => {
						if (free) return;
						await container.db.user.update({
							where: {
								id: customer
							},
							data: {
								cash: {
									decrement: inventoryItem.price
								}
							}
						});
					})
					.catch(() => {
						null;
					});

				return purchase;
			}

			if (item.type === ItemTypes.Badge) {
				const badge = convertValueToBadge(item.value);
				if (!badge) {
					return console.log(`Badge ${badge} is not implemented but is avaiable for purchase`);
				}
				await container.db.user.update({
					where: {
						id: customer
					},
					data: {
						badges: {
							push: badge
						}
					}
				});
			}
		}
	}

	export class InventoryItem extends Item implements InventoryItemType {
		public readonly ownerId: string | null;

		public constructor(data: InventoryItemType) {
			super(data);
			this.ownerId = data.ownerId;
		}

		public use() {}

		public async sell() {
			const amount = this.price;
			const sellAmount = Math.floor(amount * 0.75);

			await container.db.user.update({
				where: {
					id: this.ownerId!
				},
				data: {
					cash: {
						increment: sellAmount
					}
				}
			});
		}
	}
}
