import { DugColors } from '#constants';
import { DugCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, type ButtonInteraction } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Reset all factions',
	permissionLevel: PermissionLevels.Administrator
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override async messageRun(message: DugCommand.Message) {
		const embed = new EmbedBuilder().setColor(DugColors.Info).setDescription('Are you sure you want to reset all factions?');
		const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm').setStyle(ButtonStyle.Success);
		const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirm, cancel);

		const initialMessage = await send(message, { embeds: [embed], components: [row] });
		const collectorFilter = async (i: ButtonInteraction) => {
			await i.deferUpdate();
			return i.user.id === message.author.id;
		};

		initialMessage
			.awaitMessageComponent({
				filter: collectorFilter,
				time: 60000,
				componentType: ComponentType.Button
			})
			.then(async (i: ButtonInteraction) => {
				if (i.customId === 'confirm') {
					await this.container.db.faction.deleteMany();
					await i.editReply({ content: 'Factions reset!', components: [], embeds: [] });
				} else if (i.customId === 'cancel') {
					await i.editReply({ content: 'Cancelled', components: [], embeds: [] });
				}
			})
			.catch(async (error) => {
				if (error === 'time') {
					await initialMessage.edit({ content: 'Timed out', components: [] });
					return;
				}
				await initialMessage.delete();
				return;
			});
	}
}
