import { ClientConfig, ModuleName, config } from '#config';
import { container, SapphireClient } from '@sapphire/framework';
import { xprisma } from '#lib/util/prisma';
import { getRootData } from '@sapphire/pieces';
import { join } from 'path';

export class DugClient<Ready extends boolean = boolean> extends SapphireClient<Ready> {
	public constructor() {
		super(ClientConfig);

		if (isEnabled('core')) enableModule(this, 'core');
		if (isEnabled('leveling')) enableModule(this, 'leveling');
		if (isEnabled('economy')) enableModule(this, 'economy');
		if (isEnabled('faction')) enableModule(this, 'faction');
		if (isEnabled('games')) enableModule(this, 'games');
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

function enableModule(client: DugClient, moduleName: ModuleName) {
	const rootData = getRootData();

	client.stores.registerPath(join(rootData.root, `modules/${moduleName}`));
}

declare module '@sapphire/pieces' {
	interface Container {
		db: typeof xprisma;
	}
}
