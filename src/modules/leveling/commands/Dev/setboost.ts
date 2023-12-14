import { formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: ['Administrator']
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const newBoostPercentage = await args.pick('number').catch(() => 0);
		await this.container.core.setGlobalBoost(newBoostPercentage / 100);

		message.channel.send(formatSuccessMessage(`Set Global Boost to \`${newBoostPercentage}%\``));
	}
}
