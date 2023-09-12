import { DugColors } from '#constants';
import { PaginatedShop } from '#lib/classes/PaginatedShop';
import { ShopItems } from '#lib/shop';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessageEmbedFields } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { EmbedBuilder, EmbedField } from 'discord.js';
import { it } from 'node:test';

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

			const items: EmbedField[] = [];

			ShopItems.forEach((item) => {
				items.push({
					name: `${item.emoji} ${item.name} - $${item.price}`,
					value: `${item.description}`,
					inline: false
				});
			});

			await new PaginatedMessageEmbedFields().setItems(items).setItemsPerPage(1).make().run(interaction, interaction.user);

			await paginatedShop.run(interaction, interaction.user);
			return;
		}
	}
}
