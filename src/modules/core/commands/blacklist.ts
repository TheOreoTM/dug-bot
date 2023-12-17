import { DugColors } from '#constants';
import type { GuildMessage } from '#lib/types/Discord';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Subcommand.Options>({
	name: 'blacklist',
	description: 'Manage the blacklist',
	requiredUserPermissions: ['Administrator'],

	subcommands: [
		{ name: 'help', messageRun: 'help', default: true },
		{ name: 'add', messageRun: 'add' },
		{ name: 'remove', messageRun: 'remove' }
	]
})
export class UserCommand extends Subcommand {
	public async help(message: GuildMessage) {
		const helpEmbed = new EmbedBuilder()
			.setTitle('Blacklist Help')
			.setDescription('Below are the list of subcommands and what they do')
			.setColor(DugColors.Default)
			.addFields({ name: 'add', value: 'Add a user to the blacklist' }, { name: 'remove', value: 'Remove a user from the blacklist' });

		send(message, { embeds: [helpEmbed] });
	}

	public async add(message: GuildMessage, args: Args) {
		const target = await args.pick('member');
		const reason = await args.rest('string').catch(() => null);

		if (!reason) {
			send(message, {
				embeds: [
					new EmbedBuilder()
						.setColor(DugColors.Fail)
						.setDescription(formatFailMessage(`You have to provide a valid reason for the blacklist`))
				]
			});
			return;
		}

		await this.container.blacklist.add(target.id, reason);

		send(message, {
			embeds: [
				new EmbedBuilder()
					.setColor(DugColors.Success)
					.setDescription(formatSuccessMessage(`Successfully added \`${target.id}\` to the blacklist | ${reason}`))
			]
		});
		return;
	}

	public async remove(message: GuildMessage, args: Args) {
		const target = await args.pick('member');

		await this.container.blacklist.remove(target.id);

		send(message, {
			embeds: [
				new EmbedBuilder()
					.setColor(DugColors.Success)
					.setDescription(formatSuccessMessage(`Successfully removed \`${target.id}\` from the blacklist`))
			]
		});
		return;
	}
}
