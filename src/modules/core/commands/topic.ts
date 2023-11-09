import { DugColors } from '#constants';
import { seconds } from '#lib/util/common';
import { generateTopic, getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { BucketScope, Command } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	cooldownDelay: seconds(10),
	cooldownScope: BucketScope.Global
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const newTopicButton = new ButtonBuilder().setLabel('New Topic').setStyle(ButtonStyle.Primary).setCustomId('new-topic');

		const embed = new EmbedBuilder()
			.setColor(DugColors.Default)
			.setDescription(`Here's a **new** topic that can help...\n\n> ${generateTopic()}`)
			.setFooter({ text: `Requested by: ${getTag(message.author)}` });

		message.channel.send({
			embeds: [embed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(newTopicButton)]
		});
	}
}
