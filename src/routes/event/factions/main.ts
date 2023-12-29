import { SelectAllOptions } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'event/factions'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const allFactions = await this.container.db.faction.findMany({ orderBy: { tokens: 'desc' }, select: SelectAllOptions });

		return response.json({ ...allFactions });
	}
}
