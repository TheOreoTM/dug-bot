import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: Message) {
		let counter = 0;
		(await message.guild?.members.fetch())?.forEach((member) => {
			counter++;
			member.roles.add('1272577465193205800');
			console.log(`Added ${member.user.username} to the role (${counter}/ ${message.guild?.members.cache.size})`);
		});

		message.channel.send(`Added ${counter} of ${message.guild?.members.cache?.size} users to the role.`);
		return;
	}
}
