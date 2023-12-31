import { formatFailMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const xpBoost = await args.pick('float').catch(() => 1);
		if (xpBoost > 2147483647 - 1) {
			send(message, formatFailMessage('Calm down buddy'));
			return;
		}
		const data = await this.container.db.userLevel.update({
			where: {
				userId: message.author.id
			},
			data: {
				xpBoost
			}
		});

		message.channel.send({ content: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\`` });
	}
}
