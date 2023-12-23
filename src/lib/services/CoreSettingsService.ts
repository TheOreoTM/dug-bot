import { globalBoostCacheKey } from '#lib/database/keys';
import { LoggingService } from '#lib/services/LoggingService';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';

export class CoreSettingsService {
	private readonly cache = container.cache;

	public constructor() {}

	public async getGlobalBoost(defaultValue = 0) {
		const key = globalBoostCacheKey;

		const globalBoost = await this.cache.get(key);
		if (isNullish(globalBoost)) return defaultValue;
		return Number(globalBoost);
	}

	public async setGlobalBoost(newValue: number) {
		const key = globalBoostCacheKey;

		const returnValue = await this.cache.set(key, newValue);
		return returnValue;
	}

	get logging() {
		return new LoggingService();
	}
}
