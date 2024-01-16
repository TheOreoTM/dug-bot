import { DugColors } from '#constants';
import { sendTemporaryMessage } from '#lib/util/messages';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type MessageCommandErrorPayload, UserError, ArgumentError } from '@sapphire/framework';
import { SubcommandPluginEvents } from '@sapphire/plugin-subcommands';
import { EmbedBuilder, Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: SubcommandPluginEvents.MessageSubcommandDenied
})
export class UserListener extends Listener {
	public override async run(error: Error, { message, context }: MessageCommandErrorPayload) {
		this.container.logger.error(`[SUBCOMMAND DENIED]: ${error}`);
		if (Reflect.get(Object(context), 'silent')) return;

		if (error instanceof ArgumentError) return this.argumentError(message, error);
		if (error instanceof UserError) return this.userError(message, error);
		return;
	}

	private userError(message: Message, error: UserError) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(error.context), 'silent')) return;

		const identifier = error.identifier;
		return sendTemporaryMessage(message, {
			embeds: [
				new EmbedBuilder()
					.setColor(DugColors.Fail)
					.setDescription(error.message)
					.setTitle(identifier ?? 'Error')
			]
		});
	}

	private argumentError(message: Message, error: ArgumentError<unknown>) {
		const argument = error.argument.name;
		const identifier = error.identifier;
		const msg = error.message;
		const parameter = error.parameter.replaceAll('`', '῾');
		return sendTemporaryMessage(message, {
			embeds: [
				new EmbedBuilder()
					.setColor(DugColors.Fail)
					.setDescription(msg)
					.setTitle(identifier ?? 'Error')
					.setFooter({ text: `Provided Parameter: ${parameter}, Expected Parameter Type: ${argument}` })
			]
		});
	}
}
