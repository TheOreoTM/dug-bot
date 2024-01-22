import { DugCommand } from '#lib/structures';
import { TruthOrDare } from '#lib/types/Api';
import { seconds } from '#lib/util/common';
import { ApplyOptions } from '@sapphire/decorators';
import { BucketScope } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { sleep } from '@sapphire/utilities';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Get a never have i ever question',
	aliases: ['never'],
	cooldownDelay: seconds(10),
	cooldownLimit: 2,
	cooldownScope: BucketScope.Channel
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message) {
		const nhie = await this.getNhie();

		if (!nhie) {
			send(message, 'Something went wrong while fetching the question. Please try again later.');
			return;
		}

		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle(`Never have I ever #${nhie.id}`)
			.setDescription(nhie.question)
			.setFooter({ text: `Rating: ${nhie.rating}` });

		const repsonse = await send(message, { content: `Never have I ever question requested by ${message.member}`, embeds: [embed] });

		await sleep(seconds(15));

		repsonse.edit({ content: `Never have I ever question requested by ${message.member}\n**${nhie.question}**`, embeds: [] });
		message.delete().catch(() => null);
	}

	private async getNhie(): Promise<TruthOrDare | null> {
		const response = await fetch(`https://api.truthordarebot.xyz/api/nhie`);

		const data = (await response.json()) as any;

		if (data.error) {
			return null;
		}

		return data as TruthOrDare;
	}
}
