import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message, args: Args) {
		const first = await args
			.pick('user')
			.catch(() => args.pick('string'))
			.catch(() => null);
		const second = await args
			.pick('user')
			.catch(() => args.pick('string'))
			.catch(() => null);

		message.channel.send(`I ship ${first} and ${second}!`);
		return;
	}
}
