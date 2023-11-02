import type { GuildMessage } from '#lib/types/Discord';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { getLevelInfo, getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { GuildMember } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'XP Command'
})
export class UserCommand extends Command {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommandGroup((group) =>
					group
						.setName('set')
						.setDescription('Set')
						.addSubcommand((cmd) =>
							cmd
								.setName('level')
								.setDescription("Change the user's level")
								.addUserOption((o) => o.setName('member').setDescription('Target member').setRequired(true))
								.addNumberOption((o) => o.setName('level').setDescription('The new level').setRequired(true).setMinValue(0))
						)

						.addSubcommand((cmd) =>
							cmd
								.setName('xp')
								.setDescription("Change the user's xp")
								.addUserOption((o) => o.setName('member').setDescription('Target member').setRequired(true))
								.addNumberOption((o) => o.setName('xp').setDescription('The new xp').setRequired(true).setMinValue(0))
						)
				)
				.addSubcommand((cmd) =>
					cmd
						.setName('add')
						.setDescription('Add xp to the user')
						.addUserOption((o) => o.setName('member').setDescription('Target member').setRequired(true))
						.addNumberOption((o) => o.setName('xp').setDescription('Amount of xp to add').setRequired(true).setMinValue(0))
				)

				.addSubcommand((cmd) =>
					cmd
						.setName('remove')
						.setDescription('Remove xp to the user')
						.addUserOption((o) => o.setName('member').setDescription('Target member').setRequired(true))
						.addNumberOption((o) => o.setName('xp').setDescription('Amount of xp to remove').setRequired(true).setMinValue(0))
				)
		);
	}

	// Message command
	public override async messageRun(message: GuildMessage) {
		return send(message, `Coming soon`);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const subcommandGroup = interaction.options.getSubcommandGroup() as 'set' | null;
		const subcommand = interaction.options.getSubcommand(true) as 'level' | 'xp' | 'add' | 'remove';
		const targetMember = interaction.options.getMember('member');
		if (!targetMember || !(targetMember instanceof GuildMember)) {
			interaction.reply({ content: formatFailMessage('Please provide a valid target member'), ephemeral: true });
			return;
		}

		if (subcommandGroup === 'set') {
			if (subcommand === 'level') {
				const levelToSet = interaction.options.getNumber('level', true);
				const levelData = getLevelInfo(levelToSet);

				await this.container.db.userLevel.upsert({
					where: {
						userId: targetMember.id
					},
					create: {
						userId: targetMember.id,
						currentLevel: levelToSet,
						currentXp: 0,
						totalXp: levelData.totalXpOfCurrentLevel,
						requiredXp: levelData.xpNeededToLevelUp
					},
					update: {
						currentLevel: levelToSet,
						currentXp: 0,
						totalXp: levelData.totalXpOfCurrentLevel,
						requiredXp: levelData.xpNeededToLevelUp
					}
				});

				interaction.reply(formatSuccessMessage(`Set user level to ${levelToSet}`));
				return;
			}

			if (subcommand === 'xp') {
				return;
			}

			return;
		}

		const xpAmountToChange = interaction.options.getNumber('xp', true);

		if (subcommand === 'add') {
			await this.container.db.userLevel.addXp(targetMember.id, {
				amount: xpAmountToChange
			});

			interaction.reply(formatSuccessMessage(`Added \`${xpAmountToChange}xp\` to ${getTag(targetMember.user)}`));
			return;
		}

		if (subcommand === 'remove') {
			await this.container.db.userLevel.removeXp(targetMember.id, xpAmountToChange);

			interaction.reply(formatSuccessMessage(`Removed \`${xpAmountToChange}xp\` from ${getTag(targetMember.user)}`));
			return;
		}
	}
}
