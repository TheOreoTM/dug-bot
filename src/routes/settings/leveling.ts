import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'settings/leveling'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const levelRoles = await this.container.db.levelRole.findMany({ orderBy: { level: 'asc' } });
		const globalBoost = await this.container.core.getGlobalBoost();

		response.json({ levelRoles, globalBoost });
	}

	public [methods.POST](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'Hello World' });
	}
}
