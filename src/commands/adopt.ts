import { BotOwners } from '#constants';
import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	// Message command
	public override async messageRun(message: DugCommand.Message) {
		const handler = await this.container.pet.getUserPetHandler(message.author.id);
		const pets = handler.getPets();

		if (pets.length >= 1 && !BotOwners.includes(message.author.id)) {
			return send(message, 'You already have a pet');
		}

		const pet = await handler.createPet();

		const petHandler = await handler.getPetHandler(pet);

		return send(message, { content: `Adopted ${petHandler.formatName('l')}` });
	}
}
