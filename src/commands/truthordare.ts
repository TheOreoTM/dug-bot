import { DugColors } from '#constants';
import { DugCommand } from '#lib/structures';
import { Rating, TruthOrDare } from '#lib/types/Api';
import { seconds } from '#lib/util/common';
import { ApplyOptions } from '@sapphire/decorators';
import { BucketScope } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { sleep } from '@sapphire/utilities';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Play truth or dare',
	aliases: ['tod'],
	flags: ['nsfw', 'pg'],
	cooldownDelay: seconds(10),
	cooldownLimit: 2,
	cooldownScope: BucketScope.Channel
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: DugCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option //
						.setName('type')
						.setDescription('Whether you want a truth or dare')
						.addChoices(
							{
								name: 'Truth',
								value: 'truth'
							},
							{
								name: 'Dare',
								value: 'dare'
							}
						)
				)
				.addStringOption((option) =>
					option //
						.setName('rating')
						.setDescription('The rating you want')
						.addChoices(
							{
								name: 'PG - Child friendly',
								value: 'pg'
							},
							{
								name: 'PG-13 - Teen friendly',
								value: 'pg13'
							},
							{
								name: 'R - Adult friendly',
								value: 'r'
							}
						)
				)
		);
	}

	// Message command
	public override async messageRun(message: DugCommand.Message, args: DugCommand.Args) {
		const type = await args.pick('truthOrDare').catch(() => (Math.random() < 0.5 ? 'truth' : 'dare'));

		const rating = args.getFlags('nsfw') ? 'R' : args.getFlags('pg') ? 'PG' : 'PG13';

		const truthOrDare = await this.getTruthOrDare(type, rating);

		if (!truthOrDare) {
			send(message, 'Something went wrong');
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle(`${type === 'truth' ? 'Truth' : 'Dare'} #${truthOrDare.id}`)
			.setDescription(truthOrDare.question)
			.setColor(type === 'truth' ? DugColors.Success : DugColors.Warn)
			.setFooter({ text: `Rating: ${truthOrDare.rating}` });

		const response = await send(message, { content: `${type === 'truth' ? 'Truth' : 'Dare'} selected by ${message.member}`, embeds: [embed] });

		await sleep(seconds(10));

		response
			.edit({ content: `${type === 'truth' ? 'Truth' : 'Dare'} selected by ${message.member}\n**${truthOrDare.question}**`, embeds: [] })
			.catch(() => null);
		message.delete().catch(() => null);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const type = interaction.options.getString('type') ?? Math.random() < 0.5 ? 'truth' : ('dare' as 'truth' | 'dare');

		const rating = (interaction.options.getString('rating') ?? 'PG13') as Rating;

		const truthOrDare = await this.getTruthOrDare(type, rating);

		if (!truthOrDare) {
			interaction.reply('Something went wrong');
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle(`${type === 'truth' ? 'Truth' : 'Dare'} #${truthOrDare.id}`)
			.setDescription(truthOrDare.question)
			.setColor(type === 'truth' ? DugColors.Success : DugColors.Warn)
			.setFooter({ text: `Rating: ${truthOrDare.rating}` });

		const response = await interaction.reply({
			content: `${type === 'truth' ? 'Truth' : 'Dare'} selected by ${interaction.member}`,
			embeds: [embed]
		});

		await sleep(seconds(15));

		response.delete().catch(() => null);
	}

	private async getTruthOrDare(type: 'truth' | 'dare', _rating: Rating = 'PG13'): Promise<TruthOrDare | null> {
		const response = await fetch(`https://api.truthordarebot.xyz/v1/${type}`);
		const data = (await response.json()) as any;

		if (data.error) {
			return null;
		}

		return data as TruthOrDare;
	}
}
