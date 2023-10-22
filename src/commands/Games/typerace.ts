import { TypeRacer } from '#lib/classes/TypeRacer';
import { GuildMessage } from '#lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'Typerace'
})
export class UserCommand extends Command {
	public override async messageRun(message: GuildMessage) {
		const game = new TypeRacer(message);
		return game;
	}
}
