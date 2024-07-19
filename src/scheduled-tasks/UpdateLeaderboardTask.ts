import { seconds } from '#lib/util/common';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { sleep } from '@sapphire/utilities';

@ApplyOptions<ScheduledTask.Options>({
	name: 'UpdateLeaderboardTaskTask',
	pattern: '* * * * *',
	customJobOptions: { removeOnComplete: true, removeOnFail: true },
	enabled: false
})
export class UpdateLeaderboardTaskTask extends ScheduledTask {
	public async run() {
		this.container.logger.info('[UpdateLeaderboardTask] Started');

		const START_VALUE = 1;
		const END_VALUE = 50;

		for (let page = START_VALUE; page < END_VALUE + 1; page++) {
			const data = this.container.leaderboard.cacheLevelLeaderboardPage(page);
			if (!data) {
				this.container.logger.error(`[UpdateLeaderboardTask] Failed to cache page ${page}`);
			}
			await sleep(seconds(2));
		}
	}
}
