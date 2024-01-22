import { DugColors } from '#constants';
import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Play truth or dare',
	aliases: ['tod'],
	flags: ['truth', 'dare', 'nsfw', 'pg13']
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
		const truth = args.getFlags('truth');
		const dare = args.getFlags('dare');

		const rating = args.getFlags('nsfw') ? 'R' : args.getFlags('pg13') ? 'PG13' : 'PG';

		if (truth && dare) {
			return send(message, "You can't have both truth and dare");
		}

		const type = truth ? 'truth' : dare ? 'dare' : Math.random() < 0.5 ? 'truth' : 'dare';

		const truthOrDare = await this.getTruthOrDare(type, rating);

		if (!truthOrDare) {
			return send(message, 'Something went wrong');
		}

		const embed = new EmbedBuilder()
			.setTitle(`${type === 'truth' ? 'Truth' : 'Dare'} #${truthOrDare.id}`)
			.setDescription(truthOrDare.question)
			.setColor(type === 'truth' ? DugColors.Success : DugColors.Warn)
			.setFooter({ text: `Rating: ${truthOrDare.rating}` });

		return send(message, { content: `${type === 'truth' ? 'Truth' : 'Dare'} selected by ${message.member}`, embeds: [embed] });
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const type = interaction.options.getString('type') ?? Math.random() < 0.5 ? 'truth' : ('dare' as 'truth' | 'dare');

		const rating = (interaction.options.getString('rating') ?? 'PG13') as Rating;

		const truthOrDare = await this.getTruthOrDare(type, rating);

		if (!truthOrDare) {
			return interaction.reply('Something went wrong');
		}

		const embed = new EmbedBuilder()
			.setTitle(`${type === 'truth' ? 'Truth' : 'Dare'} #${truthOrDare.id}`)
			.setDescription(truthOrDare.question)
			.setColor(type === 'truth' ? DugColors.Success : DugColors.Warn)
			.setFooter({ text: `Rating: ${truthOrDare.rating}` });

		return interaction.reply({ content: `${type === 'truth' ? 'Truth' : 'Dare'} selected by ${interaction.member}`, embeds: [embed] });
	}

	private async getTruthOrDare(type: 'truth' | 'dare', rating: Rating = 'PG13'): Promise<TruthOrDare | null> {
		const response = await fetch(`https://api.truthordarebot.xyz/v1/${type}?rating=${rating}`);
		const data = (await response.json()) as any;

		if (data.error) {
			return null;
		}

		return data as TruthOrDare;
	}
}

type TruthOrDare<IsTruth extends boolean | null = null> = {
	id: string;
	type: IsTruth extends true ? 'truth' : IsTruth extends false ? 'dare' : 'truth' | 'dare';
	rating: Rating;
	question: string;
	translations: {
		bn: string;
		de: string;
		es: string;
		fr: string;
		hi: string;
		tl: string;
	};
};

type Rating = 'PG' | 'PG13' | 'R';
