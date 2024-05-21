import { DugColors } from '#constants';
import { DugCommand, DugEmbedBuilder } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import { TextChannel } from 'discord.js';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD'
})
export class UserCommand extends DugCommand {
	// Message command
	public override async messageRun(message: DugCommand.Message) {
		const { guild } = message;

		const channel = message.channel as TextChannel;

		await guild.members.fetch();

		const adminRoleId = `902884958354407484`;
		const modRoleId = `904263866270228502`;
		const staffRoleId = `634605860206804992`;
		const traineeRoleId = `1016966909121527809`;

		channel.send(adminRoleId);
		channel.send(modRoleId);
		channel.send(staffRoleId);
		channel.send(traineeRoleId);

		const adminRole = guild?.roles.cache.get(adminRoleId ?? '0');
		const modRole = guild?.roles.cache.get(modRoleId ?? '0');
		const staffRole = guild?.roles.cache.get(staffRoleId ?? '0');
		const traineeRole = guild?.roles.cache.get(traineeRoleId ?? '0');

		const admins = adminRole?.members.map((m) => m.id) ?? [];
		const mods = modRole?.members.map((m) => m.id) ?? [];
		const staffs = staffRole?.members.map((m) => m.id) ?? [];
		const trainees = traineeRole?.members.map((m) => m.id) ?? [];

		const adminSet = new Set(admins);
		const modSet = new Set(mods);
		const staffSet = new Set(staffs);
		// const traineeSet = new Set(trainees);

		const cleanedMods = mods.filter((userId) => !adminSet.has(userId));
		const cleanedStaffs = staffs.filter((userId) => !adminSet.has(userId) && !modSet.has(userId));
		const cleanedTrainees = trainees.filter((userId) => !adminSet.has(userId) && !modSet.has(userId) && !staffSet.has(userId));

		const embed = new DugEmbedBuilder()
			.setColor(DugColors.Default)
			.setAuthor({ iconURL: guild.iconURL({ forceStatic: true }) ?? undefined, name: `${guild.name} - Staff Roles ` });
		if (admins.length && adminRole)
			embed.addFields({
				name: adminRole.name.slice(0, 256),
				value: `<@${admins.join('> <@')}>`
			});
		if (cleanedMods.length && modRole)
			embed.addFields({
				name: modRole.name.slice(0, 256),
				value: `<@${cleanedMods.join('> <@')}>`
			});
		if (cleanedStaffs.length && staffRole)
			embed.addFields({
				name: staffRole.name.slice(0, 256),
				value: `<@${cleanedStaffs.join('> <@')}>`
			});
		if (cleanedTrainees.length && traineeRole)
			embed.addFields({
				name: traineeRole.name.slice(0, 256),
				value: `<@${cleanedTrainees.join('> <@')}>`
			});

		send(message, { embeds: [embed] });
	}
}
