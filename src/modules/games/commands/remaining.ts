import { DugColors } from '#constants';
import { DugCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { EmbedBuilder } from 'discord.js';

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
		if (players.size === 0) {
			return interaction.reply({
				content: `There are no players in the game`
			});
		}

		const playersList = players.map((player) => `<@${player.id}>`).join(', ');

		return interaction.reply({
			embeds: [new EmbedBuilder().setColor(DugColors.Info).setDescription(`Players: ${playersList}`)]
		});
	}
}
