import { DugColors } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
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

		if (subcommand === 'view') {
			const paginatedShop = new PaginatedMessage({
				template: new EmbedBuilder()
					.setColor(DugColors.Default)
					.setTitle('The Shop')
					.setDescription(`Your balance: ${user.cash.toLocaleString()}`)
			});
			paginatedShop
				.addPageEmbed((embed) =>
					embed //
						.setDescription('This is the first page')
						.setTitle('Page 1')
				)
				.addPageBuilder((builder) =>
					builder //
						.setContent('This is the second page')
						.setEmbeds([new EmbedBuilder().setTimestamp()])
				);

			await paginatedShop.run(interaction, interaction.user);
			return;
		}
	}
}
