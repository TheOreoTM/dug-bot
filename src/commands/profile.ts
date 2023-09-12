import { GuildMessage } from '#lib/types/Discord';
import { generateProfileEmbed } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'View a profile'
})
export class UserCommand extends Command {
	public override async messageRun(message: GuildMessage, args: Args) {
		const member = await args.pick('member').catch(() => message.member);
		const embed = await generateProfileEmbed(member);

		return message.channel.send({ embeds: [embed] });
	}
}
