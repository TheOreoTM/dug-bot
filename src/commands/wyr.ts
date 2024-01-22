import { DugColors } from '#constants';
import { DugCommand } from '#lib/structures';
import { TruthOrDare } from '#lib/types/Api';
import { seconds } from '#lib/util/common';
import { ApplyOptions } from '@sapphire/decorators';
import { BucketScope } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { sleep } from '@sapphire/utilities';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Get a would you rather question',
	cooldownDelay: seconds(10),
	cooldownLimit: 2,
	cooldownScope: BucketScope.Channel
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: DugCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	// Message command
	public override async messageRun(message: DugCommand.Message) {
		const wyr = await this.getWyr();

		if (!wyr) {
			send(message, 'Something went wrong while fetching the question. Please try again later.');
			return;
		}

		const embed = new EmbedBuilder()
			.setColor(DugColors.Default)
			.setTitle(`Would you rather #${wyr.id}`)
			.setDescription(wyr.question)
			.setFooter({ text: `Rating: ${wyr.rating}` });

		const response = await send(message, {
			content: `Would you rather question requested by ${message.member}`,
			embeds: [embed]
		});

		await sleep(seconds(15));

		response.delete().catch(() => null);
		message.delete().catch(() => null);
	}

	private async getWyr(): Promise<TruthOrDare | null> {
		const response = await fetch(`https://api.truthordarebot.xyz/api/wyr`);
		const data = (await response.json()) as any;

		if (data.error) {
			return null;
		}

		return data as TruthOrDare;
	}
}
