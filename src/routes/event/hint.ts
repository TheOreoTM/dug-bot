import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'event/hint'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const requestBody = _request.body as { level: string | undefined; user_id: string | undefined };

		const levelRes = requestBody['level'];
		const userId = requestBody['user_id'];

		if (!levelRes) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid cipher' });
		}
		const level = parseInt(levelRes);
		if (isNaN(level)) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid level. Should be a number' });
		}

		if (!userId) {
			return response.status(HttpCodes.BadRequest).json({ message: 'Invalid Body' });
		}

		const hints = await this.container.cipher.getBoughtHints(userId, level);
		return response.json(JSON.stringify(hints));
	}
}
