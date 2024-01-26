import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'Force eliminate a user',
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
				.addUserOption((option) => option.setName('user').setDescription('The user to force eliminate').setRequired(true))
		);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user', true);

		const says = this.container.says;

		const players = says.getPlayers();

		if (!players.has(user.id)) {
			return interaction.reply({
				content: `This user is not in the game`,
				ephemeral: true
			});
		}

		says.eliminatePlayer(user.id, true);

		return interaction.reply({
			content: `${user} has been force eliminated`,
			ephemeral: true
		});
	}
}
