import { DugColors } from '#constants';
import { genBar } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { EmbedBuilder, type Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const percentage = await args.pick('number');
		const bar = genBar(percentage, 100, 4);

		const embed = new EmbedBuilder().setDescription(`${bar} \` ${percentage}% \` \` ${percentage} / 100 \``).setColor(DugColors.Default);
		message.channel.send({ embeds: [embed] });
	}
}
