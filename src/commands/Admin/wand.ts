import { formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { GuildMember } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Magic Magic',
	requiredUserPermissions: ['Administrator']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommandGroup((c) =>
					c
						.setName('add')
						.setDescription('Add an item')
						.addSubcommand((c) =>
							c
								.setName('money')
								.setDescription('Add money')
								.addNumberOption((o) => o.setName('amount').setDescription('Amount to add').setRequired(true))
								.addUserOption((o) => o.setName('member').setRequired(true))
						)
				)
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const subcommandGroup = interaction.options.getSubcommandGroup(true) as 'add';
		const subcommand = interaction.options.getSubcommand(true) as 'money';

		if (subcommandGroup === 'add') {
			if (subcommand === 'money') {
				const member = interaction.options.getMember('member') as GuildMember;
				await this.container.db.user.update({
					where: {
						id: member.id
					},
					data: {
						cash: {
							increment: interaction.options.getNumber('amount', true)
						}
					}
				});

				interaction.reply(formatSuccessMessage('Did whatever you asked me to'));
			}
		}
		return;
	}
}
