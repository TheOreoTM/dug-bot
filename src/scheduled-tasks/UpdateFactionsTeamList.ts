import { config } from '#config';
import { minutes } from '#lib/util/common';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<ScheduledTask.Options>({
	name: 'UpdateFactionsTeamListTask',
	interval: minutes(2.5),
	enabled: config.enabled_modules.includes('faction'),
	bullJobsOptions: { removeOnComplete: true }
})
export class UpdateFactionsTeamListTask extends ScheduledTask {
	public async run() {
		this.container.logger.info('[UpdateFactionsTeamListTask] Started');
		await this.container.faction.list.refreshList();
	}
}

// Add the return type declaration in Augments.d.ts
