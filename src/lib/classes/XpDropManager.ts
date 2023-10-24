import { DugColors } from '#constants';
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

const levelingDrops: Record<ItemValue, LevelingDropType> = {
	levelUp1: {
		name: '+1 Level',
		amount: 1,
		color: DugColors.Default,
		description: 'Gain +1 Level',
		type: 'levelUp',
		weight: 30
	},
	levelUp2: {
		name: '+2 Level',
		amount: 2,
		color: DugColors.Default,
		description: 'Gain +2 Levels',
		type: 'levelUp',
		weight: 15
	},
	levelUp3: {
		name: '+3 Levels',
		amount: 3,
		color: DugColors.Default,
		description: 'Gain +3 Levels',
		type: 'levelUp',
		weight: 5
	},
	xpBoost30: {
		name: '+30% XP Boost',
		amount: 0.3,
		color: DugColors.Default,
		description: 'Gain +30% XP',
		type: 'xpBoost',
		weight: 80
	}
};
