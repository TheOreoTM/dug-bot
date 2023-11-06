import { ClientConfig, ModuleName, config } from '#config';
import { container, SapphireClient } from '@sapphire/framework';
import { xprisma } from '#lib/util/prisma';
import { getRootData } from '@sapphire/pieces';
import { join } from 'path';

export class DugClient<Ready extends boolean = boolean> extends SapphireClient<Ready> {
	public constructor() {
		super(ClientConfig);

		const client = this as DugClient;
		if (isEnabled('core')) enableModule(client, 'core');
		if (isEnabled('leveling')) enableModule(client, 'leveling');
		if (isEnabled('economy')) enableModule(client, 'economy');
		if (isEnabled('faction')) enableModule(client, 'faction');
		if (isEnabled('games')) enableModule(client, 'games');
		if (isEnabled('welcomer')) enableModule(client, 'welcomer');
	}

	public override async login(token?: string): Promise<string> {
		container.db = xprisma;
		return super.login(token);
	}

	public override destroy(): Promise<void> {
		return super.destroy();
	}
}

function isEnabled(moduleName: ModuleName) {
	return config.enabled_modules.includes(moduleName);
}

function enableModule(client: DugClient<false>, moduleName: ModuleName) {
	const rootData = getRootData();

	client.loadedModules.push(moduleName);
	client.stores.registerPath(join(rootData.root, `modules/${moduleName}`));
}

declare module '@sapphire/pieces' {
	interface Container {
		db: typeof xprisma;
	}
}
