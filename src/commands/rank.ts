import type { GuildMessage } from '#lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Rank } from 'canvafy';
import { ApplicationCommandType, AttachmentBuilder, GuildMember } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'View your level information'
})
export class UserCommand extends Command {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option //
						.setName('user')
						.setDescription('The member you want to check the rank for')
						.setRequired(false)
				)
		);

		// Register Context Menu command available from any user
		registry.registerContextMenuCommand({
			name: 'View Rank',
			type: ApplicationCommandType.User
		});
	}

	// Message command
	public override async messageRun(message: GuildMessage, args: Args) {
		const member = await args.pick('member').catch(() => message.member);
		const rankcard = await this.genRankCard(member);
		send(message, { files: [rankcard] });
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction<'cached'>) {
		const rankcard = await this.genRankCard(interaction.options.getMember('user') ?? interaction.member);
		interaction.reply({ files: [rankcard] });
	}

	// Context Menu command
	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction<'cached'>) {
		const rankcard = await this.genRankCard(interaction.member);
		interaction.reply({ files: [rankcard] });
	}

	private async genRankCard(member: GuildMember) {
		const data = await this.container.db.userLevel.findUnique({
			where: {
				userId: member.id
			}
		});

		const rank: number = 1;
		let rankColor = `#ffffff`;
		if (rank === 1) rankColor = `#FFD700`;
		if (rank === 2) rankColor = `#C0C0C0`;
		if (rank === 3) rankColor = `#CD7F32`;

		const img = member.displayAvatarURL({ forceStatic: true });
		const requiredXpColor = `#747879`;
		const fontColor = '#ffffff';
		const barColor = member.roles.highest.hexColor;
		const bgColor = `#23272a`;

		const rankCard = new Rank()
			.setLevel(data?.currentLevel || 0, 'LEVEL')
			.setRank(rank, 'RANK')
			.setAvatar(img)
			.setCurrentXp(data?.currentXp || 0, bgColor)
			.setRequiredXp(data?.requiredXp || 100, requiredXpColor)
			.setBarColor(barColor)
			.setBorder(barColor)
			.setCustomStatus(barColor)
			.setUsername(member.user.username, fontColor)
			.setBackground('color', bgColor)
			.setRankColor(fontColor, rankColor)
			.setLevelColor(fontColor, barColor);

		const attachment = new AttachmentBuilder(await rankCard.build(), { name: 'rankcard.png' });
		return attachment;
	}
}
