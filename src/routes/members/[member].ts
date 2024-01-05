import { MainServerID } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'members/:member'
})
export class UserRoute extends Route {
	public async [methods.GET](request: ApiRequest, response: ApiResponse) {
		const memberId = request.params.member;

		const scc = await this.container.client.guilds.fetch(MainServerID);
		const member = scc.members.cache.get(memberId);
		if (!member) return response.error(HttpCodes.BadRequest);

		return response.json({ ...member });
	}

	public [methods.POST](_request: ApiRequest, response: ApiResponse) {
		response.json({ message: 'Hello World' });
	}
}
