import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { createHash } from 'crypto';
import { User } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message, args: Args) {
		const first = await args
			.pick('user')
			.catch(() => args.pick('string'))
			.catch(() => 'null');
		const second = await args
			.pick('user')
			.catch(() => args.pick('string'))
			.catch(() => 'null');

		const compatibility = this.generatePercentage(
			first instanceof User ? first.username : first,
			second instanceof User ? second.username : second
		);

		message.channel.send(`I ship ${first} and ${second}! ${compatibility}`);
		return;
	}

	private generatePercentage(first: string, second: string): number {
		const input = `${first}-${second}`;
		const hash = createHash('md5').update(input).digest('hex');
		const decimal = parseInt(hash.slice(0, 2), 16) / 255;
		const percentage = Math.round(decimal * 100);
		return percentage;
	}
}
