import { LevelingDropManager } from '#lib/classes/XpDropManager';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		message.channel.send('Hi');
		const manager = LevelingDropManager.getInstance();
		manager.setAllowDrop(true);
		manager.performDropLogic();
	}
}
