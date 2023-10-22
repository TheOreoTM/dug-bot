import { TypeRacer } from '#lib/classes/TypeRacer';
import { GuildMessage } from '#lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<Command.Options>({
	description: 'Typerace'
})
export class UserCommand extends Command {
	public override async messageRun(message: GuildMessage) {
		const game = new TypeRacer(message);
		game.start();
		send(message, game.text);
	}
}
