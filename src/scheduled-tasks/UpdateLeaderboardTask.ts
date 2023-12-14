import { minutes } from '#lib/util/common';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<ScheduledTask.Options>({
	name: 'UpdateLeaderboardTaskTask',
	interval: minutes(5),
	bullJobsOptions: { removeOnComplete: true }
})
export class UpdateLeaderboardTaskTask extends ScheduledTask {
	public async run() {
		this.container.logger.info('[UpdateLeaderboardTask] Started');

		const START_VALUE = 1;
		const END_VALUE = 10;

		for (let page = START_VALUE; page < END_VALUE + 1; page++) {
			const data = this.container.leaderboard.cacheLevelLeaderboardPage(page);
			if (!data) {
				this.container.logger.error(`[UpdateLeaderboardTask] Failed to cache page ${page}`);
			}
		}
	}
}
