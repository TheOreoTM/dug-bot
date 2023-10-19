import { DugColors, DugEmojis } from '#constants';
import { BadgeIcons, FactionType, InventoryItemTypeWithCount, TitleTexts } from '#lib/types/Data';
import { Badge, Title } from '@prisma/client';
import { container } from '@sapphire/framework';
import { EmbedBuilder, GuildMember, PermissionsString, userMention } from 'discord.js';

export function progressBar(
	Bar1empty: string,
	Bar1mid: string,
	Bar1full: string,
	Bar2empty: string,
	Bar2mid: string,
	Bar2high: string,
	Bar2full: string,
	Bar3empty: string,
	Bar3mid: string,
	Bar3full: string,
	value: number,
	maxValue: number,
	size: number,
	percents: boolean
) {
	let barArray: string[] = [];
	if (isNaN(value) || isNaN(maxValue)) throw new Error('maxValue or value is not a number');

	if (size < 3) {
		size = 6;
		console.warn('if you set the size to less than 3, your size will be reset to 6');
	}
	size = Math.trunc(size);
	const percent = value > maxValue ? 100 : ((value / maxValue) * 100).toFixed(1);
	const full = Math.floor(size * (value / maxValue > 1 ? 1 : value / maxValue));
	let full_notround = 0;
	if (value < maxValue) {
		full_notround = parseFloat((size * (value / maxValue > 1 ? 1 : value / maxValue)).toFixed(2));
	} else {
		full_notround = size;
	}
	const full_trunc = size * (value / maxValue > 1 ? 1 : value / maxValue);
	const full_ceil = Math.ceil(size * (value / maxValue > 1 ? 1 : value / maxValue));
	const full_decimal = (full_notround - Math.trunc(full_notround)).toFixed(2);
	const empty = size - full > 0 ? size - full : 0;

	if (value < maxValue) {
		for (let i = 1; i <= full; i++) barArray.push(Bar2full);
		for (let i = 1; i <= empty; i++) barArray.push(Bar2empty);

		if (parseFloat(full_decimal) > 0.2 && parseFloat(full_decimal) <= 0.8) {
			barArray[full] = Bar2mid;
		} else if (parseFloat(full_decimal) <= 0.2 && full_notround < 2) {
			barArray[full - 1] = Bar2full;
			barArray[full] = Bar2mid;
		} else if (parseFloat(full_decimal) <= 0.2) {
			barArray[full - 1] = Bar2empty;
			barArray[full - 2] = Bar2high;
			if (full_notround < 3) barArray[full - 1] = Bar2high;
		} else if (parseFloat(full_decimal) > 0.8 && full_trunc <= size - 1 && full_ceil == 1) {
			barArray[full] = Bar2full;
			barArray[full + 1] = Bar2mid;
		} else if (parseFloat(full_decimal) > 0.8 && full_trunc <= size - 1) {
			if (full_ceil == 2) barArray[full] = Bar2high;
			barArray[full] = Bar2high;
		} else if (parseFloat(full_decimal) > 0.8 && full_trunc > size - 1) {
			barArray[full] = Bar2high;
		}
	} else if (value >= maxValue) {
		for (let i = 1; i <= full; i++) barArray.push(Bar2full);
	}
	const barlen = barArray.length;

	switch (barArray[0]) {
		case Bar2full: {
			barArray[0] = Bar1full;
			break;
		}
		case Bar2high: {
			barArray[0] = Bar1full;
			break;
		}
		case Bar2mid: {
			barArray[0] = Bar1mid;
			break;
		}
		default: {
			barArray[0] = Bar1empty;
			break;
		}
	}

	switch (barArray[barlen - 1]) {
		case Bar2full: {
			barArray[barlen - 1] = Bar3full;
			break;
		}
		case Bar2high: {
			barArray[barlen - 1] = Bar3full;
			break;
		}
		case Bar2mid: {
			barArray[barlen - 1] = Bar3mid;
			break;
		}
		default: {
			barArray[barlen - 1] = Bar3empty;
			break;
		}
	}

	if (percents == true) {
		return {
			barString: barArray.join(``),
			percent: barArray.join(``) + ' ' + percent
		};
	} else {
		return barArray.join(``);
	}
}

export function formatItems(itemCounts: Record<string, InventoryItemTypeWithCount>) {
	const formattedItems = [];
	for (const name in itemCounts) {
		const { count, emoji, description } = itemCounts[name];
		formattedItems.push(count > 1 ? `${emoji}${name} x${count}\n${description}` : name);
	}
	return formattedItems;
}

export function formatFailMessage(message: string) {
	return `${DugEmojis.Fail} ${message}`;
}

export function formatSuccessMessage(message: string) {
	return `***${DugEmojis.Success} ${message}***`;
}

export function toFriendlyString(value: string) {
	const stringWithSpaces = value.replace(/_/g, ' ');
	return stringWithSpaces.charAt(0).toUpperCase() + stringWithSpaces.slice(1).toLowerCase();
}

export function formatTitles(titles: Title[]) {
	const titlesList: `- ${TitleTexts}`[] = [];
	for (const title of titles) {
		titlesList.push(`- ${TitleTexts[title]}`);
	}

	return titlesList.length ? titlesList.join('\n') : 'No titles';
}

export function convertValueToBadge(value: string) {
	const badgeText = value.toUpperCase().replaceAll(' ', '_') as Badge;
	if (badgeText in BadgeIcons) {
		return badgeText;
	}

	return null;
}

export function formatBadges(badges: Badge[]) {
	const icons: BadgeIcons[] = [];
	for (const badge of badges) {
		icons.push(BadgeIcons[badge]);
	}

	return icons.length ? icons.join(' ') : 'No badges';
}

export function generateFactionEmbed(data: FactionType) {
	const { name, description, ownerId, joinType, members, iconUrl, badges, titles } = data;
	const embed = new EmbedBuilder()
		.setThumbnail(iconUrl)
		.setTitle(name)
		.setDescription(description)
		.setColor(DugColors.Info)
		.addFields(
			{
				name: `Owner`,
				value: `${userMention(ownerId)}`,
				inline: true
			},
			{
				name: `Join Status`,
				value: `\`${toFriendlyString(joinType)}\``,
				inline: true
			},
			{
				name: `Member Count`,
				value: `\`${members?.length ?? 0} Members\``,
				inline: true
			},
			{
				name: 'Badges',
				value: formatBadges(badges),
				inline: true
			},
			{
				name: 'Titles',
				value: formatTitles(titles),
				inline: true
			}
		);

	return embed;
}

export async function generateProfileEmbed(member: GuildMember) {
	const data = (await container.db.user.findUnique({
		where: {
			id: member.id
		},
		select: {
			bio: true,
			badges: true,
			titles: true,
			bank: true,
			cash: true,
			faction: true
		}
	}))!;

	const { bio, badges, titles, bank, cash, faction } = data;

	const embed = new EmbedBuilder()
		.setThumbnail(member.displayAvatarURL())
		.setTitle(member.user.username)
		.setDescription(`${bio ?? '`No bio`'}`)
		.setColor(DugColors.Info)
		.addFields(
			{
				name: 'Economy',
				value: [`Cash: ${cash}`, `Bank: ${bank}`, `Networth: ${cash + bank}`].join('\n'),
				inline: true
			},

			{
				name: 'Badges',
				value: formatBadges(badges),
				inline: true
			},
			{
				name: 'Titles',
				value: formatTitles(titles),
				inline: true
			},
			{
				name: 'Faction',
				value: `${faction?.name || 'None'}`
			}
		);

	return embed;
}

/**
 * It takes an array of strings, splits each string by underscores, capitalizes the first letter of
 * each word, and joins them back together
 * @param {string[]} perm - The array of strings to format.
 * @param {boolean} key - Should it filter and return only key permissions? (default: true)
 * @returns {string[]} An array of strings.
 * @example
 * format(['SEND_MESSAGES']) -> ['Send Messages']
 */
export function formatRoles(perm: PermissionsString[], key?: boolean): string[];
/**
 * It takes a string of screaming snake case and returns pascal case
 * @param {string} perm The permission string
 * @returns {string} Formatted string
 * @example
 * format('SEND_MESSAGES') -> 'Send Messages'
 */
export function formatRoles(perm: string): string;

export function formatRoles(perm: PermissionsString[] | string, key = true) {
	if (Array.isArray(perm)) {
		return perm
			.sort((a, b) => order[b] - order[a])
			.map((e) =>
				e
					.split(``)
					.map((i) => (i.match(/[A-Z]/) ? ` ${i}` : i))
					.join(``)
					.trim()
			)
			.map((s) => {
				s = s.replace(/T T S/g, 'TTS');
				s = s.replace(/V A D/g, 'VAD');
				return s;
			})
			.filter((f) => (key ? f.match(/mem|mana|min|men/gim) : true));
	}
	return perm
		.split(``)
		.map((i) => (i.match(/[A-Z]/) ? ` ${i}` : i))
		.join(``)
		.trim()
		.replace(/T T S/g, 'TTS')
		.replace(/V A D/g, 'VAD');
}

const order: Record<PermissionsString, number> = {
	ViewChannel: 0,
	SendMessages: 1,
	EmbedLinks: 2,
	ReadMessageHistory: 3,
	Connect: 4,
	Speak: 5,
	UseEmbeddedActivities: 5,
	Stream: 5,
	AttachFiles: 6,
	SendVoiceMessages: 6,
	AddReactions: 7,
	CreateInstantInvite: 8,
	UseExternalEmojis: 9,
	UseExternalStickers: 9,
	UseExternalSounds: 9,
	PrioritySpeaker: 10,
	UseSoundboard: 10,
	SendMessagesInThreads: 10,
	SendTTSMessages: 10,
	UseVAD: 11,
	ChangeNickname: 12,
	UseApplicationCommands: 13,
	RequestToSpeak: 14,
	CreatePublicThreads: 15,
	CreatePrivateThreads: 16,
	ViewGuildInsights: 19,
	DeafenMembers: 20,
	ManageThreads: 20,
	MoveMembers: 20,
	MuteMembers: 20,
	ManageEmojisAndStickers: 21,
	ManageGuildExpressions: 21,
	ManageEvents: 21,
	ManageMessages: 22,
	ManageWebhooks: 23,
	ManageNicknames: 24,
	ManageRoles: 25,
	ModerateMembers: 26,
	ViewAuditLog: 27,
	ViewCreatorMonetizationAnalytics: 27,
	KickMembers: 28,
	BanMembers: 29,
	ManageChannels: 30,
	ManageGuild: 31,
	MentionEveryone: 32,
	Administrator: 40
};
