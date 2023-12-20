import { Badges } from '#lib/items';
import { DugCommand } from '#lib/structures';
import { Badge } from '#lib/types';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<DugCommand.Options>({
	description: 'Manage users',
	preconditions: ['EventManager']
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
								.setName('cash')
								.setDescription('Add tokens to a user')
								.addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true))
								.addNumberOption((option) =>
									option.setName('amount').setDescription('The amount of tokens to add').setRequired(true).setMinValue(0)
								)
						)
						.addSubcommand((builder) =>
							builder
								.setName('badge')
								.setDescription('Add a badge to a user')
								.addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true))
								.addStringOption((option) =>
									option.setName('badge').setDescription('The badge you want to add').setRequired(true).setAutocomplete(true)
								)
						)
				)

				.addSubcommandGroup((builder) =>
					builder
						.setName('remove')
						.setDescription('remove')
						.addSubcommand((builder) =>
							builder
								.setName('cash')
								.setDescription('Remove tokens from a user')
								.addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true))
								.addNumberOption((option) =>
									option.setName('amount').setDescription('The amount of tokens to remove').setRequired(true).setMinValue(0)
								)
						)
						.addSubcommand((builder) =>
							builder
								.setName('badge')
								.setDescription('Remove a badge from a user')
								.addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true))
								.addStringOption((option) =>
									option.setName('badge').setDescription('The badge you want to remove').setRequired(true).setAutocomplete(true)
								)
						)
				)
				.addSubcommand((builder) =>
					builder
						.setName('register')
						.setDescription('Force register a user')
						.addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true))
				)
		);
	}

	public async chatInputRun(interaction: DugCommand.ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand(true) as 'cash' | 'register' | 'badge';
		const user = interaction.options.getUser('user', true);

		let userData = await this.container.db.user.findUnique({
			where: {
				id: user.id
			}
		});

		if (!userData) {
			userData = await this.container.db.user.register(user.id);
		}

		let message: string = 'Something happened';

		if (subcommand === 'register') {
			const data = await this.container.db.user.register(user.id);

			message = formatSuccessMessage(`Registered \`${user.displayName}\` as \`User #${data.idx}\``);

			interaction.reply(message);
			return;
		}

		const subcommandGroup = interaction.options.getSubcommandGroup(true) as 'remove' | 'add';
		if (subcommand === 'cash') {
			const amount = interaction.options.getNumber('amount', true);
			if (subcommandGroup === 'add') {
				await this.container.db.user.update({
					where: {
						id: user.id
					},
					data: {
						cash: {
							increment: amount
						}
					}
				});

				message = formatSuccessMessage(`Added ${amount} cash to \`${user.displayName}\``);
			}
			if (subcommandGroup === 'remove') {
				await this.container.db.user.update({
					where: {
						id: user.id
					},
					data: {
						cash: {
							decrement: amount
						}
					}
				});

				message = formatSuccessMessage(`Removed ${amount} cash from \`${user.displayName}\``);
			}
		}

		if (subcommand === 'badge') {
			const badge = interaction.options.getString('badge', true);
			const hasBadge = Badges.has(badge as Badge);
			if (!hasBadge) {
				interaction.reply({ content: formatFailMessage('That badge doesnt exist'), ephemeral: true });
				return;
			}
			const badgeValue = Badges.get(badge as Badge)!;
			if (subcommandGroup === 'add') {
				await this.container.db.user.update({
					where: { id: user.id },
					data: {
						badges: {
							push: badgeValue.id
						}
					}
				});

				message = formatSuccessMessage(`Added ${badgeValue.icon} to \`${user.displayName}\``);
			}
			if (subcommandGroup === 'remove') {
				const currentBadges = new Set(userData.badges);
				currentBadges.delete(badgeValue.id);
				await this.container.db.user.update({
					where: { id: user.id },
					data: {
						badges: {
							set: Array.from(currentBadges)
						}
					}
				});

				message = formatSuccessMessage(`Removed ${badgeValue.icon} from \`${user.displayName}\``);
			}
		}

		interaction.reply(message);
	}
}
