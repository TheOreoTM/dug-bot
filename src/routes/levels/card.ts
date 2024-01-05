import { MainServerID } from '#constants';
import { getTag } from '#lib/util/utils';
import { UserLevel } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, MimeTypes, HttpCodes } from '@sapphire/plugin-api';

import canvacord from 'canvacord';
import { GuildMember } from 'discord.js';
const { Rank: RankCard } = canvacord;

@ApplyOptions<Route.Options>({
	route: 'levels/card/:member'
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		const memberId = request.params.member;

		const scc = await this.container.client.guilds.fetch(MainServerID);
		const member = await scc.members.fetch(memberId);
		if (!member) return response.error(HttpCodes.BadRequest);

		const userData = await this.container.db.userLevel.findUnique({
			where: {
				userId: member.id
			}
		});

		if (!userData) return response.json(null);

		const rank = await this.container.db.userLevel.getRank(memberId);

		const cardBuffer = this.genRankCard(member, rank, userData);

		console.log(await cardBuffer.build());
		console.log(cardBuffer.build());

		return response
			.setContentType(MimeTypes.ImagePng)
			.status(200)
			.end(await cardBuffer.build());
	}

	public [methods.POST](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'Hello World' });
	}

	private genRankCard(member: GuildMember, rank: number, data: UserLevel) {
		const roleColor = member.displayHexColor;
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
			.setAvatar(member.displayAvatarURL())
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

		return card;
	}
}
