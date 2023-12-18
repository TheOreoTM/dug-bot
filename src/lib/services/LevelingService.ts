import { DugColors } from '#constants';
import { formatFailMessage } from '#lib/util/formatter';
import { getTag } from '#lib/util/utils';
import { container } from '@sapphire/pieces';
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember } from 'discord.js';
import canvacord from 'canvacord';
import { UserLevel } from '@prisma/client';
import { levelDataCacheKey } from '#lib/database/keys';
import { isNullish } from '@sapphire/utilities';
const { Rank: RankCard } = canvacord;

export class LevelingService {
	private readonly db = container.db;
	private readonly cacheKey = levelDataCacheKey;
	private readonly cache = container.cache;

	// Todo: Add add/remove/set xp/level commands
	public constructor() {}

	public async createRankCard(member: GuildMember) {
		const data = await this.db.userLevel.findUnique({
			where: {
				userId: member.id
			}
		});

		const globalBoost = await container.core.getGlobalBoost(0);

		if (!data) {
			const embed = new EmbedBuilder()
				.setDescription(formatFailMessage('You have no rank. Send some messages to earn a rank.'))
				.setColor(DugColors.Fail);
			return { embeds: [embed] };
		}

		const userXpBoost = Math.floor((data.xpBoost + globalBoost) * 100);
		const rank: number = await this.db.userLevel.getRank(data.userId);

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
		// 			${data.xpBoost > 0 ? `${DugEmojis.ListLast} **XP Boost:** \` ${userXpBoost}% \`` : ``}`
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
			.setLabel(`Current Xp Boost: ${userXpBoost}%`)
			.setCustomId('none')
			.setStyle(ButtonStyle.Secondary);

		const attachment = new AttachmentBuilder(await card.build(), { name: 'rankcard.png' });

		return {
			files: [attachment],
			components: userXpBoost > 0 ? [new ActionRowBuilder<ButtonBuilder>().addComponents(xpBoostButton)] : []
		};
	}

	public async setCardData(data: UserLevel) {
		const key = this.cacheKey(data.userId);
		return await this.cache.hset(key, data);
	}

	public async getCardData(userId: string) {
		const key = this.cacheKey(userId);
		const cachedData = await this.cache.hgetall(key);
		console.log(cachedData);
		if (isNullish(cachedData)) {
			return await this.db.userLevel.findUnique({
				where: {
					userId
				}
			});
		}
		return cachedData;
	}
}
