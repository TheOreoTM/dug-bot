import { DugColors } from '#constants';
import { generateTopic, getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
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

		channel.send({
			embeds: [embed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(newTopicButton)]
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'new-topic') return this.none();
		return this.some();
	}
}
