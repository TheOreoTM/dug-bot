import { Badge, FactionStatus, Title, User } from '@prisma/client';
import { ColorResolvable } from 'discord.js';

export type BadgeType = {
	name: string;
	price: number;
	badgeIcon: string;
	description: string;
	value: string;
};

export type ItemType = {
	name: string;
	description: string;
	usage: string;
	usable: boolean;
	type: string;
	emoji: string;
	sellable: boolean;
	value: string;
	price: number;
};

export type LootItemType = {
	id: string;
	amount: {
		min: number;
		max: number;
	};
	weight: number;
};

export type InventoryItemType = ItemType & {
	ownerId: string | null;
};

export type ShopItemType = ItemType & {
	price: number;
};

export type InventoryItemTypeWithCount = InventoryItemType & {
	count: number;
};

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
	[Badge.ELITE_LEVEL]: '✨',
	[Badge.AHA_BADGE]: '🫀'
} as const;

export type BadgeIcons = (typeof BadgeIcons)[keyof typeof BadgeIcons];

export const TitleTexts = {
	[Title.BETA_TESTER]: 'Beta Tester',
	[Title.ELITE_LEVEL]: 'Elite Level'
} as const;

export type TitleTexts = (typeof TitleTexts)[keyof typeof TitleTexts];

export type DropType = {
	color: ColorResolvable;
	image: string;
	description: string;
	/**
	 * The unique value of the item in the shop
	 */
	items: string[];
	id: DropRarityType;
	weight: number;
};

export type DropRarityType = 'mythic' | 'gold' | 'silver' | 'bronze'; // | 'legendary'
export enum DropRarityTypes {
	// Legendary = 'legendary',
	Mythic = 'mythic',
	Gold = 'gold',
	Silver = 'silver',
	Bronze = 'bronze'
}
