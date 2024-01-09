import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	// Message command
	public override async messageRun(message: DugCommand.Message) {
		const userHandler = await this.container.pet.getUserPetHandler(message.author.id);
		const petHandler = await userHandler.getPetHandler();

		if (!petHandler) {
			return await send(message, 'You do not have a pet selected. Use `adopt` to adopt a pet.');
		}

		const petEmbed = petHandler.generateEmbed();

		return await send(message, { embeds: [petEmbed] });
	}
}
