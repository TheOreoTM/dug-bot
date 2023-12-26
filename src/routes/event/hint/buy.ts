import { authenticated } from '#lib/util/api';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes, type RouteOptions } from '@sapphire/plugin-api';

@ApplyOptions<RouteOptions>({
	route: 'event/hint/buy'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'yo' });
	}

	@authenticated()
	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const requestBody = request.body as {
			level: string | undefined;
			price: string | undefined;
			user_id: string | undefined;
			hint: string | undefined;
		};

		const levelRes = requestBody['level'];
		const userId = requestBody['user_id'];
		const hintRes = requestBody['hint'];
		const priceRes = requestBody['price'];

		console.log(requestBody);
		console.log(levelRes, userId, hintRes);
		console.log(requestBody.level, requestBody.hint, requestBody.user_id);

		if (!levelRes) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid cipher' });
		}
		const level = parseInt(levelRes);
		if (isNaN(level)) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid level. Should be a number' });
		}

		if (!priceRes) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid price' });
		}

		const price = parseInt(priceRes);
		if (isNaN(price)) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid price. Should be a number' });
		}

		const amount = parseInt(levelRes);
		if (isNaN(amount)) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid cipher. Should be a number' });
		}

		if (!hintRes) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid hint' });
		}

		const hint = parseInt(hintRes);
		if (isNaN(hint) || ![0, 1, 2].includes(hint)) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid hint. Should be a valid hint' });
		}

		if (!userId) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid Body' });
		}

		const faction = await this.container.db.user.getUserFaction(userId);
		if (!faction) return response.status(HttpCodes.BadRequest).json({ message: 'You have to be in a faction to participate in this event' });

		const factionBalance = faction.tokens ?? 0;
		const canBuy = factionBalance >= price;
		if (!canBuy) return response.status(HttpCodes.BadRequest).json({ message: 'Your faction cannot afford this' });

		await this.container.cipher.buyHint(userId, level, hint as 0 | 1 | 2);

		return response.json({ message: 'success' });
	}
}
