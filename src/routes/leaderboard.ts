import { fetchSCC } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'leaderboard'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		let limit = Number(_request.query['limit']) || 50;
		console.log('🚀 ~ UserRoute ~ _request.query:', _request.query);

		if (limit > 100) limit = 100;

		const topMembers = await this.container.db.userLevel.findMany({
			take: limit,
			orderBy: {
				totalXp: 'desc'
			}
		});

		const scc = await fetchSCC();

		const awaitLeaderboard = topMembers.map(async (userLevel, index) => {
			const member = await scc.members.fetch(userLevel.userId);
			return {
				avatarUrl:
					member?.user.displayAvatarURL({ forceStatic: true, extension: 'webp', size: 128 }) ??
					`https://cdn.discordapp.com/embed/avatars/1.png`,
				id: userLevel.userId,
				username: member?.user.username ?? 'Deleted User',
				level: userLevel.currentLevel,
				xp: userLevel.currentXp,
				position: index + 1
			};
		});

		const leaderboard = await Promise.all(awaitLeaderboard);

		response.setHeader('Cache-Control', 'public, max-age=3600');
		return response.json({ ...leaderboard });
	}
}