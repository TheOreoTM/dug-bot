import { DugColors } from '#constants';
import { seconds } from '#lib/util/common';
import { generateTopic, getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { sleep } from '@sapphire/utilities';
import { EmbedBuilder, type ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const message = interaction.message;
		const channel = interaction.channel as TextChannel;
		message.delete();

		const newTopicButton = new ButtonBuilder().setLabel('New Topic').setStyle(ButtonStyle.Primary).setCustomId('new-topic');

		const embed = new EmbedBuilder()
			.setColor(DugColors.Default)
			.setDescription(`Here's a **new** topic that can help...\n\n> ${generateTopic()}`)
			.setFooter({ text: `Requested by: ${getTag(interaction.user)}` });

		const response = await channel.send({
			embeds: [embed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(newTopicButton.setDisabled(true))]
		});

		sleep(seconds(10));

		await response
			.edit({
				embeds: [embed],
				components: [new ActionRowBuilder<ButtonBuilder>().addComponents(newTopicButton.setDisabled(false))]
			})
			.catch(null);
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'new-topic') return this.none();
		return this.some();
	}
}
