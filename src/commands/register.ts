import { GuildMessage } from '#lib/types/Discord';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';

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

	public override async messageRun(message: GuildMessage) {
		await this.container.db.user
			.register(message.author.id)
			.then((data) => reply(message, formatSuccessMessage(`You have registered as \`User #${data.idx}\``)))
			.catch(() => reply(message, formatFailMessage('Something went wrong')));
	}
}
