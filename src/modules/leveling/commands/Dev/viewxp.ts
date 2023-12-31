import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const member = await args.pick('member');
		const data = await this.container.db.userLevel.findUnique({
			where: {
				userId: member.id
			}
		});

		message.channel.send({ content: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\`` });
	}
}
