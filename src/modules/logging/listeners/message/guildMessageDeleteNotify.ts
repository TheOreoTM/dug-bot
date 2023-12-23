import { DugEvents, LoggingWebhooks } from '#constants';
import { GuildMessage } from '#lib/types';
import { getContent, getFullEmbedAuthor, getImage } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { cutText } from '@sapphire/utilities';
import { Colors, EmbedBuilder } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: DugEvents.GuildMessageDelete
})
export class UserEvent extends Listener {
	public async run(message: GuildMessage) {
		this.container.core.logging.sendLog(LoggingWebhooks.Message, {
			embeds: [
				new EmbedBuilder()
					.setColor(Colors.Red)
					.setAuthor(getFullEmbedAuthor(message.author, message.url))
					.setDescription(cutText(getContent(message) || '', 1900))
					.setFooter({ text: `Message Deleted • #${message.channel.name}` })
					.setImage(getImage(message)!)
					.setTimestamp()
			]
		});
	}
}
