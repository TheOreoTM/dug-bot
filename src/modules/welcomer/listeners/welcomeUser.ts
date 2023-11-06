import { ChannelIDs, DugEvents } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import canvafy from 'canvafy';
const { WelcomeLeave } = canvafy;
import { GuildMember, TextChannel } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: DugEvents.GuildMemberAdd })
export class UserEvent extends Listener {
	public override async run(member: GuildMember) {
		const card = await new WelcomeLeave()
			.setAvatar(member.displayAvatarURL({ forceStatic: true, extension: 'png' }))
			.setBackground('image', `https://imgur.com/hSUCo6F`)
			.setOverlayOpacity(0)
			.setTitle(member.user.username)
			.setDescription(`Welcome! You're the ${member.guild.memberCount}th member to join`)
			.build();

		const channel = member.guild.channels.cache.get(ChannelIDs.WelcomeChannel) as TextChannel;

		channel.send({
			content: `Welcome ${member} to ${member.guild.name}`,
			files: [
				{
					attachment: card,
					name: 'welcome.png'
				}
			]
		});
	}
}
