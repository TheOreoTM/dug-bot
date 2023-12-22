import { DugColors } from '#constants';
import { CIPHER_HINTS, CipherLevel } from '#lib/data';
import { FactionItems } from '#lib/items';
import { FactionItemValue, HintItemValue } from '#lib/types';
import { formatFailMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { codeBlock } from '@sapphire/utilities';
import {
	APISelectMenuOption,
	ActionRowBuilder,
	ComponentType,
	EmbedBuilder,
	RestOrArray,
	SelectMenuComponentOptionData,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	StringSelectMenuOptionBuilder
} from 'discord.js';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class MenuHandler extends InteractionHandler {
	public override async run(interaction: StringSelectMenuInteraction) {
		const value = interaction.values[0] as FactionItemValue;
		const item = FactionItems[value];
		const itemValue = item.value as FactionItemValue;
		const faction = await this.container.db.user.getUserFaction(interaction.user.id);
		const factionBalance = faction?.tokens ?? 0;
		const canBuy = factionBalance >= item.price;

		if (!faction) {
			return this.sendError(interaction, 'You are not in a faction');
		}

		if (!canBuy) {
			return this.sendError(interaction, 'Your faction cant afford this');
		}

		// Start checking items
		let itemBought: (typeof FactionItems)[FactionItemValue] | undefined;
		if (itemValue.endsWith('Hint')) {
			const hintType = item.value as HintItemValue;
			const hintLevel: CipherLevel | null = await this.promptHintLevel(interaction);
			if (!hintLevel) return;

			let hint: string = '';
			switch (hintType) {
				case 'majorHint':
					hint = CIPHER_HINTS[hintLevel].MAJOR;

					break;
				case 'mediumHint':
					hint = CIPHER_HINTS[hintLevel].MEDIUM;
					break;
				case 'minorHint':
					hint = CIPHER_HINTS[hintLevel].MINOR;
					break;
				default:
					hint = 'No hint available for this. Get scammed idiot. Go ask an admin to refund you ig.';
					break;
			}

			itemBought = FactionItems[hintType];
			if (itemBought) {
				await interaction.followUp({
					ephemeral: true,
					embeds: [
						new EmbedBuilder()
							.setTitle(`Hint for cipher #${hintLevel.split('-')[1]}`)
							.setColor(DugColors.Success)
							.setDescription(`${codeBlock(hint)}`)
					]
				});
			}
		}

		if (itemBought) {
			await this.container.db.faction.update({
				where: {
					id: faction.id
				},
				data: {
					tokens: {
						decrement: itemBought.price
					}
				}
			});
		}
	}

	private async promptHintLevel(interaction: StringSelectMenuInteraction) {
		const embed = new EmbedBuilder()
			.setColor(DugColors.Default)
			.setTitle('Cipher Level Selection')
			.setDescription('Select the cipher you want the hint for');

		const unlockedCiphers = await this.container.cipher.getUnlockedSet();
		const availableCiphers: StringSelectMenuOption = [];

		for (const cipher of unlockedCiphers) {
			const level = `CIPHER_${cipher}` as CipherLevel;

			availableCiphers.push({
				label: `Cipher ${cipher}`,
				value: level,
				description: CIPHER_HINTS[level].DESCRIPTION
			});
		}

		const cipherSelect = new StringSelectMenuBuilder()
			.setCustomId('cipher-select')
			.setMaxValues(1)
			.setMinValues(1)
			.setPlaceholder('Select a cipher...')
			.setOptions(availableCiphers);

		const message = await interaction.reply({
			ephemeral: true,
			embeds: [embed],
			components: [new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(cipherSelect)]
			// fetchReply: true
		});

		try {
			const response = await message.awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 60000 });
			await message.edit({ components: [] });
			return response.values[0] as CipherLevel;
		} catch {
			await message.edit({ embeds: [], content: 'Something went wrong', components: [] });

			return null;
		}
	}

	private sendError(interacton: StringSelectMenuInteraction, message: string) {
		interacton.reply({ content: formatFailMessage(message), ephemeral: true });
	}

	public override parse(interaction: StringSelectMenuInteraction) {
		if (interaction.customId !== 'buy-menu') return this.none();

		return this.some();
	}
}
type StringSelectMenuOption = RestOrArray<StringSelectMenuOptionBuilder | SelectMenuComponentOptionData | APISelectMenuOption>;
