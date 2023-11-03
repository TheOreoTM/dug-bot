import { getLevelInfo } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const users = await this.container.db.userLevel.findMany({ select: { userId: true, currentLevel: true, currentXp: true } });
		for (const user of users) {
			const levelInfo = getLevelInfo(user.currentLevel);

			if (user.currentXp > levelInfo.xpNeededToLevelUp) {
				const levelInfo2 = getLevelInfo(user.currentLevel);
				const newCurrentXp = user.currentXp - levelInfo.xpNeededToLevelUp;
				await this.container.db.userLevel.update({
					where: {
						userId: user.userId
					},
					data: {
						currentLevel: levelInfo2.level,
						currentXp: newCurrentXp,
						requiredXp: levelInfo2.xpNeededToLevelUp
					}
				});
				console.log(`leveled up ${user.userId}`);
				continue;
			}

			await this.container.db.userLevel.update({
				where: {
					userId: user.userId
				},
				data: {
					requiredXp: levelInfo.xpNeededToLevelUp
				}
			});
			console.log(`seeded ${user.userId}`);
		}

		message.channel.send('Done');
	}
}
