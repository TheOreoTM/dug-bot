import { API_URI } from '#constants';
import { CipherData, CipherLevel } from '#lib/data';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse } from '@sapphire/plugin-api';
import { envParseString } from '@skyra/env-utilities';

@ApplyOptions<Route.Options>({
	route: 'event/ciphers'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const unlockedSet = await this.container.cipher.getUnlockedSet();
		const unlockedArray = Array.from(unlockedSet);
		const cipherDataRes = await fetch(`${API_URI}/ciphers?key=${envParseString('API_KEY')}`);
		const cipherData = (await cipherDataRes.json()) as Record<CipherLevel, CipherData>;
		const ciphers: { DESCRIPTION: string; LEVEL: number }[] = [];
		for (const cipher of unlockedArray) {
			ciphers.push({ DESCRIPTION: cipherData[`CIPHER_${cipher}`].DESCRIPTION, LEVEL: cipher });
		}
		response.json({ ciphers });
	}
}
