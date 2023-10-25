import { BoostItems } from '#lib/items';
import { LevelingDropType, ItemValue } from '#lib/types';
import { BaseDropManager } from '#lib/classes';

export class LevelingDropManager extends BaseDropManager<LevelingDropType> {
	override dropsAvailable: Record<string, LevelingDropType> = levelingDrops;
	protected static override instance: LevelingDropManager;
	private constructor() {
		super(levelingDrops);
	}

	public static override getInstance(): LevelingDropManager {
		if (!LevelingDropManager.instance) {
			LevelingDropManager.instance = new LevelingDropManager();
		}
		return this.instance;
	}
}

const levelingDrops: Record<ItemValue, LevelingDropType> = BoostItems;
