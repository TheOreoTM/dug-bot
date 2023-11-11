import { SelectAllOptions } from '#lib/types/Data';
import { formatSuccessMessage, generateFactionEmbed } from '#lib/util/formatter';
import { FactionStatus } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'Create a factions'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((option) =>
					option //
						.setMinLength(2)
						.setMaxLength(32)
						.setName('name')
						.setDescription('The name of the faction')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option //
						.setMinLength(1)
						.setMaxLength(512)
						.setName('description')
						.setDescription('The description of the faction')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option //
						.setName('type')
						.setDescription('Faction join type')
						.setRequired(true)
						.addChoices(
							{ name: 'Open', value: FactionStatus.OPEN },
							{ name: 'Invite Only', value: FactionStatus.INVITE_ONLY },
							{ name: 'Closed', value: FactionStatus.CLOSED }
						)
				)
				.addAttachmentOption((option) =>
					option //
						.setName('icon')
						.setDescription('The icon of the faction')
						.setRequired(true)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const { options } = interaction;
		const owner = (await this.container.db.user.getUser(interaction.user.id))!;
		const name = options.getString('name', true);
		const description = options.getString('description', true);
		const joinType = options.getString('type', true) as FactionStatus;
		const icon = options.getAttachment('icon', true);

		const faction = await this.container.db.faction.create({
			data: {
				ownerId: owner.id,
				description,
				name,
				joinType,
				iconUrl: icon.url,

				members: {
					connect: {
						idx: owner.idx,
						id: owner.id
					}
				}
			},
			select: SelectAllOptions 
		});

		const embed = generateFactionEmbed(faction);

		interaction.reply({ content: formatSuccessMessage('Created Faction'), embeds: [embed] });
	}
}
