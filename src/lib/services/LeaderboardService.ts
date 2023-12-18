import { leaderboardCacheKey } from '#lib/database/keys';
import { LeaderboardPageData } from '#lib/types';
import { getTag } from '#lib/util/utils';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';

export class LeaderboardService {
	private readonly levelingCacheKey = leaderboardCacheKey;
	private readonly db = container.db;
	private readonly cache = container.cache;
	private readonly client = container.client;

	public constructor() {}

	public async createLevelLeaderboardPage(page = 1, perPage = 10): Promise<LeaderboardPageData | null> {
		const offset = (page - 1) * perPage; // Calculate the offset based on the page number

		const leaderboard = await this.db.userLevel.findMany({
			take: perPage, // Limit the results to the number of users per page
			skip: offset, // Apply the calculated offset
			orderBy: {
				totalXp: 'desc' // Sort by totalXp in descending order
			}
		});

		if (!leaderboard) return null;
		const usersData = leaderboard.map(async (user, index) => {
			const discordUser = await this.client.users.fetch(user.userId);
			if (!discordUser) return null;
			return {
				top: 10 * (page - 1) + (index + 1),
				tag: getTag(discordUser),
				score: user.currentLevel,
				avatar: discordUser.displayAvatarURL() ?? 'https://cdn.discordapp.com/embed/avatars/0.png'
			};
		});

		const filteredUserData = usersData.filter((user) => user !== null) as Promise<{
			top: number;
			tag: string;
			score: number;
			avatar: string;
		}>[];

		const formattedUserData = await Promise.all(filteredUserData);

		return formattedUserData;
	}

	public async getLevelLeaderboardPage(page = 1): Promise<LeaderboardPageData | null> {
		const key = this.levelingCacheKey(page);

		const cacheData = await this.cache.get(key);
		if (isNullish(cacheData)) {
			// If above page 10 OR its not cached
			console.log('cached data is nullish');
			const data = await this.createLevelLeaderboardPage(page);
			if (isNullish(data)) return null;

			await this.cacheLevelLeaderboardPage(page);
			return data;
		}

		const data = JSON.parse(cacheData);
		if (isNullish(data)) return [];

		return data as LeaderboardPageData;
	}

	public async cacheLevelLeaderboardPage(page = 1) {
		const key = this.levelingCacheKey(page);

		const leaderboard = await this.createLevelLeaderboardPage(page);
		if (!leaderboard) return null;

		const response = await this.cache.set(key, JSON.stringify(leaderboard));
		return response;
	}
}
