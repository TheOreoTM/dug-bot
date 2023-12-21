import { seconds } from '#lib/util/common';
import { formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { sleep } from '@sapphire/utilities';
import type { ButtonInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	private cooldown = new Set();

	public async run(interaction: ButtonInteraction<'cached'>) {
		const cooldown = this.cooldown.has(interaction.member.id);
		if (cooldown) {
			interaction.reply({
				content: formatSuccessMessage(`Calm down buddy`),
				ephemeral: true
			});

			return;
		}
		this.cooldown.add(interaction.member.id);
		this.container.faction.list.refreshList();
		interaction.reply({
			content: formatSuccessMessage(`Refreshed list`),
			ephemeral: true
		});
		await sleep(seconds(10));
		this.cooldown.delete(interaction.member.id);
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'rfl') return this.none();

		return this.some();
	}
}
