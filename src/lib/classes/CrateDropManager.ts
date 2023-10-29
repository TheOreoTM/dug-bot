import { BaseDropManager } from '#lib/classes';
import { Crates } from '#lib/items';
import { CrateDropType, CrateItemValue } from '#lib/types';

export class CrateDropManager extends BaseDropManager<CrateDropType> {
	override dropsAvailable: Record<string, CrateDropType> = crateDrops;
	protected static override instance: CrateDropManager;
	private constructor() {
		super(crateDrops);
	}

	public static override getInstance(): CrateDropManager {
		if (!CrateDropManager.instance) {
			CrateDropManager.instance = new CrateDropManager();
		}
		return this.instance;
	}
}

const crateDrops: Record<CrateItemValue, CrateDropType> = Crates;
