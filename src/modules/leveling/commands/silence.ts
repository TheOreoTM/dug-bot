import { DugCommand } from '#lib/structures';
import type { InteractionOrMessage } from '#lib/types/Discord';
import { sendInteractionOrMessage } from '#lib/util/messages';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'Stop the bot from sending the level-up message'
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: DugCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}

	// Message command
	public override async messageRun(message: DugCommand.Message) {
		return this.silence(message);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		return this.silence(interaction);
	}

	// Context Menu command
	public override async contextMenuRun(interaction: DugCommand.ContextMenuCommandInteraction) {
		return this.silence(interaction);
	}

	private async silence(interactionOrMessage: InteractionOrMessage) {
		const currentSettings = await this.container.db.userLevel.findUnique({ where: { userId: interactionOrMessage.member.id } });

		const silenced = currentSettings?.silenced ?? false;

		await this.container.db.userLevel.update({ where: { userId: interactionOrMessage.member.id }, data: { silenced: !silenced } });

		sendInteractionOrMessage(interactionOrMessage, {
			content: `You have successfully \`${!silenced ? 'silenced' : 'un-silenced'}\` your level-up message`
		});
	}
}
