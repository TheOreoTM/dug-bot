import { LootTables } from '#lib/items';
import { InventoryItemType } from '#lib/types';
import { GetLoot } from 'loot-table-advanced';

export class Crate {
	public constructor(private readonly crate: InventoryItemType) {
		this.crate = crate;
	}

	public open(amount = 1) {
		const crateLootTable = LootTables[this.crate.value];
		return GetLoot(crateLootTable, amount);
	}
}
