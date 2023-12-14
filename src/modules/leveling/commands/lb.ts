import { DugColors } from '#constants';
import type { GuildMessage, InteractionOrMessage } from '#lib/types/Discord';
import { formatFailMessage } from '#lib/util/formatter';
import { sendInteractionOrMessage } from '#lib/util/messages';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import canvafy from 'canvafy';
import { EmbedBuilder, Message } from 'discord.js';
const { Top } = canvafy;
@ApplyOptions<Command.Options>({
	description: 'View the leaderbord of the server',
	aliases: ['leaderboard', 'top']
})
export class UserCommand extends Command {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addNumberOption((o) => o.setName('page').setDescription('The page you want to see').setMaxValue(10).setMinValue(1))
		);
	}

	// Message command
	public override async messageRun(message: GuildMessage, args: Args) {
		const page = await args.pick('number').catch(() => 1);
		return this.sendLeaderboard(message, page);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const page = interaction.options.getNumber('page') ?? 1;
		return this.sendLeaderboard(interaction, page);
	}

	private async sendLeaderboard(interactionOrMessage: InteractionOrMessage, page = 1) {
		const loadingEmbed = new EmbedBuilder()
			.setTitle(`Loading... ${interactionOrMessage.guild?.name}'s leaderboard`)
			.setImage(`https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif`)
			.setColor(DugColors.Default)
			.setFooter({ text: `Page ${page}` });

		interactionOrMessage instanceof Message ? send(interactionOrMessage, { embeds: [loadingEmbed] }) : interactionOrMessage.deferReply();
		const leaderboard = await this.container.leaderboard.getLevelLeaderboardPage(page);
		if (leaderboard === null) {
			await sendInteractionOrMessage(interactionOrMessage, {
				embeds: [new EmbedBuilder().setColor(DugColors.Fail).setDescription(formatFailMessage(`That page doesnt exist`))]
			});
			return;
		}

		if (leaderboard.length === 0) {
			await sendInteractionOrMessage(interactionOrMessage, {
				embeds: [
					new EmbedBuilder()
						.setColor(DugColors.Fail)
						.setDescription(formatFailMessage(`The leaderboard service is not ready yet, please try again later`))
				]
			});
			return;
		}

		const lbImage = await new Top()
			.setColors({
				box: '#212121',
				username: '#ffffff',
				score: '#ffffff',
				firstRank: '#f7c716',
				secondRank: '#9e9e9e',
				thirdRank: '#94610f'
			})
			.setBackground('color', `#2b2d31`)
			.setUsersData(leaderboard)
			.setScoreMessage('Level: ')
			.setOpacity(0.6)
			.build();

		const embed = new EmbedBuilder()
			.setTitle(`${interactionOrMessage.guild?.name}'s leaderboard`)
			.setImage(`attachment://leaderboard.png`)
			.setColor(DugColors.Default)
			.setFooter({ text: `Page ${page}` });

		interactionOrMessage instanceof Message
			? await send(interactionOrMessage, { files: [{ name: 'leaderboard.png', attachment: lbImage }], embeds: [embed] })
			: await interactionOrMessage.editReply({ files: [{ name: 'leaderboard.png', attachment: lbImage }], embeds: [embed] });
	}
}
