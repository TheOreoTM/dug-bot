import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	// Message command
	public override async messageRun(message: DugCommand.Message, args: Args) {
		const petIdx = await args.pick('number');

		const handler = await this.container.pet.getUserPetHandler(message.author.id);
		const pet = await handler.selectPet(petIdx);

		if (!pet) {
			return await send(message, 'Invalid pet index');
		}

		const petHandler = await handler.getPetHandler();
		const name = petHandler?.formatName('nl');
		return send(message, `Selected pet: ${name}`);
	}
}
