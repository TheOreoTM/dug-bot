import { ChannelIDs, MainServerID } from '#constants';
import { GuildMessage } from '#lib/types';
import { getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageReaction, TextChannel, User } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.MessageReactionAdd
})
export class UserEvent extends Listener<typeof Events.MessageReactionAdd> {
	public override async run(messageReaction: MessageReaction, user: User) {
		if (user.bot) return;
		if (!messageReaction.message.guild) return;
		if (messageReaction.message.guild.id !== MainServerID) return;

		const scc = messageReaction.message.guild;

		if (messageReaction.emoji.name !== '💀') return;
		if (messageReaction.count !== 3) return;

		const starboard = scc.channels.cache.get(ChannelIDs.DailyChan) as TextChannel | null;
		if (!starboard) return;

		const member = messageReaction.message.member;
		if (!member) return;

		const embed = new EmbedBuilder().setAuthor({ name: getTag(member?.user), iconURL: member.displayAvatarURL() }).setColor('Random');

		const message = messageReaction.message as GuildMessage;

		if (message.content) {
			embed.setDescription(message.content);
		}

		if (message.attachments.size > 0) {
			embed.setImage(message.attachments.first()!.url);
		}

		const jumpToMessageButton = new ButtonBuilder().setLabel('Jump to message').setStyle(ButtonStyle.Link).setURL(message.url);

		starboard.send({
			embeds: [embed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(jumpToMessageButton)]
		});
	}
}
