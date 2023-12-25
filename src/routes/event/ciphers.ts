import { CIPHER_DATA, CipherData } from '#lib/data';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'event/ciphers'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const unlockedSet = await this.container.cipher.getUnlockedSet();
		const unlockedArray = Array.from(unlockedSet);
		const ciphers: (CipherData & { LEVEL: number })[] = [];
		for (const cipher of unlockedArray) {
			ciphers.push({ ...CIPHER_DATA[`CIPHER_${cipher}`], LEVEL: cipher });
		}
		response.json({ ...ciphers });
	}
}
