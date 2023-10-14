import { BronzeLootTable, GoldLootTable, MythicLootTable, SilverLootTable } from '#lib/items';
import { DropRarityType } from '#lib/types/Data';
import { GetLoot } from 'loot-table-advanced';

export class Crate {
	// private legendaryLootTable = legendaryLootTable;
	private mythicLootTable = MythicLootTable;
	private goldLootTable = GoldLootTable;
	private silverLootTable = SilverLootTable;
	private bronzeLootTable = BronzeLootTable;

	public constructor(readonly crateId: DropRarityType) {
		this.crateId = crateId;
	}

	public open() {
		switch (this.crateId) {
			// case 'legendary':
			// 	return this.openLegendary();
			case 'mythic':
				return this.openMythic();
			case 'gold':
				return this.openGold();
			case 'silver':
				return this.openSilver();
			case 'bronze':
				return this.openBronze();
			default:
				return this.openBronze();
		}
	}

	private openBronze() {
		const loot = GetLoot(this.bronzeLootTable);
		return loot;
	}

	private openSilver() {
		const loot = GetLoot(this.silverLootTable);
		return loot;
	}

	private openGold() {
		const loot = GetLoot(this.goldLootTable);
		return loot;
	}

	private openMythic() {
		const loot = GetLoot(this.mythicLootTable);
		return loot;
	}

	// private openLegendary() {
	// 	const loot = GetLoot(this.legendaryLootTable);
	// 	return loot;
	// }
}

// const legendaryLootTable: LootTable = [
// 	LootTableEntry('coin', 50, 80, 200, 8, 1),
// 	LootTableEntry('sword', 10, 1, 1, 1, 2),
// 	LootTableEntry('gold', 20, 1, 5, 1, 2),
// 	LootTableEntry('silver', 30, 5, 10, 2, 2),
// 	LootTableEntry('diamond', 10, 1, 3, 1, 2),
// 	LootTableEntry('pearls', 5, 1, 5, 1, 2)
// ];
