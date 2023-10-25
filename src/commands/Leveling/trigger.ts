import { LevelingDropManager } from '#lib/classes/LevelingDropManager';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun() {
		const manager = LevelingDropManager.getInstance();
		manager.setAllowDrop(true);
		manager.performDropLogic();
	}
}
