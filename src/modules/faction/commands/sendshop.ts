import { DugColors, DugEmojis } from '#constants';
import { FactionItems } from '#lib/items';
import { DugCommand } from '#lib/structures';
import { FactionItemValue } from '#lib/types';
import { ApplyOptions } from '@sapphire/decorators';
import { SelectMenuLimits } from '@sapphire/discord.js-utilities';
import { send } from '@sapphire/plugin-editable-commands';
import {
	APISelectMenuOption,
	ActionRowBuilder,
	EmbedBuilder,
	EmbedField,
	RestOrArray,
	SelectMenuComponentOptionData,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder
} from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'Send the shop'
})
export class UserCommand extends DugCommand {
	// Register Chat Input and Context Menu command
	public override async messageRun(message: DugCommand.Message) {
		console.log('Sending Shop');
		const embed = new EmbedBuilder().setColor(DugColors.Info).setDescription('Use the buttons below to buy items');

		const fields: EmbedField[] = [];
		const items: StringSelectMenuOption = [];

		for (const key in FactionItems) {
			if (Object.prototype.hasOwnProperty.call(FactionItems, key)) {
				const item = FactionItems[key as FactionItemValue];
				fields.push({
					name: `${item.emoji} ${item.name} - ${DugEmojis.Token}${item.price}`,
					value: `${item.description}`,
					inline: true
				});

				items.push({
					value: item.value,
					label: item.name,
					description: item.description.slice(0, SelectMenuLimits.MaximumLengthOfDescriptionOfOption)
				});
			}
		}

		const buyMenu = new StringSelectMenuBuilder()
			.setCustomId('buy-menu')
			.setMaxValues(1)
			.setMinValues(1)
			.setPlaceholder('Select item...')
			.setOptions(items);

		send(message, { embeds: [embed], components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(buyMenu)] });
	}
}

type StringSelectMenuOption = RestOrArray<StringSelectMenuOptionBuilder | SelectMenuComponentOptionData | APISelectMenuOption>;
