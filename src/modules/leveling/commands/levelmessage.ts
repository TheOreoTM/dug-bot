import { DugColors } from '#constants';
import type { GuildMessage } from '#lib/types/Discord';
import { formatFailMessage, formatLevelUpMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Subcommand.Options>({
	description: 'Update your level message',
	aliases: ['lm'],
	subcommands: [
		{ name: 'help', messageRun: 'msgHelp', default: true },
		{ name: 'set', messageRun: 'msgSet' },
		{ name: 'show', messageRun: 'msgShow' },
		{ name: 'reset', messageRun: 'msgReset' }
	]
})
export class UserCommand extends Subcommand {
	private readonly DEFAULT_MESSAGE = `GG {@user}, You just leveled up!`;

	public async msgHelp(message: GuildMessage) {
		const helpEmbed = new EmbedBuilder()
			.setTitle('Level Up Message Help')
			.setDescription(
				[
					'Important variables to know:',
					'- `{@user}` - Will mention the user who leveled up',
					'- `{newlevel}` - Will show the new level of the user',
					'- `{oldlevel}` - Will show the old level of the user',
					'',
					'Below are the list of subcommands and what they do'
				].join('\n')
			)
			.setColor(DugColors.Default)
			.addFields(
				{ name: 'reset', value: 'Reset your message to default' },
				{
					name: 'set',
					value: 'Change your level up message to something default. If you are seen abusing this you will be blacklisted and will get levels deducted from you.'
				},
				{ name: 'show', value: 'Preview your current message' }
			);

		send(message, { embeds: [helpEmbed] });
	}

	public async msgReset(message: GuildMessage) {
		await this.container.db.userLevel.resetLevelMessage(message.author.id);

		send(message, {
			embeds: [
				new EmbedBuilder()
					.setColor(DugColors.Success)
					.setDescription(formatSuccessMessage(`Successfully reset your level up message to:\n\`\`\`${this.DEFAULT_MESSAGE}\`\`\``))
			]
		});
	}

	public async msgSet(message: GuildMessage, args: Args) {
		await args.rest('url');
		const newMessage = await args.rest('string').catch(() => null);

		if (!newMessage) {
			await send(message, formatFailMessage('You have to give a new level up message. If youre confused use `levelmessage help`'));
			return;
		}

		if (newMessage.length > 220) {
			await send(message, formatFailMessage('Level up message should be less than 220 characters long'));
			return;
		}

		await this.container.db.userLevel.setLevelMessage(message.author.id, newMessage);

		send(message, {
			embeds: [
				new EmbedBuilder()
					.setColor(DugColors.Success)
					.setDescription(formatSuccessMessage(`Successfully reset your level up message to:\n\`\`\`${newMessage}\`\`\``))
			]
		});
	}

	public async msgShow(message: GuildMessage) {
		const levelUpMessage = (await this.container.db.userLevel.getLevelMessage(message.author.id)) ?? this.DEFAULT_MESSAGE;
		const currentLevel = await this.container.db.userLevel.getCurrentLevel(message.author.id);
		const formattedMessage = formatLevelUpMessage(levelUpMessage, message, { oldlevel: currentLevel, newlevel: currentLevel + 1 });

		send(message, {
			content: `### Level up message preview\n${formattedMessage}`,
			allowedMentions: {
				parse: [],
				users: [message.author.id]
			}
		});
	}
}
