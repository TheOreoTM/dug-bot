import { Items } from '#lib/items';
import { InventoryItemType, InventoryItemTypeWithCount, ItemValue } from '#lib/types/Data';
import {
	container,
	type ChatInputCommandSuccessPayload,
	type Command,
	type ContextMenuCommandSuccessPayload,
	type MessageCommandSuccessPayload
} from '@sapphire/framework';
import { isNullishOrEmpty, pickRandom } from '@sapphire/utilities';
import { cyan } from 'colorette';
import type { APIUser, Channel, EmbedAssetData, EmbedAuthorData, Guild, ImageURLOptions, Message, User } from 'discord.js';
import { GuildMember } from 'discord.js';
import fuzzysort from 'fuzzysort';

/**
 * Image extensions:
 * - bmp
 * - jpg
 * - jpeg
 * - png
 * - gif
 * - webp
 */
export const IMAGE_EXTENSION = /\.(bmp|jpe?g|png|gif|webp)$/i;

const ROOT = 'https://cdn.discordapp.com';
export function getDisplayAvatar(user: User | APIUser, options: ImageURLOptions = {}) {
	if (user.avatar === null) {
		const id = (usesPomelo(user) ? (BigInt(user.id) >> 22n) % 6n : Number(user.discriminator) % 5).toString();
		return `${ROOT}/embed/avatars/${id}.png`;
	}

	const extension = !options.forceStatic && user.avatar.startsWith('a_') ? 'gif' : options.extension ?? 'webp';
	const size = typeof options.size === 'undefined' ? '' : `?size=${options.size}`;
	return `${ROOT}/avatars/${user.id}/${user.avatar}.${extension}${size}`;
}

export function randomItem<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get a image attachment from a message.
 * @param message The Message instance to get the image url from
 */
export function getAttachment(message: Message): EmbedAssetData | null {
	if (message.attachments.size) {
		const attachment = message.attachments.find((att) => IMAGE_EXTENSION.test(att.name ?? att.url));
		if (attachment) {
			return {
				url: attachment.url,
				proxyURL: attachment.proxyURL,
				height: attachment.height!,
				width: attachment.width!
			};
		}
	}

	for (const embed of message.embeds) {
		if (embed.image) {
			return {
				url: embed.image.url,
				proxyURL: embed.image.proxyURL!,
				height: embed.image.height!,
				width: embed.image.width!
			};
		}

		if (embed.thumbnail) {
			return {
				url: embed.thumbnail.url,
				proxyURL: embed.thumbnail.proxyURL!,
				height: embed.thumbnail.height!,
				width: embed.thumbnail.width!
			};
		}
	}

	return null;
}

/**
 * Get the image url from a message.
 * @param message The Message instance to get the image url from
 */
export function getImage(message: Message): string | null {
	const attachment = getAttachment(message);
	return attachment ? attachment.proxyURL || attachment.url : null;
}

/**
 * Get the content from a message.
 * @param message The Message instance to get the content from
 */
export function getContent(message: Message): string | null {
	if (message.content) return message.content;
	for (const embed of message.embeds) {
		if (embed.description) return embed.description;
		if (embed.fields.length) return embed.fields[0].value;
	}
	return null;
}

export function getFullEmbedAuthor(user: User | APIUser, url?: string | undefined): EmbedAuthorData {
	return { name: `${getTag(user)} (${user.id})`, iconURL: getDisplayAvatar(user, { size: 128 }), url };
}

export async function fetchChannel<T extends Channel>(channelId: string): Promise<T | null> {
	const channel = container.client.channels.cache.get(channelId) ?? (await container.client.channels.fetch(channelId));
	return channel as T | null;
}

export function isOwner(member: GuildMember) {
	return member.id === '600707283097485322';
}

export function recordToMap<T>(record: Record<string, T>): Map<string, T> {
	const map = new Map<string, T>();

	// Iterate over the entries of the record and add them to the map
	for (const [key, value] of Object.entries(record)) {
		map.set(key, value);
	}

	return map;
}

export function genRandomXp(xpBoost = 1) {
	const baseXp = genRandomInt(20, 40);
	const boostedXp = baseXp * xpBoost;
	return Math.floor(boostedXp);
}

const ImageUrlRegex = /\.(jpeg|jpg|gif|png|bmp)$/i;
const ImgurLinkRegex = /^(https?:\/\/)?(i\.)?imgur\.com\/\w+(\.\w+)?$/i;

export function isImageLink(url: string) {
	return ImageUrlRegex.test(url) || ImgurLinkRegex.test(url);
}

export function usesPomelo(user: User | APIUser) {
	return isNullishOrEmpty(user.discriminator) || user.discriminator === '0';
}

export function getTag(user: User | APIUser | undefined) {
	if (!user) return `@Deleted User`;
	return usesPomelo(user) ? `@${user.username}` : `${user.username}#${user.discriminator}`;
}

export function genRandomInt(min: number, max: number) {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// export function xpOfLevel(level: number) {
// 	return Math.round((5 / 6) * level * (2 * level * level + 27 * level + 91));
// }

export function xpOfLevel(level: number) {
	let xp = 0;
	let crap = new Array(level || 0);
	for (let i = 0; i < crap.length; i++) {
		xp += i * 100 + 75;
	}

	return xp;
}

export function generateTopic() {
	const Topics = [
		'If you could travel back in time, what era would you visit and why?',
		'Share a fun and interesting science fact.',
		"What's a skill or hobby you've always wanted to learn?",
		'Discuss a movie or TV show you recently watched.',
		"What's a dream destination you'd love to visit someday?",
		'Share a personal story or experience that impacted you.',
		'Discuss a fascinating space-related topic.',
		"What's a thought-provoking ethical dilemma you've pondered?",
		'If you had a superpower, what would it be and how would you use it?',
		"What's a piece of advice you'd give to your younger self?",
		'Share a cultural tradition or celebration that you find intriguing.',
		'Discuss a breakthrough in technology that excites you.',
		'If you could have dinner with any historical figure, who would it be?',
		"What's a hidden gem of a book or movie you'd recommend?",
		'Share a favorite childhood memory.',
		'If you were stranded on a deserted island, what three items would you bring?',
		"What's a skill you're particularly proud of?",
		'Discuss a fascinating animal or insect behavior.',
		"What's a fictional world you'd love to live in for a day?",
		"Share a personal goal or aspiration you're working towards.",
		'If you could meet any celebrity, who would it be and why?'
	];

	return pickRandom(Topics, 1);
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

export function isItemValue(value: string, caseSensitive = true): ItemValue | null {
	const lookupValue = caseSensitive ? value : value.toLowerCase();
	const foundKey = Object.keys(Items).find((item) => (caseSensitive ? item === lookupValue : item.toLowerCase() === lookupValue));

	if (foundKey) {
		return foundKey as ItemValue;
	}

	return null;
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
