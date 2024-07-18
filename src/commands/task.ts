import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	public override async messageRun() {
		this.container.tasks.create('ExpireBoostsTask');
		return;
	}
}
