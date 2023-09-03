import { DugColors, DugEmojis } from '#constants';
import { BadgeIcons, FactionType, TitleTexts } from '#lib/types/Data';
import { Badge, Title } from '@prisma/client';
import { EmbedBuilder, userMention } from 'discord.js';

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
				value: `\`${members.length} Members\``,
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
