import { DugColors } from '#constants';
import { AllItems } from '#lib/items';
import { DropType, ItemType } from '#lib/types/Data';

export class Crate {
	data: DropType;
	public constructor(data: Partial<DropType>) {
		this.data = {
			color: data.color || DugColors.Halloween,
			description: data.description || 'A crate',
			id: data.id || 'bronze',
			image: data.image || '',
			items: data.items || [],
			weight: data.weight || 50
		};
	}

	public open(amount = 1) {
		if (amount > 1) {
			return this.openBulk();
		}

		const items = this.data.items;
		const itemDatas: ItemType[] = [];
		items.map((item) => {
			const data = AllItems.get(item);
			if (data) itemDatas.push(data);
		});
	}

	private openBulk() {}
}
