import { DugColors } from '#constants';
import { PaginatedShop } from '#lib/classes/PaginatedShop';
import { ShopItems } from '#lib/shop';
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

			new PaginatedFieldMessageEmbed()
				.setTemplate(template)
				.setItems(
					ShopItems.map((item) => {
						return { name: `${item.emoji} ${item.name} - $${item.price}`, value: `${item.description}` };
					})
				)
				.formatItems((item: any) => {
					`${item.name}\n${item.value}`;
				})
				.setTitleField('Shop')
				.setItemsPerPage(1)
				.make()
				.run(interaction, interaction.user);

			await paginatedShop.run(interaction, interaction.user);
			return;
		}
	}
}
