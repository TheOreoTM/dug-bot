export type BaseDropType = {
	name: string;
	description: string;
	weight: number;
	image?: string;
};

export type LevelingDropType = BaseDropType & {
	type: 'xpBoost' | 'levelUp';
	amount: number;
	durationMs?: number;
};

export type CrateDropType = BaseDropType & {
	image: string;
	emoji: string;
};
