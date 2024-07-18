import { minutes } from '#lib/util/common';
import { fetchMember } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { GuildMember } from 'discord.js';

@ApplyOptions<ScheduledTask.Options>({
	name: 'ExpireBoostsTask',
	customJobOptions: { removeOnComplete: true, removeOnFail: true },
	interval: minutes(0.5),
	enabled: true
})
export class ExpireBoostsTask extends ScheduledTask {
	public async run() {
		this.container.logger.info('[ExpireBoostsTask] Started');
		const expiredBoosts = await this.container.db.xpBoost.findMany({
			where: {
				expiresAt: {
					lt: new Date()
				}
			}
		});

		if (!expiredBoosts) return;

		for (const boost of expiredBoosts) {
			this.container.db.xpBoost.delete({ where: { id: boost.id } });
			await this.container.db.userLevel.removeXpBoost(boost.userId, boost.amount);
			const member = await fetchMember<GuildMember>(boost.userId);
			if (!member) continue;
			member.user.send(`Your **x${boost.amount}** boost has expired. (\`${boost.id}\`)`).catch(() => {});
		}
	}
}
