import { seconds } from '#utils/common';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<ScheduledTask.Options>({
	interval: seconds(10),
	enabled: true
})
export class ExpireXpBoostsTask extends ScheduledTask {
	public override async run() {
		const xpBoosts = await this.container.db.xpBoost.findMany({
			where: {
				expiresAt: {
					lte: new Date()
				}
			}
		});

		xpBoosts.forEach(async (xpBoost) => {
			await this.container.db.xpBoost.delete({
				where: {
					id: xpBoost.id
				}
			});
			const userId = xpBoost.userId;
			const amount = xpBoost.amount;

			await this.container.db.userLevel.upsert({
				where: {
					userId
				},
				update: {
					xpBoost: {
						decrement: amount
					}
				},
				create: {
					userId
				}
			});
		});
	}
}
