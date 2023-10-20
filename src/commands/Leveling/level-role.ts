import { DugColors } from '#constants';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { LevelRole } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder, roleMention } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Update the level roles of the server',
	requiredUserPermissions: ['Administrator']
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommand((cmd) =>
					cmd
						.setName('add')
						.setDescription('Add a level role')
						.addRoleOption((o) => o.setName('role').setDescription('The role you want to assign at the level').setRequired(true))
						.addNumberOption((o) =>
							o.setName('level').setDescription('The level at which the role is given').setRequired(true).setMinValue(1)
						)
				)
				.addSubcommand((cmd) =>
					cmd
						.setName('remove')
						.setDescription('Remove a level role')
						.addStringOption((o) =>
							o
								.setName('level')
								.setDescription('The level of the level role you want to remove')
								.setRequired(true)
								.setAutocomplete(true)
						)
				)
				.addSubcommand((cmd) => cmd.setName('list').setDescription('List all the level roles'))
		);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand(true) as 'add' | 'remove' | 'list';

		if (subcommand === 'add') {
			const level = interaction.options.getNumber('level', true);
			const role = interaction.options.getRole('role', true);
			if (role.id === interaction.guildId) {
				interaction.reply(formatFailMessage(`You can't set the \`@everyone\` as a level role `));
				return;
			}

			await this.container.db.levelRole.upsert({
				where: {
					level
				},
				create: {
					level,
					roleId: role.id
				},
				update: {
					level,
					roleId: role.id
				}
			});

			interaction.reply(formatSuccessMessage(`Set new level role for \`level ${level}\` as \`${role.name}\``));
			return;
		}

		if (subcommand === 'remove') {
			const levelString = interaction.options.getString('level', true);

			const level = parseInt(levelString);

			await this.container.db.levelRole.deleteMany({
				where: {
					level
				}
			});

			interaction.reply(formatSuccessMessage(`Deleted level role for ${level}`));
			return;
		}

		if (subcommand === 'list') {
			const embed = new EmbedBuilder().setColor(DugColors.Default).setTitle('Level Roles').setDescription(`No level roles setup yet`);
			const emojis = {
				sequence: '<:branch_90_curved:1161486023814025266>',
				last: '<:branch_tail_curved:1161479147839828018>'
			};
			const levelRoles = await this.container.db.levelRole.findMany({ orderBy: { level: 'asc' } });
			if (levelRoles.length === 0) return interaction.reply({ embeds: [embed] });
			if (levelRoles.length === 1) {
				embed.setDescription(`${emojis.last} ${roleMention(levelRoles[0].roleId)} - \`Level ${levelRoles[0].level}\``);
				return interaction.reply({ embeds: [embed] });
			}
			const lastLevelRole = levelRoles.pop() as LevelRole;
			const levelRoleTable: string[] = [];
			levelRoles.forEach((levelRole) => {
				levelRoleTable.push(`${emojis.sequence} ${roleMention(levelRole.roleId)} - \`Level ${levelRole.level}\``);
			});
			levelRoleTable.push(`${emojis.last} ${roleMention(lastLevelRole.roleId)} - \`Level ${lastLevelRole.level}\``);

			embed.setDescription(levelRoleTable.join('\n'));
			interaction.reply({ embeds: [embed] });
			return;
		}

		return undefined;
	}
}
