import { globalBoostCacheKey } from '#lib/database/keys';
import { LoggingService } from '#lib/services/LoggingService';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';

export class CoreSettingsService {
	private readonly cache = container.cache;
	private readonly db = container.db;

	public constructor() {}

	public async getGlobalBoost(fallbackValue = 0) {
		const key = globalBoostCacheKey;

		const globalBoost = await this.cache.get(key);
		if (isNullish(globalBoost)) {
			await this.db.settings.getGlobalBoost(fallbackValue);
			await this.cache.set(key, fallbackValue);
			return fallbackValue;
		}
		return Number(globalBoost);
	}

	public async setGlobalBoost(newValue: number) {
		const key = globalBoostCacheKey;

		await this.db.settings.setGlobalBoost(newValue);

		const returnValue = await this.cache.set(key, newValue);
		return returnValue;
	}

	get logging() {
		return new LoggingService();
	}
}
