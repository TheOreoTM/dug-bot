import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import type { Message } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: Message) {
		const members = await message.guild?.members.fetch();
		let counter = 0;
		members?.forEach((member) => {
			counter++;
			member.roles.add('1272577465193205800');
			console.log(`Added ${member.user.username} to the role (${counter / members.size})`);
		});

		message.channel.send(`Added ${counter} users to the role`);
		return;
	}
}
