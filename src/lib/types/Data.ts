import { Badge, FactionStatus, Title, User } from '@prisma/client';

export const SelectAllOptions = {
	id: true,
	ownerId: true,
	name: true,
	description: true,
	iconUrl: true,
	badges: true,
	titles: true,
	members: true,
	joinType: true,
	pendingMemberIds: true
};

export type FactionType = {
	id: number;
	ownerId: string;
	name: string;
	description: string;
	iconUrl: string;
	badges: Badge[];
	titles: Title[];
	members?: User[];
	joinType: FactionStatus;
	pendingMemberIds: string[];
};

export const BadgeIcons = {
	[Badge.BETA_TESTER]: '🐛',
	[Badge.ELITE_LEVEL]: '✨'
} as const;

export type BadgeIcons = (typeof BadgeIcons)[keyof typeof BadgeIcons];

export const TitleTexts = {
	[Title.BETA_TESTER]: 'Beta Tester',
	[Badge.ELITE_LEVEL]: 'Elite Level'
} as const;

export type TitleTexts = (typeof TitleTexts)[keyof typeof TitleTexts];
