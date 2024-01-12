import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { Collection, GuildMember } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message, _args: Args) {
		const args = message.content.split(' ');
		const mentions: Collection<string, GuildMember> = message.mentions.members ?? new Collection();

		const first = mentions.size === 0 ? args[0] : mentions.size > 0 ? mentions.first()!.user.username : args.length > 0 ? args[0] : null;
		mentions.delete(mentions.firstKey() ?? '');
		args.shift();

		const second = mentions.size === 0 ? args[0] : mentions.size > 0 ? mentions.first()!.user.username : args.length > 0 ? args[0] : null;

		if (!first || !second) return message.channel.send('You need to specify two users to ship!');

		message.channel.send(`I ship ${first} and ${second}!`);
		return;
	}
}
