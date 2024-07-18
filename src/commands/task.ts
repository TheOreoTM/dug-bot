import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD',
	enabled: false
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message) {
		this.container.tasks.create('ExpireBoostsTask', { amountToRemove: 10, userId: message.author.id }, { delay: 1000, repeated: false });
		return;
	}
}
