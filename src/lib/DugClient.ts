import { ClientConfig } from '#config';
import { container, SapphireClient } from '@sapphire/framework';
import { xprisma } from '#lib/util/prisma';
import { getRootData } from '@sapphire/pieces';
import { join } from 'path';

export class DugClient<Ready extends boolean = boolean> extends SapphireClient<Ready> {
	private rootData = getRootData();
	public constructor() {
		super(ClientConfig);

		this.stores.registerPath(join(this.rootData.root, 'modules/leveling'));
	}

	public override async login(token?: string): Promise<string> {
		container.db = xprisma;
		return super.login(token);
	}

	public override destroy(): Promise<void> {
		return super.destroy();
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		db: typeof xprisma;
	}
}
