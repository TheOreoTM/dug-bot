import { SendLogEmbed } from '#lib/classes';
import type { GuildMessage } from '#lib/types/Discord';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { getLevelInfo, getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Duration, DurationFormatter } from '@sapphire/duration';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { GuildMember } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'XP Command',
	requiredUserPermissions: ['Administrator']
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
								.setName('boost')
								.setDescription("Change the user's XP Boost")
								.addUserOption((o) => o.setName('member').setDescription('Target member').setRequired(true))
								.addNumberOption((o) =>
									o.setName('boost').setDescription('The new XP Boost amount').setRequired(true).setMinValue(0).setMaxValue(1000)
								)
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

				.addSubcommand((cmd) =>
					cmd
						.setName('add-boost')
						.setDescription('Add a boost to the user')
						.addUserOption((o) => o.setName('member').setDescription('Target member').setRequired(true))
						.addNumberOption((o) =>
							o.setName('boost').setDescription('The new XP Boost amount').setRequired(true).setMinValue(0).setMaxValue(100)
						)
						.addStringOption((o) => o.setName('time').setDescription('The time to add the boost').setRequired(true))
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
		const subcommand = interaction.options.getSubcommand(true) as 'level' | 'xp' | 'add' | 'remove' | 'boost' | 'add-boost';
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
				SendLogEmbed.LevelSet({
					user: targetMember.user,
					level: levelToSet,
					reason: '`xp set level` command',
					staff: interaction.member as GuildMember
				});
				return;
			}

			if (subcommand === 'boost') {
				const boostToSet = interaction.options.getNumber('boost', true);

				await this.container.db.userLevel.upsert({
					where: {
						userId: targetMember.id
					},
					create: {
						userId: targetMember.id,
						xpBoost: boostToSet
					},
					update: {
						xpBoost: boostToSet
					}
				});
				interaction.reply(formatSuccessMessage(`Set user XP Boost to x${boostToSet}`));
				SendLogEmbed.SetXpBoost({
					user: targetMember.user,
					amount: boostToSet,
					reason: '`xp set boost` command',
					staff: interaction.member as GuildMember
				});

				return;
			}

			return;
		}

		if (subcommand === 'add-boost') {
			const boostToAdd = interaction.options.getNumber('boost', true);
			const timeToAddString = interaction.options.getString('time', true);
			const timeDuration = new Duration(timeToAddString);
			const boostExpireDate = timeDuration.fromNow;
			const boostDurationMs = timeDuration.offset;
			console.log('🚀 ~ UserCommand ~ overridechatInputRun ~ boostDurationMs:', boostDurationMs);
			const formattedDuration = new DurationFormatter().format(boostDurationMs);

			await this.container.db.userLevel.addXpBoost(targetMember.id, boostToAdd, boostExpireDate);
			await this.container.tasks.create('ExpireBoost', { amount: boostToAdd, userId: targetMember.id }, boostDurationMs);

			interaction.reply(formatSuccessMessage(`Added a boost of \`x${boostToAdd}\` to ${getTag(targetMember.user)} for ${formattedDuration}`));
			return;
		}

		const xpAmountToChange = interaction.options.getNumber('xp', true);

		if (subcommand === 'add') {
			await this.container.db.userLevel.addXp(targetMember.id, {
				amount: xpAmountToChange
			});

			interaction.reply(formatSuccessMessage(`Added \`${xpAmountToChange}xp\` to ${getTag(targetMember.user)}`));
			SendLogEmbed.AddXp({
				user: targetMember.user,
				amount: xpAmountToChange,
				reason: '`xp add` command',
				staff: interaction.member as GuildMember
			});

			return;
		}

		if (subcommand === 'remove') {
			await this.container.db.userLevel.removeXp(targetMember.id, xpAmountToChange);

			interaction.reply(formatSuccessMessage(`Removed \`${xpAmountToChange}xp\` from ${getTag(targetMember.user)}`));
			SendLogEmbed.AddXp({
				user: targetMember.user,
				amount: -xpAmountToChange,
				reason: '`xp remove` command',
				staff: interaction.member as GuildMember
			});
			return;
		}
	}
}
