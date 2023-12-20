import { Items } from '#lib/items';
import { Title, User } from '@prisma/client';
import { BadgeIcon, ItemTypes } from '#lib/types';

export type LeaderboardPositionData = {
	top: number;
	tag: string;
	score: number;
	avatar: string;
};

export type LeaderboardPageData = LeaderboardPositionData[];

export type BadgeType = {
	id: string;
	name: string;
	price: number;
	icon: BadgeIcon;
	description: string;
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
	pendingMemberIds: true,
	tokens: true
};

export type FactionType = {
	id: number;
	ownerId: string;
	name: string;
	description: string;
	iconUrl: string;
	badges: string[];
	titles: Title[];
	members?: User[];
	tokens: number;
	pendingMemberIds: string[];
};

// export const BadgeIcons = {
// 	[Badge.BETA_TESTER]: '🐛',
// 	[Badge.ELITE_LEVEL]: '✨',
// 	[Badge.AHA_BADGE]: '🫀'
// } as const;

// export type BadgeIcons = (typeof BadgeIcons)[keyof typeof BadgeIcons];

export const TitleTexts = {
	[Title.BETA_TESTER]: 'Beta Tester',
	[Title.ELITE_LEVEL]: 'Elite Level'
} as const;

export type TitleTexts = (typeof TitleTexts)[keyof typeof TitleTexts];
