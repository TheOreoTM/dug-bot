import { DugColors, DugEvents, LoggingWebhooks } from '#constants';
import { DugEmbedBuilder } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { getFullEmbedAuthor } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { diffWordsWithSpace } from 'diff';
import { Message, escapeMarkdown } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: DugEvents.MessageUpdate
})
export class UserEvent extends Listener {
	public async run(old: Message, message: GuildMessage) {
		if (message.guild === null || old.content === message.content || message.author.bot) return;
		if (message.content.length <= 0) return;

		this.container.core.logging.sendLog(LoggingWebhooks.Message, {
			embeds: [
				new DugEmbedBuilder()
					.setColor(DugColors.Warn)
					.setAuthor(getFullEmbedAuthor(message.author, message.url))
					.splitFields(
						diffWordsWithSpace(escapeMarkdown(old.content ?? ''), escapeMarkdown(message.content ?? ''))
							.map((result) => (result.added ? `**${result.value}**` : result.removed ? `~~${result.value}~~` : result.value))
							.join(' ')
					)
					.setFooter({ text: `Message Edited • #${message.channel.name}` })
					.setTimestamp()
			]
		});
	}
}
