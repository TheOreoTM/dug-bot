import { DugColors, ProgressBar } from '#constants';
import { progressBar } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { EmbedBuilder, type Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const percentage = await args.pick('number');
		const bar = progressBar(
			ProgressBar.StartEmpty,
			ProgressBar.StartHalfFull,
			ProgressBar.StartFull,
			ProgressBar.MiddleEmpty,
			ProgressBar.MiddleHalfFull,
			ProgressBar.MiddleFull,
			ProgressBar.MiddleContinue,
			ProgressBar.EndEmpty,
			ProgressBar.EndHalfFull,
			ProgressBar.EndFull,
			percentage,
			100,
			4,
			false
		);

		const embed = new EmbedBuilder().setDescription(`${bar} \` ${percentage}% \` \` ${percentage}/100 \``).setColor(DugColors.Default);
		message.channel.send({ embeds: [embed] });
	}
}
