import type { GuildMessage } from '#lib/types/Discord';
import { getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Rank } from 'canvafy';
import { ApplicationCommandType, AttachmentBuilder, GuildMember } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'View your level information',
	aliases: ['level']
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
		const member = await interaction.guild.members.cache.get(interaction.targetId);
		const rankcard = await this.genRankCard(member || interaction.member);
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

		const customData = await this.container.db.userLevel.getCustoms(member.id);

		const roleColor = member.roles.highest.hexColor;
		const img = member.displayAvatarURL({ forceStatic: true });
		const requiredXpColor = `#747879`;
		const bgImage = customData.bgImage;
		const fontColor = customData.fontColor ? customData.fontColor : '#ffffff';
		const barColor = customData.barColor ? customData.barColor : roleColor;
		const bgColor = customData.bgColor ? customData.bgColor : `#23272a`;
		const levelColor = roleColor;
		const customStatusColor = customData.avatarBorderColor ? customData.avatarBorderColor : roleColor;
		const borderColor = customData.borderColor ? customData.borderColor : roleColor;

		const rankCard = new Rank()
			.setLevel(data?.currentLevel || 0, 'LEVEL')
			.setRank(rank, 'RANK')
			.setAvatar(img)
			.setCurrentXp(data?.currentXp || 0, bgColor)
			.setRequiredXp(data?.requiredXp || 100, requiredXpColor)
			.setBorder(borderColor)
			.setBarColor(barColor)
			.setCustomStatus(customStatusColor)
			.setUsername(getTag(member.user), fontColor)
			.setRankColor(fontColor, rankColor)
			.setBackground('color', bgColor)
			.setLevelColor(fontColor, levelColor);

		if (bgImage) rankCard.setBackground('image', bgImage);

		const attachment = new AttachmentBuilder(await rankCard.build(), { name: 'rankcard.png' });
		return attachment;
	}
}
