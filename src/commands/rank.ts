import { DugColors } from '#constants';
import type { GuildMessage } from '#lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import canvacord from 'canvacord';
import { ApplicationCommandType, AttachmentBuilder, GuildMember } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'View your level information'
})
export class UserCommand extends Command {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option //
						.setName('user')
						.setDescription('The member you want to check the rank for')
						.setRequired(false)
				)
		);

		// Register Context Menu command available from any user
		registry.registerContextMenuCommand({
			name: this.name,
			type: ApplicationCommandType.User
		});
	}

	// Message command
	public override async messageRun(message: GuildMessage) {
		const rankcard = await this.genRankCard(message.member);
		send(message, { files: [rankcard] });
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction<'cached'>) {
		const rankcard = await this.genRankCard(interaction.options.getMember('user') ?? interaction.member);
		interaction.reply({ files: [rankcard] });
	}

	// Context Menu command
	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction<'cached'>) {
		const rankcard = await this.genRankCard(interaction.member);
		interaction.reply({ files: [rankcard] });
	}

	private async genRankCard(member: GuildMember) {
		const data = await this.container.db.userLevel.findUnique({
			where: {
				userId: member.id
			}
		});

		const rank = new canvacord.Rank()
			.setAvatar(member.displayAvatarURL())
			.setCurrentXP(data?.currentXp || 0)
			.setRequiredXP(data?.requiredXp || 0)
			.setStatus('dnd')
			.setProgressBar(DugColors.Default.toString(), 'GRADIENT', true)
			.setUsername(member.user.username)
			.setDiscriminator('0');

		const attachment = new AttachmentBuilder(await rank.build(), { name: 'rankcard.png' });
		return attachment;
	}
}
