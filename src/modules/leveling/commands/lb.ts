import { DugColors } from '#constants';
import type { GuildMessage, InteractionOrMessage } from '#lib/types/Discord';
import { formatFailMessage } from '#lib/util/formatter';
import { sendInteractionOrMessage } from '#lib/util/messages';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import canvafy from 'canvafy';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from 'discord.js';
const { Top } = canvafy;
@ApplyOptions<Command.Options>({
	description: 'View the leaderbord of the server',
	aliases: ['leaderboard', 'top']
})
export class UserCommand extends Command {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	// Message command
	public override async messageRun(message: GuildMessage) {
		return this.sendLeaderboard(message);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction<'cached'>) {
		return this.sendLeaderboard(interaction);
	}

	private async sendLeaderboard(interactionOrMessage: InteractionOrMessage) {
		const loadingEmbed = new EmbedBuilder()
			.setTitle(`Loading... ${interactionOrMessage.guild?.name}'s leaderboard`)
			.setImage(`https://media.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif`)
			.setColor(DugColors.Default)
			.setFooter({ text: `Page ${1}` });

		interactionOrMessage instanceof Message ? send(interactionOrMessage, { embeds: [loadingEmbed] }) : interactionOrMessage.deferReply();
		const leaderboard = await this.container.leaderboard.getLevelLeaderboardPage(1);
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

		const userRank = await this.container.db.userLevel.getRank(interactionOrMessage.member.id);
		const embed = new EmbedBuilder()
			.setTitle(`${interactionOrMessage.guild?.name}'s leaderboard`)
			.setImage(`attachment://leaderboard.png`)
			.setColor(DugColors.Default)
			.setFooter({ text: `Page ${1} | Your rank: #${userRank}` });

		interactionOrMessage instanceof Message
			? await send(interactionOrMessage, {
					files: [{ name: 'leaderboard.png', attachment: lbImage }],
					components: [
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							new ButtonBuilder()
								.setLabel('View top 100')
								.setStyle(ButtonStyle.Link)
								.setURL('https://dashboard.skittlechan.com/leaderboard')
						)
					],
					embeds: [embed]
				})
			: await interactionOrMessage.editReply({ files: [{ name: 'leaderboard.png', attachment: lbImage }], embeds: [embed] });
	}
}
