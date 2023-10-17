import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const data = await this.container.db.userLevel.findUnique({
			where: {
				userId: message.author.id
			}
		});

		message.channel.send({ content: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\`` });
	}
}
