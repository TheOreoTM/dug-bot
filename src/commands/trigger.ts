import { DugColors } from '#constants';
import { DropManager } from '#lib/classes/DropManager';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun() {
		const manager = DropManager.getInstance();
		manager.allowDrop = true;
		manager.triggerDrop({
			color: DugColors.Halloween,
			description: 'My beloved Oreo',
			id: 'legendary',
			image: `https://i.imgur.com/pPdhdOa.png`,
			items: ['Niggas'],
			weight: 1
		});
	}
}
