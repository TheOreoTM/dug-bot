import type { GuildMessage } from '#lib/types/Discord';
import { formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Subcommand.Options>({
	name: 'card',
	description: 'Modify your rank card',
	subcommands: [
		{ name: 'bgImage', chatInputRun: 'slashBgImage', messageRun: 'msgBgImage' },
		{ name: 'bgColor', chatInputRun: 'slashBgColor', messageRun: 'msgBgColor' },
		{ name: 'borderColor', chatInputRun: 'slashBorderColor', messageRun: 'msgBorderColor' },
		{ name: 'avatarBorderColor', chatInputRun: 'slashAvBorderColor', messageRun: 'msgAvBorderColor' },
		{ name: 'barColor', chatInputRun: 'slashBarColor', messageRun: 'msgBarColor' },
		{ name: 'fontColor', chatInputRun: 'slashFontColor', messageRun: 'msgFontColor' }
	]
})
export class UserCommand extends Subcommand {
	public async msgBgColor(message: GuildMessage, args: Args) {
		const member = message.member;
		const hexCode = await args.pick('hexCode');
		await this.container.db.userLevel.updateCustoms(member.id, {
			bgColor: hexCode
		});

		const embed = new EmbedBuilder().setDescription(formatSuccessMessage('Successfully set your `bgColor`')).setColor(hexCode);

		send(message, { embeds: [embed] });
	}

	public async msgFontColor(message: GuildMessage, args: Args) {
		const member = message.member;
		const fontColor = await args.pick('hexCode');
		await this.container.db.userLevel.updateCustoms(member.id, {
			fontColor
		});

		const embed = new EmbedBuilder().setDescription(formatSuccessMessage('Successfully set your `fontColor`')).setColor(fontColor);

		send(message, { embeds: [embed] });
	}

	public async msgBarColor(message: GuildMessage, args: Args) {
		const member = message.member;
		const barColor = await args.pick('hexCode');
		await this.container.db.userLevel.updateCustoms(member.id, {
			barColor
		});

		const embed = new EmbedBuilder().setDescription(formatSuccessMessage('Successfully set your `barColor`')).setColor(barColor);

		send(message, { embeds: [embed] });
	}

	public async msgAvBorderColor(message: GuildMessage, args: Args) {
		const member = message.member;
		const avatarBorderColor = await args.pick('hexCode');
		await this.container.db.userLevel.updateCustoms(member.id, {
			avatarBorderColor
		});

		const embed = new EmbedBuilder()
			.setDescription(formatSuccessMessage('Successfully set your `avatarBorderColor`'))
			.setColor(avatarBorderColor);

		send(message, { embeds: [embed] });
	}

	public async msgBorderColor(message: GuildMessage, args: Args) {
		const member = message.member;
		const borderColor = await args.pick('hexCode');
		await this.container.db.userLevel.updateCustoms(member.id, {
			borderColor
		});

		const embed = new EmbedBuilder().setDescription(formatSuccessMessage('Successfully set your `borderColor`')).setColor(borderColor);

		send(message, { embeds: [embed] });
	}

	public async DISABLEDmsgBgImageDISABLED(message: GuildMessage, args: Args) {
		const member = message.member;
		const bgImage = await args.pick('imageLink');
		await this.container.db.userLevel.updateCustoms(member.id, {
			bgImage
		});

		const embed = new EmbedBuilder().setDescription(formatSuccessMessage('Successfully set your `bgImage`')).setImage(bgImage);

		send(message, { embeds: [embed] });
	}
}
