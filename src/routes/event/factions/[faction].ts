import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'event/factions/:faction'
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		const factionId = Number(request.params.faction);
		const faction = await this.container.db.faction.findUnique({
			where: {
				id: factionId
			}
		});

		if (!faction) return response.error(HttpCodes.BadRequest);

		return response.json({ faction });
	}

	public [methods.POST](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'Hello World' });
	}
}
