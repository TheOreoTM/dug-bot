import { BotID, DugColors, DugEvents } from '#constants';
import { EmbedBuilder, GuildMember, Snowflake, User } from 'discord.js';
import { Timestamp } from '#lib/classes/Timestamp';
import { container } from '@sapphire/pieces';
const template = new EmbedBuilder().setColor(DugColors.Default);
const nowTimestamp = new Timestamp(Date.now());

export class SendLogEmbed {
	static AddXp({ user, amount, staff, reason }: { user: User; amount: number; reason: string; staff?: GuildMember }) {
		const responsibleUserText = `${staff ? staff : `<@${BotID}>`} - \` ${staff ? staff.id : BotID} \``;
		const embed = template.setDescription(`Added **\`${amount}xp\`** to ${user} at ${nowTimestamp.getLongDateTime()}`).setFields(
			{
				inline: true,
				name: 'Responsible User',
				value: responsibleUserText
			},
			{
				inline: true,
				name: 'Reason',
				value: reason
			}
		);

		container.client.emit(DugEvents.LogSend, embed);
	}

	static AddXpBoost({
		user,
		amount,
		staff,
		reason,
		expiresAt
	}: {
		expiresAt: Date;
		user: User;
		amount: number;
		reason: string;
		staff?: GuildMember;
	}) {
		const expiresAtTimestamp = new Timestamp(expiresAt.getTime());
		const responsibleUserText = `${staff ? staff : `<@${BotID}>`} - \` ${staff ? staff.id : BotID} \``;
		const embed = template
			.setDescription(`Added **\`x${amount} boost\`** to ${user} at ${nowTimestamp.getLongDateTime()}`)
			.setFields(
				{ inline: true, name: 'Responsible User', value: responsibleUserText },
				{ inline: true, name: 'Reason', value: reason },
				{ inline: true, name: 'Expires At', value: expiresAtTimestamp.getLongDateTime() }
			);

		container.client.emit(DugEvents.LogSend, embed);
	}

	static SetXpBoost({ user, amount, staff, reason }: { user: User; amount: number; reason: string; staff?: GuildMember }) {
		const responsibleUserText = `${staff ? staff : `<@${BotID}>`} - \` ${staff ? staff.id : BotID} \``;
		const embed = template
			.setDescription(`Set **\`x${amount} boost\`** for ${user} at ${nowTimestamp.getLongDateTime()}`)
			.setFields({ inline: true, name: 'Responsible User', value: responsibleUserText }, { inline: true, name: 'Reason', value: reason });

		container.client.emit(DugEvents.LogSend, embed);
	}

	static LevelUp({ user, level, staff, reason }: { user: User; level: number; reason: string; staff?: GuildMember }) {
		const responsibleUserText = `${staff ? staff : `<@${BotID}>`} - \` ${staff ? staff.id : BotID} \``;
		const embed = template.setDescription(`${user} level **up** to \`${level}\` at ${nowTimestamp.getLongDateTime()}`).setFields(
			{
				name: 'Responsible User',
				value: responsibleUserText,
				inline: true
			},
			{ inline: true, name: 'Reason', value: reason }
		);

		container.client.emit(DugEvents.LogSend, embed);
	}

	static LevelSet({ user, level, staff, reason }: { user: User; level: number; reason: string; staff?: GuildMember | User }) {
		const responsibleUserText = `${staff ? staff : `<@${BotID}>`} - \` ${staff ? staff.id : BotID} \``;
		const embed = template.setDescription(`${user} level **set** to \`${level}\` at ${nowTimestamp.getLongDateTime()}`).setFields(
			{
				name: 'Responsible User',
				value: responsibleUserText,
				inline: true
			},
			{ inline: true, name: 'Reason', value: reason }
		);

		container.client.emit(DugEvents.LogSend, embed);
	}

	static ReassignRoles({ user, roles, staff, reason }: { user: User; roles: Snowflake[]; reason: string; staff?: GuildMember }) {
		const responsibleUserText = `${staff ? staff : `<@${BotID}>`} - \` ${staff ? staff.id : BotID} \``;
		const embed = template.setDescription(`Roles given to ${user} at ${nowTimestamp.getLongDateTime()}`).setFields(
			{ inline: true, name: 'Responsible User', value: responsibleUserText },
			{ inline: true, name: 'Reason', value: reason },
			{
				name: 'Roles Given',
				value: roles.map((r) => `<@&${r}> `).join(' ') || 'None?'
			}
		);

		container.client.emit(DugEvents.LogSend, embed);
	}
}
