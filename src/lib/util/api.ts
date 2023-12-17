import { createFunctionPrecondition } from '@sapphire/decorators';
import { ApiRequest, ApiResponse, HttpCodes } from '@sapphire/plugin-api';
import { envParseString } from '@skyra/env-utilities';

export const authenticated = () =>
	createFunctionPrecondition(
		(request: ApiRequest) => Boolean(request.headers.authorization === `Bearer ${envParseString('API_KEY')}`),
		(_request: ApiRequest, response: ApiResponse) => response.error(HttpCodes.Unauthorized)
	);
