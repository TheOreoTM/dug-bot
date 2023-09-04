import { formatFailMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'Join a faction'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option //
						.setAutocomplete(true)
						.setRequired(true)
						.setName('faction')
						.setDescription('The faction you want to join')
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const factionId = interaction.options.getString('faction', true);
		const faction = this.container.db.faction.findUnique({
			where: {
				id: Number(factionId)
			}
		});

		if (!faction) {
			interaction.reply({ content: formatFailMessage('That faction doesnt exist'), ephemeral: true });
			return;
		}

		interaction.reply({ content: `\`\`\`json\n${JSON.stringify(faction, null, 2)}\`\`\`` });
	}
}
