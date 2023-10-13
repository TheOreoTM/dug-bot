import { DugEvents } from '#constants';
import { Economy } from '#lib/classes/Economy';
import { AllItems } from '#lib/items';
import { DropType } from '#lib/types/Data';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, userMention } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: DugEvents.TriggerDrop })
export class UserEvent extends Listener {
	public override async run(drop: DropType) {
		const channel = this.container.client.channels.cache.get('1138806085998874746');
		if (!channel || !channel.isTextBased()) return;

		const dropEmbed = new EmbedBuilder()
			.setTitle(`Halloween Drops`)
			.setDescription(drop.description)
			.setColor(drop.color)
			.setThumbnail(drop.image);

		const dropButton = new ButtonBuilder().setLabel('Collect').setStyle(ButtonStyle.Success).setEmoji('🖐️').setCustomId('collectDrop');

		const response = await channel.send({
			embeds: [dropEmbed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(dropButton)]
		});

		const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, max: 1, maxUsers: 1, time: 60_000 });

		collector.on('collect', async (i: ButtonInteraction) => {
			await i.update({
				embeds: [
					dropEmbed.addFields({
						name: `Collected by:`,
						value: userMention(i.user.id)
					})
				],
				components: [
					new ActionRowBuilder<ButtonBuilder>().addComponents(
						dropButton.setDisabled(true).setLabel('Collected').setStyle(ButtonStyle.Success).setEmoji('✊')
					)
				]
			});
			const userId = i.user.id;
			const itemData = AllItems.get(`${drop.id}crate`);
			if (!itemData) return;
			const item = new Economy.Item(itemData);
			item.buy(userId, true);
		});

		collector.on('end', (collected) => {
			const collectedBy = collected.first();
			if (!collectedBy) {
				response.edit({
					embeds: [
						dropEmbed.addFields({
							name: `Collected by:`,
							value: `No one`
						})
					],
					components: [
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							dropButton.setDisabled(true).setLabel('Expired').setStyle(ButtonStyle.Secondary).setEmoji('🫳')
						)
					]
				});
				return;
			}
		});
	}
}
