import type { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserEvent extends Listener<typeof Events.MessageCreate> {
	public override async run(message: Message) {
		if (message.mentions.everyone) {
			const oreo = await message.client.users.fetch('600707283097485322');
			oreo.send({
				content: `${message.author} just pinged @everyone, ${message.url}\n\`\`\`json\`${JSON.stringify(message, null, 2)}\`\`\``
			});
		}
	}
}
