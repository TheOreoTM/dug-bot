import { Economy } from '#lib/classes/Economy';
import { ShopItems } from '#lib/shop';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Buy an item'
})
export class UserCommand extends Command {
	// public override registerApplicationCommands(registry: Command.Registry) {
	// 	registry.registerChatInputCommand((builder) =>
	// 		builder //
	// 			.setName(this.name)
	// 			.setDescription(this.description)
	// 			.addStringOption((option) =>
	// 				option //
	// 					.setName('item')
	// 					.setDescription('The item you want to buy')
	// 					.setRequired(true)
	// 					.setAutocomplete(true)
	// 			)
	// 	);
	// }

	public override async messageRun(message: Message, args: Args) {
		const value = (await args.rest('string')).toLowerCase();

		const itemObject = ShopItems.get(value);
		if (!itemObject) {
			message.channel.send({
				content: formatFailMessage('That item doesnt exist')
			});

			return;
		}

		const item = new Economy.Item(itemObject);
		const user = await this.container.db.user.getUser(message.author.id);
		if (!item.canBuy(user.cash)) {
			message.channel.send({ content: formatFailMessage("You're too broke to afford this") });
			return;
		}

		await item
			.buy(user.id)
			.then(() => {
				message.channel.send({ content: formatSuccessMessage(`Successfully purchased ${item.name}`) });
			})
			.catch((e) => {
				message.channel.send({ content: formatFailMessage(`Something went wrong...`) });
				console.log(e);
			});
	}
}
