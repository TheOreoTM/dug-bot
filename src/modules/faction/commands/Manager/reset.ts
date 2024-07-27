import { DugColors } from '#constants';
import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, type ButtonInteraction } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Reset all factions'
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override async messageRun(message: DugCommand.Message) {
		const embed = new EmbedBuilder().setColor(DugColors.Info).setDescription('Are you sure you want to reset all factions?');
		const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm').setStyle(ButtonStyle.Success);
		const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm, cancel);

		const response = await send(message, { embeds: [embed], components: [row] });
		const collectorFilter = (i: ButtonInteraction) => {
			i.deferUpdate();
			return i.user.id === message.author.id;
		};
		const collector = response.createMessageComponentCollector({
			filter: collectorFilter,
			time: 60000,
			componentType: ComponentType.Button
		});
		collector.on('collect', async (i: ButtonInteraction) => {
			if (i.customId === 'confirm') {
				await this.container.db.faction.deleteMany();
				await i.reply({ content: 'Factions reset!', ephemeral: true });
			} else if (i.customId === 'cancel') {
				await i.reply({ content: 'Cancelled', ephemeral: true });
				response.delete();
				collector.stop();
			}
		});
		collector.on('end', async (_collected, reason) => {
			if (reason === 'time') {
				await response.edit({ content: 'Timed out', components: [] });
				return;
			}

			await response.edit({ content: 'Cancelled', components: [] });
			return;
		});
	}
}
