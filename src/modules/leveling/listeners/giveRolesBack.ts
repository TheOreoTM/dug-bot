import { DugEvents, LeavingTaxPercentage } from '#constants';
import { getLevelInfo } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: DugEvents.GuildMemberAdd })
export class UserEvent extends Listener {
	public override async run(member: GuildMember) {
		const level = await this.container.db.userLevel.getCurrentLevel(member.id);
		const newLevel = Math.floor(level * (1 - LeavingTaxPercentage));
		const levelInfo = getLevelInfo(newLevel);
		await this.container.db.userLevel.upsert({
			where: {
				userId: member.id
			},
			create: {
				userId: member.id,
				currentLevel: newLevel,
				currentXp: 0,
				requiredXp: levelInfo.xpNeededToLevelUp,
				totalXp: levelInfo.totalXpOfCurrentLevel
			},
			update: {
				currentLevel: newLevel,
				currentXp: 0,
				requiredXp: levelInfo.xpNeededToLevelUp,
				totalXp: levelInfo.totalXpOfCurrentLevel
			}
		});
		const availableLevelRoles = await this.container.db.levelRole.findMany({
			where: {
				level: {
					lte: newLevel
				}
			}
		});

		member.roles.add(availableLevelRoles.map((r) => r.id));
	}
}
