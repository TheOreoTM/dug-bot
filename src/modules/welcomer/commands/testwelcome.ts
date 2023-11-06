import { DugEvents } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Test the welcome system',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends Command {
	// Message command
	public override async messageRun(message: Message) {
		message.client.emit(DugEvents.GuildMemberAdd, message.member!);
		message.channel.send(`Sent test welcome image`);
	}
}
