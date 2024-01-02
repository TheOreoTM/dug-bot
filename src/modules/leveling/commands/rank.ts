import { DugColors } from '#constants';
import type { GuildMessage } from '#lib/types/Discord';
import { formatFailMessage } from '#lib/util/formatter';
import { getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import {
	ActionRowBuilder,
	ApplicationCommandType,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	GuildMember,
	InteractionReplyOptions,
	MessageCreateOptions
} from 'discord.js';
import canvacord from 'canvacord';
const { Rank: RankCard } = canvacord;

@ApplyOptions<Command.Options>({
	description: 'View your level information',
	aliases: ['level'],
	flags: ['text', 't', 'slow-wifi'],
	preconditions: ['BotChannelOnly']
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
				.addBooleanOption((o) => o.setName('text').setDescription('Send the text based version (for slow wifi users)').setRequired(false))
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
		const result = (await this.genRankCard(member)) as MessageCreateOptions;
		send(message, result);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction<'cached'>) {
		const result = (await this.genRankCard(interaction.options.getMember('user') ?? interaction.member)) as InteractionReplyOptions;
		interaction.reply(result);
	}

	// Context Menu command
	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction<'cached'>) {
		const member = interaction.guild.members.cache.get(interaction.targetId);
		const result = (await this.genRankCard(member || interaction.member)) as InteractionReplyOptions;
		interaction.reply(result);
	}

	private async genRankCard(member: GuildMember): Promise<MessageCreateOptions | (InteractionReplyOptions & { fetchReply: true })> {
		const data = await this.container.leveling.getCardData(member.id);
		// const data = await this.container.db.userLevel.findUnique({
		// 	where: {
		// 		userId: member.id
		// 	}
		// });

		const globalBoost = await this.container.core.getGlobalBoost(1);

		if (!data) {
			const embed = new EmbedBuilder()
				.setDescription(formatFailMessage('You have no rank. Send some messages to earn a rank.'))
				.setColor(DugColors.Fail);
			return { embeds: [embed] };
		}

		const userXpBoost = Math.floor(data.xpBoost + globalBoost);
		console.log('🚀 ~ file: rank.ts:92 ~ UserCommand ~ genRankCard ~ userXpBoost:', userXpBoost);
		const rank: number = await this.container.db.userLevel.getRank(data.userId);

		// if (text) {
		// 	const embed = new EmbedBuilder()
		// 		.setTitle(`${getTag(member.user)}'s Level Information`)
		// 		.setColor(DugColors.Default)
		// 		.setDescription(
		// 			`${blockQuote(
		// 				`**Level:** \` ${data.currentLevel} \`
		// 				 **Rank:**​ ​ \` #${rank} \`
		// 				 **XP:**​ ​ ​ ​ ​ ​ ​\` ${toCompactNum(data.currentXp)} / ${toCompactNum(data.requiredXp)}`
		// 			)} \` \n\n${genBar(data.currentXp, data.requiredXp, 6)} \` ${((data.currentXp / data.requiredXp) * 100).toFixed(2)}% \`
		// 			${data.xpBoost > 0.0 ? `${DugEmojis.ListLast} **XP Boost:** \` ${userXpBoost}% \`` : ``}`
		// 		);
		// 	return { embeds: [embed] };
		// }

		const roleColor = member.displayHexColor;
		const img = member.displayAvatarURL({ forceStatic: true });
		const requiredXpColor = `#747879`;
		const bgImage = data.bgImage;
		const fontColor = data.fontColor ? data.fontColor : '#ffffff';
		const barColor = data.barColor ? data.barColor : roleColor;
		const bgColor = data.bgColor ? data.bgColor : `#23272a`;
		const levelColor = roleColor;
		const customStatusColor = data.avatarBorderColor ? data.avatarBorderColor : roleColor;

		let rankColor = fontColor;
		if (rank === 1) {
			rankColor = `#f7b900`;
		}
		if (rank === 2) {
			rankColor = `#c0c0c0`;
		}
		if (rank === 3) {
			rankColor = `#cd7f32`;
		}

		const card = new RankCard()
			.setAvatar(img)
			.setRank(rank, 'RANK')
			.setRankColor(rankColor, rankColor)
			.setLevel(data.currentLevel || 0, 'LEVEL')
			.setLevelColor(fontColor, levelColor)
			.setCurrentXP(data.currentXp || 0, fontColor)
			.setProgressBar(barColor, 'COLOR', true)
			.setRequiredXP(data.requiredXp || 100, requiredXpColor)
			.setUsername(getTag(member.user), fontColor)
			.setBackground('COLOR', bgColor)
			.setCustomStatusColor(customStatusColor);
		if (bgImage) card.setBackground('IMAGE', bgImage);

		const xpBoostButton = new ButtonBuilder()
			.setDisabled(true)
			.setLabel(`Current Xp Boost: x${userXpBoost}`)
			.setCustomId('none')
			.setStyle(ButtonStyle.Secondary);

		const attachment = new AttachmentBuilder(await card.build(), { name: 'rankcard.png' });

		return {
			files: [attachment],
			components: userXpBoost > 1 ? [new ActionRowBuilder<ButtonBuilder>().addComponents(xpBoostButton)] : []
		};
	}
}
