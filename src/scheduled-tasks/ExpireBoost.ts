import { fetchMember } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { GuildMember } from 'discord.js';

interface ExpireBoostPayload {
	userId: string;
	amount: number;
}

@ApplyOptions<ScheduledTask.Options>({
	name: 'ExpireBoost',
	customJobOptions: {
		removeOnComplete: true,
		removeOnFail: true
	},
	enabled: true
})
export class ExpireBoostsTask extends ScheduledTask {
	public async run(payload: ExpireBoostPayload) {
		this.container.logger.info('[ExpireBoost] Started');
		const { userId, amount } = payload;

		this.container.logger.info(`[ExpireBoost] Removing ${amount} xp from ${userId}`);
		await this.container.db.userLevel.removeXpBoost(userId, amount);

		const member = await fetchMember<GuildMember>(userId);
		if (!member) return;
		member.user.send(`Your **x${amount}** boost has expired.`).catch(() => {});
	}
}
