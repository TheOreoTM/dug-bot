import { DugColors } from '#constants';
import { PaginatedShop } from '#lib/classes/PaginatedShop';
import { ShopItems } from '#lib/shop';
import { ShopItemType } from '#lib/types/Data';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedFieldMessageEmbed } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'The Shop'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommand((command) =>
					command //
						.setName('view')
						.setDescription('View the items in the shop')
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand() as 'view';
		const user = (await this.container.db.user.getUser(interaction.user.id))!;
		const template = new EmbedBuilder()
			.setColor(DugColors.Default)
			.setTitle('The Shop')
			.setDescription(`Your balance: ${user.cash.toLocaleString()}`);

		if (subcommand === 'view') {
			const paginatedShop = new PaginatedShop({
				template: template
			});

			const r = new PaginatedFieldMessageEmbed<ShopItemType>().setItems(Array.from(ShopItems.values()));
			r.setTemplate(template).formatItems((item: ShopItemType) => `${item.emoji} ${item.name} - $${item.price} \n${item.description}`);

			r.make();
			r.run(interaction, interaction.user);

			await paginatedShop.run(interaction, interaction.user);
			return;
		}
	}
}
