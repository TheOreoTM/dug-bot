import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD',
	requiredUserPermissions: ['Administrator']
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message) {
		this.container.tasks.create('SendDailyQuestionTask');

		send(message, 'Tried to send the daily question');
	}
}
