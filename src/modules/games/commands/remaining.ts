import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'View the remaining users in the game'
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: DugCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const players = this.container.says.getPlayers();

		await interaction.deferReply({ ephemeral: true });

		if (players.size === 0) {
			return interaction.editReply({
				content: `There are no players in the game`
			});
		}

		const playersList = players.map((player) => `<@${player.id}>`).join(', ');

		return interaction.editReply({
			content: `Players: ${playersList}`
		});
	}
}
