import { DropRarityType } from '#lib/types/Data';
import { GetLoot, LootTable, LootTableEntry } from 'loot-table-advanced';

export class Crate {
	private legendaryLootTable = legendaryLootTable;
	private mythicLootTable = mythicLootTable;
	private goldLootTable = goldLootTable;
	private silverLootTable = silverLootTable;
	private bronzeLootTable = bronzeLootTable;

	// public constructor(data: Partial<DropType>) {
	// 	this.data = {
	// 		color: data.color || DugColors.Halloween,
	// 		description: data.description || 'A crate',
	// 		id: data.id || 'bronze',
	// 		image: data.image || '',
	// 		items: data.items || [],
	// 		weight: data.weight || 50
	// 	};
	// }

	public constructor(readonly crateId: DropRarityType) {
		this.crateId = crateId;
	}

	public open() {
		switch (this.crateId) {
			case 'legendary':
				return this.openLegendary();
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

	private openLegendary() {
		const loot = GetLoot(this.legendaryLootTable);
		return loot;
	}
}

const legendaryLootTable: LootTable = [
	LootTableEntry('coin', 50, 80, 200, 8, 1),
	LootTableEntry('sword', 10, 1, 1, 1, 2),
	LootTableEntry('gold', 20, 1, 5, 1, 2),
	LootTableEntry('silver', 30, 5, 10, 2, 2),
	LootTableEntry('diamond', 10, 1, 3, 1, 2),
	LootTableEntry('pearls', 5, 1, 5, 1, 2)
];

const mythicLootTable: LootTable = [
	LootTableEntry('coin', 55, 50, 150, 6, 1),
	LootTableEntry('sword', 8, 1, 1, 1, 2),
	LootTableEntry('gold', 15, 1, 4, 1, 2),
	LootTableEntry('silver', 25, 4, 10, 2, 2),
	LootTableEntry('diamond', 8, 1, 3, 1, 2)
];

const goldLootTable: LootTable = [
	LootTableEntry('coin', 60, 15, 70, 8, 1),
	LootTableEntry('sword', 8, 1, 1, 1, 2),
	LootTableEntry('gold', 10, 1, 4, 1, 2),
	LootTableEntry('silver', 20, 4, 10, 2, 2)
];

const silverLootTable: LootTable = [
	LootTableEntry('coin', 80, 20, 60, 8, 1),
	LootTableEntry('sword', 8, 1, 1, 1, 2),
	LootTableEntry('silver', 20, 4, 10, 2, 2),
	LootTableEntry(null, 20)
];

const bronzeLootTable: LootTable = [LootTableEntry('coin', 85, 20, 60, 8, 1), LootTableEntry('sword', 4, 1, 1, 1, 2)];
