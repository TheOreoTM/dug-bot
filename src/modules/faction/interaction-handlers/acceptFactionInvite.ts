import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const split = interaction.customId.split('-');
		const action = split[0] as 'afi' | 'dfi';
		const factionId = Number(split[1]);
		const userId = split[2] as string;

		const faction = await this.container.db.faction.findUnique({
			where: {
				id: factionId,
				ownerId: interaction.user.id
			}
		});

		if (!faction) {
			interaction.reply({ content: formatFailMessage('The faction this was from no longer exists or you cant manage it anymore.') });
			return;
		}

		const pendingMembersSet = new Set(faction.pendingMemberIds);
		pendingMembersSet.delete(userId);
		const pendingMembersList = Array.from(pendingMembersSet);
		await this.container.db.faction.update({
			where: {
				id: faction.id
			},
			data: {
				pendingMemberIds: {
					set: pendingMembersList
				}
			}
		});

		if (action === 'afi') {
			await this.container.db.user.update({
				where: {
					id: userId
				},
				data: {
					faction: {
						connect: {
							id: factionId
						}
					}
				}
			});
			interaction.reply({ content: formatSuccessMessage('Accepted user') });
			interaction.message.edit({ embeds: interaction.message.embeds, components: [] });
			return;
		}

		if (action === 'dfi') {
			interaction.reply({ content: formatSuccessMessage('Declined user') });
			interaction.message.edit({ embeds: interaction.message.embeds, components: [] });
			return;
		}
	}

	public override parse(interaction: ButtonInteraction) {
		if (!interaction.customId.startsWith('afi')) return this.none();

		return this.some();
	}
}
