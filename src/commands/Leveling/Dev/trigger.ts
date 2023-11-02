import { CrateDropManager } from '#lib/classes/CrateDropManager';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
@ApplyOptions<Command.Options>({
	description: 'A basic command',
	requiredUserPermissions: 'Administrator'
})
export class UserCommand extends Command {
	public override async messageRun() {
		const manager = CrateDropManager.getInstance();
		manager.setAllowDrop(true);
		manager.performDropLogic();
	}
}
