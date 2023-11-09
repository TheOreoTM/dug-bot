import { BotID, ChannelIDs, DugColors } from '#constants';
import { minutes } from '#lib/util/common';
import { generateTopic } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
	name: 'reviveChatWithTopicTask',
	interval: minutes(2.5)
})
export class reviveChatWithTopicTask extends ScheduledTask {
	public async run() {
		this.container.logger.info('[reviveChatWithTopicTask] Started');
		const channel = this.container.client.channels.cache.get(ChannelIDs.General) as TextChannel;
		const shouldSend = this.shouldSendTopic(channel);
		if (!shouldSend) return;

		const newTopicButton = new ButtonBuilder().setLabel('New Topic').setStyle(ButtonStyle.Primary).setCustomId('new-topic');

		const embed = new EmbedBuilder().setColor(DugColors.Default).setDescription(`Here's a topic that can help...\n\n> ${generateTopic()}`);

		channel.send({
			content: 'Slow Chat Detected',
			embeds: [embed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(newTopicButton)]
		});
	}

	private shouldSendTopic(channel: TextChannel) {
		const message = channel.lastMessage;
		if (!message) return true;
		const fiveMinutesAgo = new Date(Date.now() - minutes(5));
		const messageIsOld = message.createdTimestamp < fiveMinutesAgo.getTime();
		const isTopicMessage = message.content === 'Slow Chat Detected';
		const sentByMe = message.author.id === BotID;

		const shouldNotSend = isTopicMessage && sentByMe && !messageIsOld;

		return !shouldNotSend;
	}
}
