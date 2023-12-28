import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'users/:user'
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		const userId = request.params.user;

		const user = this.container.client.users.cache.get(userId);
		if (!user) return response.error(HttpCodes.BadRequest);

		const userData = await this.container.db.user.findUnique({
			where: {
				id: userId
			}
		});

		const faction = await this.container.db.faction
			.findUnique({
				where: {
					id: userData?.factionId ?? 0
				}
			})
			.catch(() => null);

		return response.json({ ...user, data: userData ?? null, faction: faction });
	}

	public [methods.POST](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'Hello World' });
	}
}
