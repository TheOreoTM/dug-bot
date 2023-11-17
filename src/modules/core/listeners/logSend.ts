import { ChannelIDs, DugEvents } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { EmbedBuilder, TextChannel } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: DugEvents.LogSend
})
export class UserEvent extends Listener {
	public override async run(logEmbed: EmbedBuilder) {
		const channel = this.container.client.channels.cache.get(ChannelIDs.LoggingChannel) as TextChannel;

		channel.send({ embeds: [logEmbed] });
	}
}
