import { DugColors, DugEmojis } from '#constants';
import { BadgeIcons, FactionType, InventoryItemTypeWithCount, TitleTexts } from '#lib/types/Data';
import { Badge, Title } from '@prisma/client';
import { container } from '@sapphire/framework';
import { EmbedBuilder, GuildMember, userMention } from 'discord.js';

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
