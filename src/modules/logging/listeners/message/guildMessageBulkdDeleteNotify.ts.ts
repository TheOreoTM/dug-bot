import { DugEvents, LoggingWebhooks } from '#constants';
import { GuildMessage } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { Collection, Colors, EmbedBuilder, Snowflake } from 'discord.js';

@ApplyOptions<ListenerOptions>({ event: DugEvents.MessageBulkDelete })
export class UserListener extends Listener {
	public run(messages: Collection<Snowflake, GuildMessage>): void {
		if (messages.first()?.guild === null) return;
		const firstMessage = messages.first()!;
		const channel = firstMessage.channel;
		const guild = firstMessage.guild;

		this.container.core.logging.sendLog(LoggingWebhooks.Message, {
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Red)
					.setAuthor({ name: `${guild.name} (${guild.id})`, iconURL: guild.iconURL({ size: 128 }) || undefined })
					.setDescription(`**Bulk delete in ${channel}, ${messages.size} messages deleted`)
					.setFooter({ text: `Bulk Message Deleted • #${channel.name}` })
					.setTimestamp()
			]
		});
	}
}
