import { getLevelInfo } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const level = await args.pick('number');
		const data = getLevelInfo(level);

		message.channel.send({ content: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\`` });
	}
}
