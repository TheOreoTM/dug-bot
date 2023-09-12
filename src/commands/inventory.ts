import { InventoryItemType } from '#lib/types/Data';
import { formatItems } from '#lib/util/formatter';
import { groupItems } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Check your inventory'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const invItems: InventoryItemType[] = await this.container.db.user.getInventory(message.author.id);
		const groupedItems = groupItems(invItems);

		const formattedItems = formatItems(groupedItems);

		message.channel.send(`${JSON.stringify(formattedItems, null, 2)}`);
	}
}
