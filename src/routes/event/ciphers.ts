import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'event/ciphers'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const unlockedSet = await this.container.cipher.getUnlockedSet();
		const unlockedArray = Array.from(unlockedSet);

		response.json({ ciphers: unlockedArray });
	}
}
