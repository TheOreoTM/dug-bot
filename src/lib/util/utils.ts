import { InventoryItemType, InventoryItemTypeWithCount } from '#lib/types/Data';
import {
	container,
	type ChatInputCommandSuccessPayload,
	type Command,
	type ContextMenuCommandSuccessPayload,
	type MessageCommandSuccessPayload
} from '@sapphire/framework';
import { isNullishOrEmpty } from '@sapphire/utilities';
import { cyan } from 'colorette';
import type { APIUser, Guild, User } from 'discord.js';
import fuzzysort from 'fuzzysort';

export function genRandomXp(xpBoost = 0) {
	const baseXp = genRandomInt(15, 25);
	const boostedXp = baseXp + baseXp * xpBoost;
	return Math.floor(boostedXp);
}

export function usesPomelo(user: User | APIUser) {
	return isNullishOrEmpty(user.discriminator) || user.discriminator === '0';
}

export function getTag(user: User | APIUser) {
	return usesPomelo(user) ? `@${user.username}` : `${user.username}#${user.discriminator}`;
}

export function genRandomInt(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function xpOfLevel(level: number) {
	return Math.round((5 / 6) * level * (2 * level * level + 27 * level + 91));
}

export function getLevelInfo(currentLevel: number) {
	let xpToDesiredLevel = xpOfLevel(currentLevel);
	let xpOfCurrentLevel = xpOfLevel(currentLevel + 1);
	let xpNeeded = xpOfCurrentLevel - xpToDesiredLevel;
	return {
		level: currentLevel,
		totalXpToNextLevel: xpToDesiredLevel,
		totalXpOfCurrentLevel: xpOfCurrentLevel,
		xpNeededToLevelUp: xpNeeded
	};
}

/**
 *
 * @param crateName The name of the crate
 * @returns The expected value of the crate in the db
 */
export function rarityToValue(crateName: string) {
	return `${crateName.toLowerCase()}crate` as const;
}

export function groupItems(items: InventoryItemType[]) {
	const itemInfo: Record<string, InventoryItemTypeWithCount> = {};

	items.forEach((item) => {
		const { name } = item;
		if (itemInfo[name]) {
			itemInfo[name].count++;
		} else {
			itemInfo[name] = { ...item, count: 1 };
		}
	});

	return itemInfo;
}

export function isAlphaNumeric(str: string) {
	return /^[a-zA-Z0-9 ]+$/.test(str);
}

export function fuzzysearch(search: string, targets: (string | Fuzzysort.Prepared | undefined)[], options?: FuzzysearchOptions) {
	const results = fuzzysort.go(search, targets, options);
	return results;
}

export function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	let successLoggerData: ReturnType<typeof getSuccessLoggerData>;

	if ('interaction' in payload) {
		successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
	} else {
		successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
	}

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

function getShardInfo(id: number) {
	return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
	return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
	return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
	if (guild === null) return 'Direct Messages';
	return `${guild.name}[${cyan(guild.id)}]`;
}

interface FuzzysearchOptions {
	/** Don't return matches worse than this (higher is faster) */
	threshold?: number;

	/** Don't return more results than this (lower is faster) */
	limit?: number;

	/** If true, returns all results for an empty search */
	all?: boolean;
}
