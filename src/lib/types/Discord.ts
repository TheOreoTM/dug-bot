import { Guild, GuildMember, GuildTextBasedChannel, Message } from 'discord.js';

export interface GuildMessage extends Message {
	channel: GuildTextBasedChannel;
	readonly guild: Guild;
	readonly member: GuildMember;
	readonly guildId: string;
}
