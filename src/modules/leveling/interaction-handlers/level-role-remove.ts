import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: ApplicationCommandOptionChoiceData[]) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		console.log(interaction.commandName);
		if (interaction.commandName !== 'level-role') return this.none();
		const focusedOption = interaction.options.getFocused(true);
		switch (focusedOption.name) {
			case 'level': {
				console.log(focusedOption.value);
				const searchResult = await this.container.db.levelRole.findMany({
					where: {
						level: Number(focusedOption.value)
					}
				});
				// Map the search results to the structure required for Autocomplete
				return this.some(searchResult.map((match) => ({ name: `Level Role ${match.level}`, value: match.roleId })));
			}
			default:
				return this.none();
		}
	}
}
