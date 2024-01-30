import { ModuleName } from '#config';
import { BlacklistService, CipherService, CoreSettingsService, FactionService, LeaderboardService, LevelingService } from '#lib/services';
import { PetService } from '#lib/services/PetService';
import { SimonSaysService } from '#lib/services/SimonSaysService';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';

const dev = process.env.NODE_ENV !== 'production';

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public override run() {
		this.container.core = new CoreSettingsService();
		this.container.leaderboard = new LeaderboardService();
		this.container.blacklist = new BlacklistService();
		this.container.leveling = new LevelingService();
		this.container.faction = new FactionService();
		this.container.cipher = new CipherService();
		this.container.pet = new PetService();
		this.container.says = new SimonSaysService();

		this.printBanner();
		this.printStoreDebugInformation();
	}

	private printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const modules = [...client.loadedModules.values()];
		const lastModule = modules.pop()!;

		for (const store of stores) logger.info(this.styleStore(store));
		logger.info(gray(`└─ Loaded ${this.style(client.loadedModules.length.toString().padEnd(3, ' '))} modules.`));
		for (const module of modules) logger.info(this.styleModule(module, false));
		logger.info(this.styleModule(lastModule, true));
	}

	private styleModule(module: ModuleName, last: boolean) {
		return gray(' '.repeat(10) + `${last ? '└─' : '├─'} Loaded ${this.style(`module ${module}.`)}`);
	}

	private styleStore(store: Store<any>) {
		return gray(`├─ Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}
