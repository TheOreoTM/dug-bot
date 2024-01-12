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

		let first: string | null = null;
		let second: string | null = null;

		if (args.length === 1) {
			first = message.author.username;
			second = mentions.first()?.user.username ?? null;
		} else if (args.length === 2) {
			first = message.author.username;
			second = args[1];
		} else if (args.length === 3) {
			first = args[1];
			second = args[2];
		} else {
			return message.channel.send('Invalid syntax! Try `ship @user` or `dug ship @user1 @user2`');
		}

		message.channel.send(`I ship ${first} and ${second}!`);
		return;
	}
}
