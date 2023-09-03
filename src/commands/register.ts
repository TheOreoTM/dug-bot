import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'Register to run commands'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		await this.container.db.user
			.register(interaction.user.id)
			.then((data) => interaction.reply(formatSuccessMessage(`You have registered as \`User #${data.idx}\``)))
			.catch(() => interaction.reply(formatFailMessage('Something went wrong')));
	}
}
