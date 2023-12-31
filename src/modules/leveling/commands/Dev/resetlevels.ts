import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		await this.container.db.userLevel.deleteMany();

		message.channel.send('done 👍');
	}
}
