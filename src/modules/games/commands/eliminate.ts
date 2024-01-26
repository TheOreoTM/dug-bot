import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { userMention } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Eliminate a user'
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: DugCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) => option.setName('user').setDescription('The user to eliminate').setRequired(true))
		);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user', true);

		await interaction.deferReply({ ephemeral: true });

		const says = this.container.says;

		const controller = says.getController();

		if (!controller) {
			return interaction.editReply({
				content: `You are not the controller`
			});
		}

		if (controller.id !== interaction.user.id) {
			return interaction.editReply({
				content: `You are not the controller`
			});
		}

		if (!says.getPlayers().has(user.id)) {
			return interaction.editReply({
				content: `This user is not in the game`
			});
		}

		says.eliminatePlayer(user.id);

		return interaction.editReply({
			content: `${userMention(user.id)} has been eliminated`
		});
	}
}
