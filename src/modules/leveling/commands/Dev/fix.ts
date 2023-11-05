import { getLevelInfo } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const users = await this.container.db.userLevel.findMany({ select: { userId: true, currentLevel: true, currentXp: true } });

		for (const user of users) {
			const levelinfo = getLevelInfo(user.currentLevel);

			await this.container.db.userLevel.update({
				where: {
					userId: user.userId
				},
				data: {
					requiredXp: levelinfo.xpNeededToLevelUp,
					currentXp: user.currentXp,
					totalXp: levelinfo.totalXpOfCurrentLevel + user.currentXp
				}
			});
		}

		message.channel.send(`Done :3`);
	}
}
