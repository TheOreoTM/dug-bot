import { DugColors } from '#constants';
import type { GuildMessage, InteractionOrMessage } from '#lib/types/Discord';
import { getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import canvafy from 'canvafy';
import { ChatInputCommandInteraction, EmbedBuilder, Message } from 'discord.js';
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
		return this.sendLeaderboard(interaction), page;
	}

	private async sendLeaderboard(interactionOrMessage: InteractionOrMessage, page = 1) {
		interactionOrMessage instanceof ChatInputCommandInteraction ? interactionOrMessage.deferReply() : null;
		const leaderboard = await this.container.db.userLevel.getLeaderboard(page);
		const usersData = leaderboard.map(async (user, index) => {
			const discordUser = await this.container.client.users.fetch(user.userId);
			if (!discordUser) return null;
			return {
				top: index + 1,
				tag: getTag(discordUser),
				score: user.currentLevel,
				avatar: discordUser?.displayAvatarURL({ extension: 'png', forceStatic: true }) ?? 'https://cdn.discordapp.com/embed/avatars/0.png'
			};
		});

		const filteredUserData = usersData.filter((user) => user !== null) as Promise<{
			top: number;
			tag: string;
			score: number;
			avatar: string;
		}>[];

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
			.setUsersData(await Promise.all(filteredUserData))
			.setScoreMessage('Level: ')
			.setOpacity(0.6)
			.build();

		const embed = new EmbedBuilder()
			.setTitle(`${interactionOrMessage.guild?.name}'s leaderboard`)
			.setImage(`attachment://leaderboard.png`)
			.setColor(DugColors.Default);

		interactionOrMessage instanceof Message
			? await send(interactionOrMessage, { files: [{ name: 'leaderboard.png', attachment: lbImage }], embeds: [embed] })
			: await interactionOrMessage.editReply({ files: [{ name: 'leaderboard.png', attachment: lbImage }], embeds: [embed] });
	}
}