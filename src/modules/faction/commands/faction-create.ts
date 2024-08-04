import { DugCommand } from '#lib/structures';
import { SelectAllOptions } from '#lib/types/Data';
import { formatSuccessMessage, generateFactionEmbed } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'Create a faction',
	preconditions: ['EventManager']
})
export class UserCommand extends DugCommand {
	public override registerApplicationCommands(registry: DugCommand.Registry) {
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
				.addUserOption((option) => option.setName('owner').setDescription('The owner of the faction').setRequired(true))

				// .addStringOption((option) =>
				// 	option //
				// 		.setName('type')
				// 		.setDescription('Faction join type')
				// 		.setRequired(true)
				// 		.addChoices(
				// 			{ name: 'Open', value: FactionStatus.OPEN },
				// 			{ name: 'Invite Only', value: FactionStatus.INVITE_ONLY },
				// 			{ name: 'Closed', value: FactionStatus.CLOSED }
				// 		)
				// )
				.addAttachmentOption((option) =>
					option //
						.setName('icon')
						.setDescription('The icon of the faction')
						.setRequired(true)
				)
		);
	}

	public override async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const { options } = interaction;
		const owner = options.getUser('owner', true);
		const name = options.getString('name', true);
		const description = options.getString('description', true);
		// const joinType = options.getString('type', true) as FactionStatus;
		const icon = options.getAttachment('icon', true);

		const faction = await this.container.db.faction.create({
			data: {
				ownerId: owner.id,
				description,
				name,
				iconUrl: icon.url,

				members: {
					connect: {
						id: owner.id
					}
				}
			},
			select: SelectAllOptions
		});

		await this.container.db.user.update({
			where: {
				id: interaction.member.id
			},
			data: {
				factionPosition: 'OWNER'
			}
		});

		const embed = generateFactionEmbed(faction);

		interaction.reply({ content: formatSuccessMessage('Created Faction'), embeds: [embed] });
	}
}
