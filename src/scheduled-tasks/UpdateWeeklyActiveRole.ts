import { WeeklyActiveRoleID } from '#constants';
import { RANDOM_ROLE_COLORS } from '#lib/data/roleData';
import { fetchSCC, randomItem } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<ScheduledTask.Options>({
	name: 'UpdateWeeklyActiveRoleTask',
	pattern: '0 0 * * *',
	customJobOptions: { removeOnComplete: true, removeOnFail: true },
	enabled: false
})
export class UpdateWeeklyActiveRoleTask extends ScheduledTask {
	public async run() {
		this.container.logger.info('[UpdateWeeklyActiveRoleTask] Started');
		const scc = await fetchSCC();
		const role = scc.roles.cache.get(WeeklyActiveRoleID);

		if (!role) return;

		const currentHex = role.hexColor;
		let randomHex = randomItem(RANDOM_ROLE_COLORS);

		while (randomHex === currentHex) {
			randomHex = randomItem(RANDOM_ROLE_COLORS);
		}

		role.setColor(randomHex).catch(() => null);
	}
}

// Add the return type declaration in Augments.d.ts
