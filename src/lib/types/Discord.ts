import { DugClient } from '#lib/DugClient';
import {
	ChatInputCommand,
	ChatInputCommandContext,
	Command,
	ContextMenuCommand,
	ContextMenuCommandContext,
	MessageCommand,
	MessageCommandContext
} from '@sapphire/framework';
import {
	CommandInteraction,
	CommandInteractionOptionResolver,
	Guild,
	GuildBasedChannel,
	GuildMember,
	GuildTextBasedChannel,
	Message,
	Role,
	TextChannel
} from 'discord.js';

export interface GuildMessage extends Message {
	channel: GuildTextBasedChannel;
	readonly guild: Guild;
	readonly member: GuildMember;
	readonly guildId: string;
}

export interface GuildCommandInteractionOptionResolver extends CommandInteractionOptionResolver {
	getMember(name: string): GuildMember;
	getChannel(name: string, required?: boolean): GuildBasedChannel;
	getRole(name: string, required?: boolean): Role;
}

export interface GuildInteraction extends CommandInteraction {
	readonly guild: Guild;
	readonly guildId: string;
	readonly member: GuildMember;
	readonly channel: TextChannel;
	options: GuildCommandInteractionOptionResolver;
	client: DugClient<true>;
}

export type InteractionOrMessage = GuildMessage | Command.ChatInputCommandInteraction | Command.ContextMenuCommandInteraction;
export type InteractionOrMessageCommandContext = MessageCommandContext | ChatInputCommandContext | ContextMenuCommandContext;
export type InteractionOrMessageCommand = MessageCommand | ChatInputCommand | ContextMenuCommand;
