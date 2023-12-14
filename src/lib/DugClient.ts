import { ClientConfig, ModuleName, config } from '#config';
import { container, SapphireClient } from '@sapphire/framework';
import { xprisma } from '#lib/util/prisma';
import { getRootData } from '@sapphire/pieces';
import { join } from 'path';

export class DugClient<Ready extends boolean = boolean> extends SapphireClient<Ready> {
	public constructor() {
		super(ClientConfig);

		for (const module of config.enabled_modules) {
			enableModule(this, module);
		}
	}

	public override async login(token?: string): Promise<string> {
		container.db = xprisma;
		return super.login(token);
	}

	public override destroy(): Promise<void> {
		return super.destroy();
	}
}

// function isEnabled(moduleName: ModuleName) {
// 	return config.enabled_modules.includes(moduleName);
// }

function enableModule(client: DugClient, moduleName: ModuleName) {
	const rootData = getRootData();

	client.stores.registerPath(join(rootData.root, `modules/${moduleName}`));
}
