import { DugColors } from '#constants';
import { PaginatedInventory } from '#lib/classes/PaginatedInventory';
import { InventoryItemType } from '#lib/types/Data';
import { groupItems } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder, type Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Check your inventory',
	aliases: ['inv']
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const invItems: InventoryItemType[] = await this.container.db.user.getInventory(message.author.id);
		const template = new EmbedBuilder().setTitle(`${message.author.username}'s Inventory`).setColor(DugColors.Default);

		if (invItems.length === 0) {
			send(message, {
				embeds: [template.setDescription('Absolutely nothing...')]
			});
			return;
		}
		const groupedItems = groupItems(invItems);

		new PaginatedInventory(groupedItems).setTemplate(template).make().run(message, message.author);
	}
}
