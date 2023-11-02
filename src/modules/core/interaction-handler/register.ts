import { formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const data = await this.container.db.user.register(interaction.user.id);

		interaction.reply({ content: formatSuccessMessage(`You have registered as \`User #${data.idx}\``), ephemeral: true });
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== 'register') return this.none();

		return this.some();
	}
}
