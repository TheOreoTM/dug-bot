import { globalCacheKey } from '#lib/database/keys';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';

export class CoreSettingsService {
	private readonly cacheKey = globalCacheKey();
	private readonly cache = container.cache;

	public constructor() {}

	public async getGlobalBoost(defaultValue = 0) {
		const globalBoost = await this.cache.get(this.cacheKey);
		if (isNullish(globalBoost)) return defaultValue;
		return Number(globalBoost);
	}

	public async setGlobalBoost(newValue: number) {
		const returnValue = await this.cache.set(this.cacheKey, newValue);
		return returnValue;
	}
}
