import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'Manage your faction'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommand((subcommand) =>
					subcommand //
						.setName('remove-member')
						.setDescription('Remove a member from your faction')
						.addUserOption((option) =>
							option //
								.setName('member')
								.setDescription('The member you want to remove')
								.setRequired(true)
						)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const userData = await this.container.db.user.findUnique({
			where: {
				id: interaction.user.id
			},
			include: {
				faction: true
			}
		});

		if (!userData?.faction || !userData.faction.id) {
			interaction.reply({ content: formatFailMessage('You are not in a faction'), ephemeral: true });
			return;
		}

		const userFaction = userData.faction;
		if (userFaction.ownerId !== interaction.user.id) {
			interaction.reply({ content: formatFailMessage('You are not the owner of this faction'), ephemeral: true });
			return;
		}

		const subcommand = interaction.options.getSubcommand(true);
		if (subcommand === 'remove-member') {
			const member = interaction.options.getUser('member', true);
			if (!member) {
				interaction.reply({ content: formatFailMessage('You need to specify a member'), ephemeral: true });
				return;
			}

			await this.container.db.user
				.update({
					where: {
						id: member.id
					},
					data: {
						faction: {
							disconnect: {
								id: userFaction.id
							}
						}
					}
				})
				.then(() => {
					interaction.reply({ content: formatSuccessMessage(`You have removed ${member.username} from your faction`) });
				})
				.catch(() => {
					interaction.reply({ content: formatFailMessage('Something went wrong') });
				});
		}
	}
}
