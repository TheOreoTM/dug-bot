import { DugCommand } from '#lib/structures';
import { SelectAllOptions } from '#lib/types';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'Manage factions',
	preconditions: ['EventManager'],
	requiredUserPermissions: ['Administrator']
})
export class UserCommand extends DugCommand {
	public registerApplicationCommands(registry: DugCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommandGroup((builder) =>
					builder
						.setName('add')
						.setDescription('Add')
						.addSubcommand((builder) =>
							builder
								.setName('token')
								.setDescription('Add tokens to a faction')
								.addStringOption((option) =>
									option.setName('faction').setDescription('The faction').setAutocomplete(true).setRequired(true)
								)
								.addNumberOption((option) =>
									option.setName('amount').setDescription('The amount of tokens to add').setRequired(true).setMinValue(0)
								)
						)
						.addSubcommand((builder) =>
							builder
								.setName('member')
								.setDescription('Add a member to a faction')
								.addStringOption((option) =>
									option.setName('faction').setDescription('The faction').setAutocomplete(true).setRequired(true)
								)
								.addUserOption((option) => option.setName('member').setDescription('The member you want to add').setRequired(true))
						)
				)

				.addSubcommandGroup((builder) =>
					builder
						.setName('remove')
						.setDescription('remove')
						.addSubcommand((builder) =>
							builder
								.setName('token')
								.setDescription('Remove tokens from a faction')
								.addStringOption((option) =>
									option.setName('faction').setDescription('The faction').setAutocomplete(true).setRequired(true)
								)
								.addNumberOption((option) =>
									option.setName('amount').setDescription('The amount of tokens to remove').setRequired(true).setMinValue(0)
								)
						)
						.addSubcommand((builder) =>
							builder
								.setName('member')
								.setDescription('Remove a member from a faction')
								.addStringOption((option) =>
									option.setName('faction').setDescription('The faction').setAutocomplete(true).setRequired(true)
								)
								.addUserOption((option) => option.setName('member').setDescription('The member you want to remove').setRequired(true))
						)
				)
				.addSubcommand((builder) =>
					builder
						.setName('delete')
						.setDescription('Delete a faction')
						.addStringOption((option) => option.setName('faction').setDescription('The faction').setAutocomplete(true).setRequired(true))
				)
		);
	}

	public async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand(true) as 'token' | 'member' | 'delete';
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

		let message: string = 'Something happened';

		if (subcommand === 'delete') {
			await this.container.db.faction.delete({
				where: {
					id: faction.id
				}
			});

			message = formatSuccessMessage(`Deleted faction ${faction.name}`);

			interaction.reply(message);
			return;
		}

		const subcommandGroup = interaction.options.getSubcommandGroup(true) as 'remove' | 'add';
		if (subcommand === 'token') {
			const amount = interaction.options.getNumber('amount', true);
			if (subcommandGroup === 'add') {
				await this.container.db.faction.update({
					where: {
						id: faction.id
					},
					data: {
						tokens: {
							increment: amount
						}
					}
				});

				message = formatSuccessMessage(`Added ${amount} tokens to \`${faction.name}\``);
			}
			if (subcommandGroup === 'remove') {
				await this.container.db.faction.update({
					where: {
						id: faction.id
					},
					data: {
						tokens: {
							decrement: amount
						}
					}
				});

				message = formatSuccessMessage(`Removed ${amount} tokens from \`${faction.name}\``);
			}
		}

		if (subcommand === 'member') {
			const member = interaction.options.getUser('member', true);
			if (subcommandGroup === 'add') {
				await this.container.db.user.update({
					where: { id: member.id },
					data: {
						faction: {
							connect: {
								id: faction.id
							}
						}
					}
				});

				message = formatSuccessMessage(`Added ${member} to \`${faction.name}\``);
			}
			if (subcommandGroup === 'remove') {
				await this.container.db.user.update({
					where: { id: member.id },
					data: {
						faction: undefined
					}
				});

				message = formatSuccessMessage(`Removed ${member} from \`${faction.name}\``);
			}
		}

		interaction.reply(message);
	}
}
