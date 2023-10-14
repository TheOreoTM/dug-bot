import { Crate } from '#lib/classes/CrateManager';
import { formatFailMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const crateName = await args.pick('crate').catch(() => null);
		const amountToOpen = 1;
		if (!crateName) {
			send(message, {
				content: formatFailMessage(`Provide a valid crate name`)
			});

			return;
		}

		const amountOfCratesAvailable = await this.container.db.item.count({
			where: {
				value: crateName,
				ownerId: message.author.id
			}
		});

		if (amountOfCratesAvailable < amountToOpen) {
			send(message, formatFailMessage(`You dont have enough \`${crateName}\` crates`));
			return;
		}

		const crate = new Crate(crateName);
		const loot = crate.open();
		if (!loot) {
			send(message, 'You got nothing lmao');
			return;
		}

		send(message, JSON.stringify(loot, null, 2));
	}
}
