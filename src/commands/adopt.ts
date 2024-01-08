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
		const pet = await handler.createPet();

		const json = `${JSON.stringify(pet, null, 2)}`;

		send(message, `\`\`\`json\n${json}\`\`\``);
	}
}
