import { DugCommand } from '#lib/structures';
import { PetListEmbedBuilder } from '#lib/structures/builders/PetListEmbedBuilder';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message) {
		const handler = await this.container.pet.getUserPetHandler(message.author.id);
		const pets = await handler.getPets();

		const embed = new PetListEmbedBuilder(pets).build();

		send(message, { embeds: [embed] });
	}
}
