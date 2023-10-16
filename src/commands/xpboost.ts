import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const xpBoost = await args.pick('number').catch(() => 0);
		await this.container.db.userLevel.update({
			where: {
				userId: message.author.id
			},
			data: {
				xpBoost: Math.floor(xpBoost / 100)
			}
		});
	}
}
