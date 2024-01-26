import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { userMention, type ButtonInteraction } from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Button
})
export class ButtonHandler extends InteractionHandler {
	public async run(interaction: ButtonInteraction) {
		const user = interaction.user;

		const saysService = this.container.says;

		if (saysService.getPlayers().has(user.id)) {
			return interaction.reply({
				content: `${userMention(user.id)} You are already in the game`,
				ephemeral: true
			});
		}

		saysService.addPlayer(user);

		return interaction.reply({
			content: `${userMention(user.id)} You have joined the game`,
			ephemeral: true
		});
	}

	public override parse(interaction: ButtonInteraction) {
		if (interaction.customId !== '@says/join') return this.none();

		return this.some();
	}
}
