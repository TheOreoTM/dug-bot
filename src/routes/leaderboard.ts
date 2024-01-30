import { fetchSCC } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'leaderboard'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		let limit = Number(_request.query['limit']) || 50;
		if (limit > 100) limit = 100;

		const topMembers = await this.container.db.userLevel.findMany({
			take: limit,
			orderBy: {
				totalXp: 'desc'
			}
		});

		const leaderboard = [];

		for (const userLevel of topMembers) {
			try {
				const user = await this.container.client.users.fetch(userLevel.userId);

				leaderboard.push({
					avatarUrl:
						user.displayAvatarURL({ forceStatic: true, extension: 'webp', size: 128 }) ||
						'https://cdn.discordapp.com/embed/avatars/1.png',
					id: userLevel.userId,
					username: user.username || 'Deleted User',
					level: userLevel.currentLevel,
					xp: userLevel.currentXp,
					position: leaderboard.length + 1
				});
			} catch (error) {
				console.error(`Error fetching user ${userLevel.userId}:`, error);
			}
		}

		response.setHeader('Cache-Control', 'public, max-age=3600');
		return response.json({ ...leaderboard });
	}
}
