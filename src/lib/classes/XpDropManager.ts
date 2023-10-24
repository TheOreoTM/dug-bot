import { DugColors } from '#constants';
import { LevelingDropType } from '#lib/types/Drops';
import { BaseDropManager } from './BaseDropManager';

export class LevelingDropManager extends BaseDropManager<LevelingDropType> {
	override dropsAvailable: Record<string, LevelingDropType> = levelingDrops;
	static override instance: LevelingDropManager;
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

const levelingDrops: Record<string, LevelingDropType> = {
	levelUp1: {
		amount: 1,
		color: DugColors.Default,
		description: 'Gain +1 Level',
		type: 'levelUp',
		weight: 30
	},
	levelUp2: {
		amount: 2,
		color: DugColors.Default,
		description: 'Gain +2 Levels',
		type: 'levelUp',
		weight: 15
	},
	levelUp3: {
		amount: 3,
		color: DugColors.Default,
		description: 'Gain +3 Levels',
		type: 'levelUp',
		weight: 5
	},
	xpBoost30: {
		amount: 0.2,
		color: DugColors.Default,
		description: 'Gain +30% XP',
		type: 'xpBoost',
		weight: 80
	},
	xpBoost50: {
		amount: 0.5,
		color: DugColors.Default,
		description: 'Gain +50% XP',
		type: 'xpBoost',
		weight: 40
	}
};
