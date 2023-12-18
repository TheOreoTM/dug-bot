import { DugColors } from '#constants';
import { SelectAllOptions } from '#lib/types/Data';
import { minutes } from '#lib/util/common';
import { formatFailMessage, generateFactionEmbed } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, userMention } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'View info about a faction'
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
						.setName('faction')
						.setDescription('The name of the faction')
						.setRequired(true)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const factionId = Number(interaction.options.getString('faction', true));
		if (isNaN(factionId)) {
			interaction.reply({ content: formatFailMessage('That faction doesnt exist'), ephemeral: true });
			return;
		}

		const faction = await this.container.db.faction.findUnique({
			where: {
				id: Number(factionId)
			},
			select: SelectAllOptions
		});

		if (!faction) {
			interaction.reply({ content: formatFailMessage('That faction doesnt exist'), ephemeral: true });
			return;
		}

		const embed = generateFactionEmbed(faction);
		const showMembersButton = new ButtonBuilder().setCustomId('show-members').setLabel('Show Member List').setStyle(ButtonStyle.Secondary);

		const factionInfoMessage = await interaction.reply({
			embeds: [embed],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(showMembersButton)]
		});

		const collector = factionInfoMessage.createMessageComponentCollector({ time: minutes(1), componentType: ComponentType.Button });

		collector.on('collect', async (i) => {
			if (i.user.id !== interaction.user.id) {
				await i.reply({
					content: `This button is not for you!`,
					ephemeral: true
				});
				return;
			}
			// Code here
			const members = faction.members.reverse();
			members.pop(); // owner
			const membersListArray = [];
			membersListArray.push(`${userMention(faction.ownerId)} - Owner`);
			for (const member of members) {
				const formattedMember = `${userMention(member.id)} - ${member.factionPosition ?? 'Member'}`;
				membersListArray.push(formattedMember);
			}

			const embed = new EmbedBuilder()
				.setColor(DugColors.Default)
				.setTitle(`${faction.name}'s Member list`)
				.setDescription(membersListArray.join('\n'));

			await factionInfoMessage.edit({
				embeds: [embed],
				components: []
			});
		});
	}
}
