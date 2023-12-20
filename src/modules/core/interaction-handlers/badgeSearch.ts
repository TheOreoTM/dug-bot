import { Badges } from '#lib/items';
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
		// Get the focussed (current) option
		const focusedOption = interaction.options.getFocused(true);

		// Ensure that the option name is one that can be autocompleted, or return none if not.
		switch (focusedOption.name) {
			case 'badge': {
				const badgeNames: { name: string; value: string }[] = [];
				Badges.forEach((badge) => badgeNames.push({ name: badge.name, value: `${badge.id}` }));

				const badges = fuzzysort.go(focusedOption.value, badgeNames, { key: ['name'], limit: 10, all: true });
				return this.some(
					badges.map((f) => {
						return { name: f.obj.name, value: f.obj.value };
					})
				);
			}
			default:
				return this.none();
		}
	}
}
