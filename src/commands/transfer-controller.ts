import { DugCommand } from '#lib/structures';
import type { InteractionOrMessage } from '#lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { ApplicationCommandType, Message } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Transfer controller to a different user',
	requiredUserPermissions: ['Administrator']
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: DugCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('The user to transfer controller to').setRequired(true))
		);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const newController = interaction.options.getUser('user', true);

		const says = this.container.says;

		const controller = says.getController();

		if (!controller) {
			return interaction.reply({
				content: `There is no controller`
			});
		}

		if (controller.id === newController.id) {
			return interaction.reply({
				content: `This user is already the controller`
			});
		}

		if (!says.getPlayers().has(newController.id)) {
			return interaction.reply({
				content: `This user is not in the game`
			});
		}

		says.setController(newController);

		const channel = says.getChannel();

		if (!channel) {
			return interaction.reply({
				content: `There is no channel`
			});
		}

		await channel.send(
			`## New controller\nThe controller has been transferred to ${newController}. Make sure to listen to their commands and follow them.`
		);

		return interaction.reply({
			content: `${newController} is now the controller`
		});
	}
}
