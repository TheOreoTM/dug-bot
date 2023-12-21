import { ChannelIDs, DugColors, DugEmojis } from '#constants';
import { Timestamp } from '#lib/classes';
import { SelectAllOptions } from '#lib/types';
import { minutes } from '#lib/util/common';
import { formatList } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel, userMention } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
	name: 'UpdateFactionsTeamListTask',
	interval: minutes(5),
	bullJobsOptions: { removeOnComplete: true }
})
export class UpdateFactionsTeamListTask extends ScheduledTask {
	public async run() {
		this.container.logger.info('[UpdateFactionsTeamListTask] Started');
		const allFactions = await this.container.db.faction.findMany({ orderBy: { tokens: 'desc' }, select: SelectAllOptions });
		const channel = (await this.container.client.channels.fetch(ChannelIDs.FactionListChannel)) as TextChannel;
		await channel.bulkDelete(100); // Delete all previous messages
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

		channel.send({ embeds: [embed], components: [new ActionRowBuilder<ButtonBuilder>().setComponents(refreshButton)] });
	}
}

// Add the return type declaration in Augments.d.ts
