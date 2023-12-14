import { ClientConfig, ModuleName, config } from '#config';
import { container, SapphireClient } from '@sapphire/framework';
import { xprisma } from '#lib/util/prisma';
import { getRootData } from '@sapphire/pieces';
import { join } from 'path';
import { Redis } from 'ioredis';
import { envParseNumber, envParseString } from '@skyra/env-utilities';

export class DugClient<Ready extends boolean = boolean> extends SapphireClient<Ready> {
	public readonly loadedModules: ModuleName[] = config.enabled_modules;
	public constructor() {
		super(ClientConfig);

		if (isEnabled('core')) enableModule(this, 'core');
		if (isEnabled('leveling')) enableModule(this, 'leveling');
		if (isEnabled('economy')) enableModule(this, 'economy');
		if (isEnabled('faction')) enableModule(this, 'faction');
		if (isEnabled('games')) enableModule(this, 'games');
		if (isEnabled('welcomer')) enableModule(this, 'welcomer');
	}

	public override async login(token?: string): Promise<string> {
		container.db = xprisma;
		container.cache = new Redis({
			host: envParseString('REDIS_HOST'),
			password: envParseString('REDIS_PASSWORD'),
			port: envParseNumber('REDIS_PORT'),
			db: 0
		});

		return super.login(token);
	}

	public override destroy(): Promise<void> {
		container.db.$disconnect();
		container.cache.disconnect();
		return super.destroy();
	}
}

function isEnabled(moduleName: ModuleName) {
	return config.enabled_modules.includes(moduleName);
}

function enableModule(client: DugClient, moduleName: ModuleName) {
	const rootData = getRootData();

	client.stores.registerPath(join(rootData.root, `modules/${moduleName}`));
}
