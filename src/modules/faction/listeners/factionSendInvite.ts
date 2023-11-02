import { DugColors, DugEvents, NotificationChannelID } from '#constants';
import { FactionType } from '#lib/types/Data';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel, User, userMention } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: DugEvents.FactionSendInvite })
export class UserEvent extends Listener {
	public override async run(user: User, faction: FactionType) {
		const owner = await this.container.client.users.fetch(faction.ownerId);

		try {
			const acceptButton = new ButtonBuilder().setCustomId(`afi-${faction.id}-${user.id}`).setLabel('Accept').setStyle(ButtonStyle.Secondary);
			const denyButton = new ButtonBuilder().setCustomId(`dfi-${faction.id}-${user.id}`).setLabel('Decline').setStyle(ButtonStyle.Danger);
			const embed = new EmbedBuilder()
				.setColor(DugColors.Info)
				.setAuthor({ iconURL: user.displayAvatarURL(), name: user.username })
				.setDescription('I would like to join your faction');
			const hasPendingInvite = await this.container.db.user.hasPendingInvite(user.id, faction.id);
			if (!hasPendingInvite) {
				await owner.send({ embeds: [embed], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(acceptButton, denyButton)] });
				await this.container.db.faction.update({
					where: {
						id: faction.id
					},
					data: {
						pendingMemberIds: {
							push: user.id
						}
					}
				});
			}
		} catch (error) {
			const channel = (await this.container.client.channels.fetch(NotificationChannelID)) as TextChannel;
			channel.send({
				content: `${userMention(
					faction.ownerId
				)}, I tried to send you a message but your DMs are off, please enable them to receive invitation requests.`
			});
		}
	}
}
