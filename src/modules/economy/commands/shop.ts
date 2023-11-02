import { DugColors } from '#constants';
import { PaginatedShop } from '#lib/classes/PaginatedShop';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder, Message } from 'discord.js';

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
			new PaginatedShop({}).setTemplate(template).make().run(interaction, interaction.user);
			return;
		}
	}

	public override async messageRun(message: Message) {
		const user = await this.container.db.user.getUser(message.author.id);
		const template = new EmbedBuilder()
			.setColor(DugColors.Default)
			.setTitle('The Shop')
			.setDescription(`Your balance: ${user.cash.toLocaleString()}`);

		new PaginatedShop({}).setTemplate(template).make().run(message, message.author);
		return;
	}
}
