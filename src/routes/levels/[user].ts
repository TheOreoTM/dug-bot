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

	public [methods.POST](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'Hello World' });
	}
}
