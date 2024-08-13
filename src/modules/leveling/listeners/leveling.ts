import { DugEvents } from '#constants';
import { GuildMessage } from '#lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: DugEvents.MessageCreate })
export class UserEvent extends Listener {
	public override async run(message: GuildMessage) {
		if (message.content === '' || message.author.bot) return;
		const member = message.member;
		if (!member) return;
		const shouldAddXP = await this.container.db.userLevel.shouldAddXP(member.id);
		if (!shouldAddXP) return;
		const data = await this.container.db.userLevel.upsert({
			where: {
				userId: member.id
			},
			update: {
				lastXpEarned: new Date()
			},
			create: {
				userId: member.id,
				lastXpEarned: new Date()
			}
		});

		const globalBoost = await this.container.core.getGlobalBoost();
		const addXpData = await this.container.db.userLevel.addXp(member.id, {
			xpBoost: data.xpBoost + globalBoost
		});

		// SendLogEmbed.AddXp({ user: member.user, amount: addXpData.xpAdded, reason: 'Messaging' });

		if (addXpData.leveledUp) {
			this.container.client.emit(DugEvents.MemberLevelUp, message, addXpData.oldLevel, addXpData.newLevel);
			// SendLogEmbed.LevelUp({ user: member.user, level: addXpData.newLevel, reason: 'Messaging' });
		}

		await this.container.leveling.setCardData(data);
		await this.addLevelRoles(data.currentLevel, member);
	}

	public async addLevelRoles(currentLevel: number, member: GuildMember) {
		const availableRoles = await this.container.db.levelRole.findMany({
			where: {
				level: {
					lte: currentLevel
				}
			}
		});

		const roleIds = availableRoles.map((role) => role.roleId);

		if (roleIds.length === 0) return;

		await member.roles.add(roleIds);
	}
}
