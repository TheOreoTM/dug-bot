import { SendLogEmbed } from '#lib/classes';
import { authenticated } from '#lib/util/api';
import { getLevelInfo } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'levels/:user'
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		const userId = request.params.user;

		const user = this.container.client.users.cache.get(userId);
		if (!user) return response.json(null);

		const userData = await this.container.db.userLevel.findUnique({
			where: {
				userId
			}
		});

		const rank = await this.container.db.userLevel.getRank(userId);

		return response.json({ ...userData, rank });
	}

	@authenticated()
	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const requestBody = request.body as { amount: string | undefined; staff_id: string | undefined };
		const userId = request.params.user;
		const amountRes = requestBody['amount'];
		const staffId = requestBody['staff_id'];

		if (!amountRes) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid amount' });
		}

		const amount = parseInt(amountRes);
		if (isNaN(amount)) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid amount, is not a number' });
		}

		if (!staffId) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid staff_id' });
		}
		if (!userId) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid Body' });
		}

		const levelData = getLevelInfo(amount);

		await this.container.db.userLevel.upsert({
			where: {
				userId: userId
			},
			create: {
				userId: userId,
				currentLevel: amount,
				currentXp: 0,
				totalXp: levelData.totalXpOfCurrentLevel,
				requiredXp: levelData.xpNeededToLevelUp
			},
			update: {
				currentLevel: amount,
				currentXp: 0,
				totalXp: levelData.totalXpOfCurrentLevel,
				requiredXp: levelData.xpNeededToLevelUp
			}
		});

		const user = await this.container.client.users.fetch(userId);
		const staff = await this.container.client.users.fetch(staffId);
		SendLogEmbed.LevelSet({
			user: user,
			level: amount,
			reason: '`xp set level` command **through API**',
			staff: staff
		});

		return response.json({ message: 'success' });
	}
}
