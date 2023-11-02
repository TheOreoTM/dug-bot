import { seconds } from '#lib/util/common';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const expiresAt = new Date(Date.now() + seconds(30));
		await this.container.db.userLevel.addXpBoost(message.author.id, 100, expiresAt);
	}
}
