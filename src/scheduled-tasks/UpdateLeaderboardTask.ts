import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

interface UpdateLeaderboardTaskTaskPaylod {
	
}

@ApplyOptions<ScheduledTask.Options>({
	name: 'UpdateLeaderboardTaskTask',
	bullJobsOptions: { removeOnComplete: true }
})
export class UpdateLeaderboardTaskTask extends ScheduledTask {
	public async run(payload: UpdateLeaderboardTaskTaskPaylod) {
		this.container.logger.info('[UpdateLeaderboardTaskTask] Started');
	}
}

// Add the return type declaration in Augments.d.ts