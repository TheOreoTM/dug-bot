import { DropManager } from '#lib/classes/DropManager';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
const manager = DropManager.getInstance();

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun() {
		console.log('trigger');
		manager.allowDrop = true;
		console.log(manager);
		manager.performDropLogic();
	}
}
