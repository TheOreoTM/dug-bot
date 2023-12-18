import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction, type ApplicationCommandOptionChoiceData } from 'discord.js';
import fuzzysort from 'fuzzysort';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: ApplicationCommandOptionChoiceData[]) {
		return interaction.respond(result);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		if (!['faction-join', 'faction-info', 'faction'].includes(interaction.commandName)) return this.none();
		// Get the focussed (current) option
		const focusedOption = interaction.options.getFocused(true);

		// Ensure that the option name is one that can be autocompleted, or return none if not.
		switch (focusedOption.name) {
			case 'faction': {
				const allFactions = await this.container.db.faction.findMany();
				const factionNames = allFactions.map((faction) => {
					return { name: faction.name, value: `${faction.id}` };
				});

				const factions = fuzzysort.go(focusedOption.value, factionNames, { key: ['name'], limit: 5, all: true });
				return this.some(
					factions.map((f) => {
						return { name: f.obj.name, value: f.obj.value };
					})
				);
			}
			default:
				return this.none();
		}
	}
}
