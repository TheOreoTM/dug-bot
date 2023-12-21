import { ChannelIDs, DugColors, DugEmojis } from '#constants';
import { Timestamp } from '#lib/classes';
import { factionListCacheKey } from '#lib/database/keys';
import { SelectAllOptions } from '#lib/types';
import { minutes } from '#lib/util/common';
import { formatList } from '#lib/util/formatter';
import { container } from '@sapphire/pieces';
import {
	TextChannel,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	userMention,
	ActionRowBuilder,
	MessageCreateOptions,
	MessageEditOptions
} from 'discord.js';

export class FactionListService {
	private readonly key = factionListCacheKey;
	private readonly db = container.db;
	private readonly cache = container.cache;

	public constructor() {}

	public async refreshList() {
		const messageId = await this.cache.get(this.key);
		console.log('🚀 ~ file: FactionListService.ts:28 ~ FactionListService ~ refreshList ~ messageId:', messageId);
		const channel = (await container.client.channels.fetch(ChannelIDs.FactionListChannel)) as TextChannel;
		if (!messageId) {
			const message = await this.sendList(channel);
			console.log('🚀 ~ file: FactionListService.ts:32 ~ FactionListService ~ refreshList ~ message:', message);
			await this.cache.set(this.key, message.id);
			return;
		}
		const message = await channel.messages.fetch(messageId);
		console.log('🚀 ~ file: FactionListService.ts:36 ~ FactionListService ~ refreshList ~ message:', message);
		if (!message) {
			const message = await this.sendList(channel);
			await this.cache.set(this.key, message.id);
			return;
		}

		const list = await this.generateList();
		console.log('🚀 ~ file: FactionListService.ts:44 ~ FactionListService ~ refreshList ~ list:', list);
		await message.edit(list as MessageEditOptions);
	}

	private async generateList(): Promise<MessageCreateOptions | MessageEditOptions> {
		const allFactions = await this.db.faction.findMany({ orderBy: { tokens: 'desc' }, select: SelectAllOptions });
		// const factionsList = allFactions.map((f) => {
		// 	return { name: f.name, memberCount: f.members.length, tokens: f.tokens, ownerId: f.ownerId };
		// });
		const refreshButton = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel('Refresh').setEmoji('🔄️').setCustomId('rfl');
		const nextUpdatesAt = new Date(Date.now() + minutes(5));
		const embed = new EmbedBuilder()
			.setColor(DugColors.Default)
			.setTitle('Factions List')
			.setDescription(
				`Below is the list of live updating factions list\n\n**Next update** ${new Timestamp(nextUpdatesAt.getTime()).getRelativeTime()}`
			)
			.setFields(
				allFactions.map((f, index) => {
					const membersList = f.members.map((m) => {
						return `${userMention(m.id)}`;
					});
					const formattedMembers = formatList(membersList);
					return {
						name: `${index + 1}. ${f.name}`,
						value: `${DugEmojis.ListBranch}${
							DugEmojis.Token
						} \`${f.tokens.toLocaleString()} Tokens\`\n### Members\n${formattedMembers.join('\n')}`
					};
				})
			);

		return { embeds: [embed], components: [new ActionRowBuilder<ButtonBuilder>().setComponents(refreshButton)] };
	}

	private async sendList(channel: TextChannel) {
		await channel.bulkDelete(99); // Delete everything

		const list = await this.generateList();
		console.log('🚀 ~ file: FactionListService.ts:83 ~ FactionListService ~ sendList ~ list:', list);

		return await channel.send(list as MessageCreateOptions);
	}
}
