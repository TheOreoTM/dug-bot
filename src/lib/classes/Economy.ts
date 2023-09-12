import { InventoryItemType, ItemType } from '#lib/types/Data';
import { ItemTypes } from '#lib/types/Enums';
import { container } from '@sapphire/framework';
export namespace Economy {
	class Item implements ItemType {
		public readonly name: string;
		public readonly description: string;
		public readonly usage: string;
		public readonly usable: boolean;
		public readonly type: ItemTypes;
		public readonly emoji: string;
		public readonly sellable: boolean;
		public readonly value: string;
		public readonly price: number;

		public constructor(data: ItemType) {
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

		public async buy(customer: string) {
			const item = new Item(this);
			const data: InventoryItemType = {
				...item,
				ownerId: customer
			};
			const inventoryItem = new InventoryItem(data);

			const purchase = await container.db.item
				.create({
					data: {
						...inventoryItem,
						ownerId: customer
					}
				})
				.then(async () => {
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
	}

	class InventoryItem extends Item implements InventoryItemType {
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
