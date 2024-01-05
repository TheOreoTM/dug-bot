import { DugEvents, LoggingWebhooks } from '#constants';
import { GuildMessage } from '#lib/types';
import { getFullEmbedAuthor } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { AttachmentBuilder, Colors, EmbedBuilder } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: DugEvents.GuildMessageDelete
})
export class UserEvent extends Listener {
	public async run(message: GuildMessage) {
		if (message.attachments.size === 0) return;

		const embeds: EmbedBuilder[] = [];
		const files: AttachmentBuilder[]= []

		message.attachments.forEach((attachment) => {
			const image = new AttachmentBuilder(attachment.proxyURL, {name: 'deleted-image.png'})

			const embed = new EmbedBuilder()
				.setColor(Colors.Red)
				.setAuthor(getFullEmbedAuthor(message.author, message.url))
				.setFooter({ text: `Image Deleted • #${message.channel.name}` })
				.setImage(`attachment://deleted-image.png`)
				.setTimestamp();

			embeds.push(embed);
			files.push(image)
		});

		this.container.core.logging.sendLog(LoggingWebhooks.Message, {
			embeds: embeds,
			files: files
		});
	}
}
