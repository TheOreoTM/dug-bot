import { authenticated } from '#lib/util/api';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'event/hint'
})
export class UserRoute extends Route {
	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const requestBody = request.body as { level: string | undefined; user_id: string | undefined };

		const levelRes = requestBody.level;
		const userId = requestBody.user_id;

		if (!levelRes) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid cipher' });
		}
		const level = parseInt(levelRes);
		if (isNaN(level)) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid level. Should be a number' });
		}

		if (!userId) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid Body' });
		}

		const hints = await this.container.cipher.getBoughtHints(userId, level);
		return response.json(JSON.stringify(hints));
	}

	@authenticated()
	public async [methods.PATCH](request: ApiRequest, response: ApiResponse) {
		const requestBody = request.body as {
			level: string | undefined;
			price: string | undefined;
			user_id: string | undefined;
			hint: number | undefined;
		};

		const levelRes = requestBody['level'];
		const userId = requestBody['user_id'];
		const hint = requestBody['hint'];
		const priceRes = requestBody['price'];

		if (!levelRes) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid cipher' });
		}
		const level = parseInt(levelRes);
		if (isNaN(level)) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid level. Should be a number' });
		}

		if (!priceRes) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid price' });
		}

		const price = parseInt(priceRes);
		if (isNaN(price)) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid price. Should be a number' });
		}

		const amount = parseInt(levelRes);
		if (isNaN(amount)) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid cipher. Should be a number' });
		}

		if (hint !== 0 && !hint) {
			return response.status(HttpCodes.BadRequest).json({ error: `Invalid hint: ${typeof hint} ${hint}` });
		}

		if (isNaN(hint) || ![0, 1, 2].includes(hint)) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid hint. Should be a valid hint' });
		}

		if (!userId) {
			return response.status(HttpCodes.BadRequest).json({ error: 'Invalid Body' });
		}

		const faction = await this.container.db.user.getUserFaction(userId);
		if (!faction) return response.status(HttpCodes.BadRequest).json({ error: 'You have to be in a faction to participate in this event' });

		const factionBalance = faction.tokens ?? 0;
		const canBuy = factionBalance >= price;
		if (!canBuy) return response.status(HttpCodes.BadRequest).json({ error: 'Your faction cannot afford this' });

		await this.container.cipher.buyHint(userId, level, hint as 0 | 1 | 2);

		await this.container.db.faction.update({
			where: {
				id: faction.id
			},
			data: {
				tokens: {
					decrement: price
				}
			}
		});

		return response.json({ message: 'success' });
	}
}
