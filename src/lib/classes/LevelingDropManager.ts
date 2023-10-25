import { BoostItems } from '#lib/items';
import { ItemValue } from '#lib/types/Data';
import { LevelingDropType } from '#lib/types/Drops';
import { BaseDropManager } from './BaseDropManager';

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
