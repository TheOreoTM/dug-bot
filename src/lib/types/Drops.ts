import { ColorResolvable } from 'discord.js';

export type BaseDropType = {
	name: string;
	color: ColorResolvable;
	description: string;
	weight: number;
	image?: string;
};

export type LevelingDropType = BaseDropType & {
	type: 'xpBoost' | 'levelUp';
	amount: number;
	durationMs?: number;
};
