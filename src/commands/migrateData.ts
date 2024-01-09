import { DugCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD',
	permissionLevel: PermissionLevels.BotOwner,
	requiredUserPermissions: ['Administrator'],
	preconditions: ['BotOwner'],
	enabled: false
})
export class UserCommand extends DugCommand {
	// Message command
	public override async messageRun(_message: DugCommand.Message) {
		await this.migrateData().catch((error) => console.error(error));

		_message.channel.send('Migration complete!');
	}

	public async migrateData() {
		// Fetch all keys matching the pattern "scc.event:leveling:{userId}"
		const keys = await this.container.cache.keys('scc.event:leveling:*');

		// Loop through each key
		for (const key of keys) {
			// Extract userId from the key
			const userId = key.split(':').pop();

			// Fetch data from Redis
			const redisData = await this.container.cache.hgetall(key);

			// Insert or update data in PostgreSQL using Prisma
			await this.container.db.userLevel.upsert({
				where: { userId },
				update: {
					totalXp: parseInt(redisData.totalXp) || 0,
					currentXp: parseInt(redisData.currentXp) || 0,
					requiredXp: parseInt(redisData.requiredXp) || 100,
					currentLevel: parseInt(redisData.currentLevel) || 0,
					xpBoost: parseFloat(redisData.xpBoost) || 0.0,
					lastXpEarned: new Date(redisData.lastXpEarned || Date.now()),
					levelUpMessage: redisData.levelUpMessage || null,
					bgImage: redisData.bgImage || null,
					bgColor: redisData.bgColor || null,
					borderColor: redisData.borderColor || null,
					noBorder: redisData.noBorder === 'true',
					avatarBorderColor: redisData.avatarBorderColor || null,
					barColor: redisData.barColor || null,
					fontColor: redisData.fontColor || null
				},
				create: {
					userId: userId!,
					totalXp: parseInt(redisData.totalXp) || 0,
					currentXp: parseInt(redisData.currentXp) || 0,
					requiredXp: parseInt(redisData.requiredXp) || 100,
					currentLevel: parseInt(redisData.currentLevel) || 0,
					xpBoost: parseFloat(redisData.xpBoost) || 0.0,
					lastXpEarned: new Date(redisData.lastXpEarned || Date.now()),
					levelUpMessage: redisData.levelUpMessage || null,
					bgImage: redisData.bgImage || null,
					bgColor: redisData.bgColor || null,
					borderColor: redisData.borderColor || null,
					noBorder: redisData.noBorder === 'true',
					avatarBorderColor: redisData.avatarBorderColor || null,
					barColor: redisData.barColor || null,
					fontColor: redisData.fontColor || null
				}
			});

			console.log(`Data migrated for userId: ${userId}`);
		}
	}
}
