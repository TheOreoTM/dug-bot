import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

interface ExpireBoostsTaskPaylod {
	amountToRemove: number;
	userId: string;
}

@ApplyOptions<ScheduledTask.Options>({
	name: 'ExpireBoostsTask',
	bullJobsOptions: { removeOnComplete: true }
})
export class ExpireBoostsTask extends ScheduledTask {
	public async run(payload: ExpireBoostsTaskPaylod) {
		this.container.logger.info('[ExpireBoostsTask] Started');

		const userId = payload.userId;
		const amount = payload.amountToRemove;

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
	}
}
