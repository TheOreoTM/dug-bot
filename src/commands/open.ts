import { DugColors } from '#constants';
import { Crate } from '#lib/classes/CrateManager';
import { AllItems } from '#lib/items';
import { formatFailMessage } from '#lib/util/formatter';
import { rarityToValue } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder, type Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const crateName = await args.pick('crate').catch(() => null);
		// const amountToOpen = 1;
		if (!crateName) {
			send(message, {
				content: formatFailMessage(`Provide a valid crate name`)
			});

			return;
		}

		const crateData = await this.container.db.item.findFirst({
			where: {
				value: rarityToValue(crateName),
				ownerId: message.author.id
			}
		});

		if (!crateData) {
			send(message, formatFailMessage(`You dont have enough \`${crateName}\` crates`));
			return;
		}

		const crate = new Crate(crateName);
		const loot = crate.open();

		const description: string[] = [];
		loot.forEach((item) => {
			if (!item.id) return;
			const itemData = AllItems.get(item.id);
			if (!itemData) return;
			description.push(`${itemData.emoji} **${itemData.name}** x \`${item.quantity}\``);
		});

		const embed = new EmbedBuilder().setTitle(`Crate Opening Results`).setColor(DugColors.Halloween).setDescription(description.join('\n'));

		send(message, { embeds: [embed] });
	}
}
