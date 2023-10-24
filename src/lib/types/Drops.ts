import { ColorResolvable } from 'discord.js';

export type BaseDropType = {
	color: ColorResolvable;
	description: string;
	weight: number;
	image?: string;
};

export type LevelingDropType = BaseDropType & {
	type: 'xpBoost' | 'levelUp';
	amount: number;
};
