import { SendLogEmbed } from '#lib/classes';
import { authenticated } from '#lib/util/api';
import { getLevelInfo } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes, type RouteOptions } from '@sapphire/plugin-api';

@ApplyOptions<RouteOptions>({
	route: 'levels/set'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'yo' });
	}

	@authenticated()
	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const requestBody = request.body as { amount: string | undefined; user_id: string | undefined; staff_id: string | undefined };
		const amountRes = requestBody['amount'];
		const userId = requestBody['user_id'];
		const staffId = requestBody['staff_id'];

		console.log(requestBody);
		console.log(amountRes, userId, staffId);
		console.log(requestBody.amount, requestBody.user_id, requestBody.user_id);

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
