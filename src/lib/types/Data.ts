import { Items } from '#lib/items';
import { Badge, FactionStatus, Title, User } from '@prisma/client';
import { ItemTypes } from '#lib/types';

export type BadgeType = {
	name: string;
	price: number;
	badgeIcon: string;
	description: string;
	value: string;
};

/**
 * Redis Key
 */
export type Key = string & { _: never };

export type ItemType = Uppercase<keyof typeof ItemTypes>;

export type NewItem = {
	// Define properties of the new item
	description: string;
	name: string;
	emoji: string;
	price: number;
	sellable: boolean;
	type: ItemType;
	usable: boolean;
	usage: string;
	value: string;
	sellPrice?: number;
};

export function CreateNewItem(item: NewItem) {
	return { ...item } as const;
}

export type BaseItemType = {
	description: string;
	name: string;
	emoji: string;
	price: number;
	sellable: boolean;
	type: ItemType;
	usable: boolean;
	usage: string;
	value: string;
	sellPrice?: number;
};

export type Item = (typeof Items)[keyof typeof Items];
export type ItemValue = keyof typeof Items;

export type XpBoostItemValue = {
	[K in keyof typeof Items]: K extends `xpBoost${string}` ? K : never;
}[keyof typeof Items];

export type LevelUpItemValue = {
	[K in keyof typeof Items]: K extends `levelUp${string}` ? K : never;
}[keyof typeof Items];

export type CrateItemValue = {
	[K in keyof typeof Items]: K extends `${string}Crate` ? K : never;
}[keyof typeof Items];

export type BoostItemValue = XpBoostItemValue | LevelUpItemValue;

export type LootItemType = {
	id: string;
	amount: {
		min: number;
		max: number;
	};
	weight: number;
};

export type InventoryItemType = BaseItemType & {
	ownerId: string | null;
};

export type ShopItemType = BaseItemType & {
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
