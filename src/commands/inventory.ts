import { DugColors } from '#constants';
import { PaginatedInventory } from '#lib/classes/PaginatedInventory';
import { InventoryItemType } from '#lib/types/Data';
import { GuildMessage } from '#lib/types/Discord';
import { groupItems } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Check your inventory',
	aliases: ['inv']
})
export class UserCommand extends Command {
	public override async messageRun(message: GuildMessage, args: Args) {
		const target = await args.pick('member').catch(() => message.member);
		const invItems: InventoryItemType[] = await this.container.db.user.getInventory(target.id);
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
