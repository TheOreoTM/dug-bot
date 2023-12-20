export const enum ItemTypes {
	Item = 'ITEM',
	Tool = 'TOOL',
	Boost = 'BOOST',
	Badge = 'BADGE',
	Title = 'TITLE',
	Crate = 'CRATE'
}

// ! Always add to the end
export const enum Badge {
	EventWinner = 'EVENT_WINNER'
}

export const BadgeIcons = {
	[Badge.EventWinner]: `<:crown:1187015975678246912>`
} as const;

export type BadgeIcon = (typeof BadgeIcons)[keyof typeof BadgeIcons];

export const enum PermissionLevels {
	Everyone = 0,
	EventManager = 5,
	Administrator = 6,
	BotOwner = 10
}
