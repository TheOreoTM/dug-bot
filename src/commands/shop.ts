import { DugColors } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Command } from '@sapphire/framework';
import { ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js';

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

		if (subcommand === 'view') {
			const paginatedShop = new PaginatedMessage({
				template: new EmbedBuilder()
					.setColor(DugColors.Default)
					.setTitle('The Shop')
					.setDescription(`Your balance: ${user.cash.toLocaleString()}`),
				actions: [
					{
						customId: '@sapphire/paginated-messages.firstPage',
						style: ButtonStyle.Secondary,
						emoji: '🔙',
						type: ComponentType.Button,
						run: ({ handler }) => {
							handler.index = 0;
						}
					},
					{
						customId: '@sapphire/paginated-messages.firstPage',
						style: ButtonStyle.Secondary,
						emoji: '🔛',
						type: ComponentType.Button,
						run: ({ handler, interaction }) => {
							console.log(handler, interaction);
							handler.index = 1;
						}
					}
				]
			});
			paginatedShop
				.addPageEmbed((embed) =>
					embed //
						.addFields({ name: 'Item1', value: '111' })
				)
				.addPageEmbed((embed) =>
					embed //
						.addFields({ name: 'Item2', value: '222' })
				)
				.addPageEmbed((embed) =>
					embed //
						.addFields({ name: 'Item3', value: 'kkk' })
				)
				.setActions([
					{
						customId: '@sapphire/paginated-messages.firstPage',
						style: ButtonStyle.Secondary,
						emoji: Emojis.Backward,
						type: ComponentType.Button,
						run: ({ handler, interaction }) => {
							handler.index = 0;
							this.updateComponents(handler, interaction);
						}
					},
					{
						customId: '@sapphire/paginated-messages.previousPage',
						style: ButtonStyle.Secondary,
						emoji: Emojis.Left,
						type: ComponentType.Button,
						run: ({ handler, interaction }) => {
							if (handler.index === 0) {
								handler.index = handler.pages.length - 1;
							} else {
								--handler.index;
							}
							paginatedShop.updateComponents(handler, interaction);
						}
					},
					{
						customId: '@sapphire/paginated-messages.stop',
						style: ButtonStyle.Secondary,
						emoji: '⏹️',
						type: ComponentType.Button,
						run: ({ collector }) => collector.stop()
					},
					{
						customId: '@sapphire/paginated-messages.nextPage',
						style: ButtonStyle.Secondary,
						emoji: Emojis.Right,
						type: ComponentType.Button,
						run: ({ handler, interaction }) => {
							if (handler.index === handler.pages.length - 1) {
								handler.index = 0;
							} else {
								++handler.index;
							}
							this.updateComponents(handler, interaction);
						}
					},
					{
						customId: '@sapphire/paginated-messages.goToLastPage',
						style: ButtonStyle.Secondary,
						emoji: Emojis.Forward,
						type: ComponentType.Button,
						run: ({ handler, interaction }) => {
							handler.index = handler.pages.length - 1;
							this.updateComponents(handler, interaction);
						}
					}
				]);

			await paginatedShop.run(interaction, interaction.user);
			return;
		}
	}
}
