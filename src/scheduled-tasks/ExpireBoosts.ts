import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

interface ExpireBoostsTaskPaylod {
	amountToRemove: number;
	userId: string;
}

@ApplyOptions<ScheduledTask.Options>({
	name: 'ExpireBoostsTask',
	customJobOptions: { removeOnComplete: true, removeOnFail: true },
	enabled: true
})
export class ExpireBoostsTask extends ScheduledTask {
	public async run(payload: ExpireBoostsTaskPaylod) {
		this.container.logger.info('[ExpireBoostsTask] Started');

		const userId = payload.userId;
		const amount = payload.amountToRemove;

		console.log(`[ExpireBoostsTask] Removing ${amount} from ${userId}`);

		const data = await this.container.db.userLevel.upsert({
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

		console.log(data);

		return;
	}
}
