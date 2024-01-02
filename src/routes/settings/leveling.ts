import { authenticated } from '#lib/util/api';
import { ApplyOptions } from '@sapphire/decorators';
import { methods, Route, type ApiRequest, type ApiResponse, HttpCodes } from '@sapphire/plugin-api';

@ApplyOptions<Route.Options>({
	route: 'settings/leveling'
})
export class UserRoute extends Route {
	public async [methods.GET](_request: ApiRequest, response: ApiResponse) {
		const levelRoles = await this.container.db.levelRole.findMany({ orderBy: { level: 'asc' }, select: { level: true, roleId: true } });
		const globalBoost = await this.container.core.getGlobalBoost();
		const enabled = true;

		response.json({ enabled, levelRoles, globalBoost } as LevelingSettings);
	}

	@authenticated()
	public async [methods.POST](request: ApiRequest, response: ApiResponse) {
		const requestBody = request.body as { setting: keyof LevelingSettings; value: LevelingSettings[keyof LevelingSettings] };

		console.log(requestBody.value, typeof requestBody.value);

		if (requestBody.setting === 'enabled') {
			if (typeof requestBody.value !== 'boolean') {
				return this.badRequest(response, `Not a valid value for the setting "enabled". Received "${requestBody.value}"`);
			}

			await this.container.db.settings.setModuleEnabled('leveling', requestBody.value);
		}

		if (requestBody.setting === 'globalBoost') {
			if (typeof requestBody.value !== 'number') {
				return this.badRequest(response, `Not a valid value for the setting "globalBoost". Received "${requestBody.value}"`);
			}

			await this.container.core.setGlobalBoost(requestBody.value);
		}

		if (requestBody.setting === 'levelRoles') {
			if (!isArrayOfLevelRoles(requestBody.value)) {
				return this.badRequest(response, `Not a valid value for the setting "levelRoles". Received "${requestBody.value}"`);
			}

			await this.container.db.levelRole.setRoles(requestBody.value);
		}
		response.status(200).json({ message: 'success' });
	}

	private badRequest(response: ApiResponse, error?: string) {
		return response.status(HttpCodes.BadRequest).json(error ? { error } : { error: 'Bad request' });
	}
}

function isArrayOfLevelRoles(value: unknown): value is LevelRole[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'object' && 'id' in item && 'level' in item && 'roleId' in item);
}

type LevelingSettings = { enabled: boolean; levelRoles: LevelRole[]; globalBoost: number };

type LevelRole = {
	level: number;
	roleId: string;
};
