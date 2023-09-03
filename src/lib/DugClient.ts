import { ClientConfig } from '#config';
import { container, SapphireClient } from '@sapphire/framework';
import { xprisma } from './util/prisma';

export class NexusClient<Ready extends boolean = boolean> extends SapphireClient<Ready> {
	public constructor() {
		super(ClientConfig);
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
