import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command

	// Message command
	public override async messageRun() {
		await this.container.faction.list.refreshList();
	}
}
