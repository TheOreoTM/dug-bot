export const CrateAssets = {
	Common: {
		Image: 'https://i.imgur.com/ZYB2r1f.png',
		Emoji: '<:crate_common:1162792170277834792>'
	},
	Uncommon: {
		Image: 'https://i.imgur.com/M5xKemu.png',
		Emoji: '<:crate_uncommon:1162792140456333453>'
	},
	Rare: {
		Image: 'https://i.imgur.com/cJqMcyq.png',
		Emoji: '<:crate_rare:1162792090451853383>'
	},
	Mythic: {
		Image: 'https://i.imgur.com/Wq756bZ.png',
		Emoji: '<:crate_mythic:1162792060110245979>'
	}
};

export const CrateEmojis = {
	Common: '<:crate_common:1162792170277834792>'
};

export const Crates = {
	common: {
		name: 'Common Crate',
		image: CrateAssets.Common.Image,
		weight: 90,
		emoji: CrateAssets.Common.Emoji,
		description: 'A crate with common items.'
	},
	uncommon: {
		name: 'Uncommon Crate',
		image: CrateAssets.Uncommon.Image,
		weight: 50,
		emoji: CrateAssets.Uncommon.Emoji,
		description: 'A crate with uncommon items.'
	},
	rare: {
		name: 'Rare Crate',
		image: CrateAssets.Rare.Image,
		weight: 5,
		emoji: CrateAssets.Rare.Emoji,
		description: 'A crate with rare items.'
	},
	mythic: {
		name: 'Mythical Crate',
		image: CrateAssets.Mythic.Image,
		weight: 1,
		emoji: CrateAssets.Mythic.Emoji,
		description: 'A crate with mythic items.'
	}
};
