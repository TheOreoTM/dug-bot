process.env.NODE_ENV ??= 'development';

import { Time } from '@sapphire/duration';
import { BucketScope, type ClientLoggerOptions, type CooldownOptions, LogLevel } from '@sapphire/framework';
import {
	type ClientOptions,
	GatewayIntentBits,
	type MessageMentionOptions,
	Partials,
	type PresenceData,
	type SweeperOptions,
	ActivityType
} from 'discord.js';
import { BotOwners, BotPrefix } from '#constants';
import { ServerOptions } from '@sapphire/plugin-api';
import { envParseNumber, envParseString } from '@skyra/env-utilities';
import { RedisOptions } from 'bullmq';
import { ScheduledTaskHandlerOptions } from '@sapphire/plugin-scheduled-tasks';

export function parseRedisOption(): Pick<RedisOptions, 'port' | 'password' | 'host'> {
	return {
		port: envParseNumber('REDIS_PORT'),
		password: envParseString('REDIS_PASSWORD'),
		host: envParseString('REDIS_HOST')
		// db: 0
	};
}

export const config: Config = {
	enabled_modules: ['core', 'leveling', 'games', 'faction'],
	tasks: {
		bull: {
			connection: parseRedisOption(),
			defaultJobOptions: {
				removeOnComplete: true
			}
		}
	},
	api: {
		origin: '*',
		prefix: '/',
		listenOptions: {
			port: 4010
		}
	},
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping
	],
	partials: [Partials.Channel, Partials.Message, Partials.GuildMember, Partials.User],
	cooldown_options: {
		delay: Time.Second * 10,
		filteredUsers: BotOwners,
		scope: BucketScope.User
	},
	mentions: {
		parse: ['users'],
		repliedUser: false
	},
	logger: {
		level: LogLevel.Info
	},
	sweepers: {
		bans: {
			interval: 300,
			filter: () => null
		},
		applicationCommands: {
			interval: 300,
			filter: () => null
		},
		emojis: {
			interval: 30,
			filter: () => null
		},
		invites: {
			interval: 60,
			filter: () => null
		},
		messages: {
			interval: 120,
			lifetime: 360
		},
		reactions: {
			interval: 5,
			filter: () => null
		},
		voiceStates: {
			interval: 30,
			filter: () => null
		},
		threads: {
			interval: 3600,
			lifetime: 14400
		}
	},
	presence: {
		status: 'online',
		activities: [
			{
				name: 'over factions',
				type: ActivityType.Watching
			}
		]
	}
};

export const ClientConfig: ClientOptions = {
	api: config.api,
	intents: config.intents,
	partials: config.partials,
	allowedMentions: config.mentions,
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultCooldown: config.cooldown_options,
	defaultPrefix: BotPrefix,
	logger: config.logger,
	loadMessageCommandListeners: true,
	shards: 'auto',
	disableMentionPrefix: false,
	preventFailedToFetchLogForGuilds: true,
	sweepers: config.sweepers,
	tasks: config.tasks
};

interface Config {
	enabled_modules: ModuleName[];
	tasks: ScheduledTaskHandlerOptions;
	intents: GatewayIntentBits[];
	cooldown_options: CooldownOptions;
	mentions: MessageMentionOptions;
	partials: Partials[];
	logger: ClientLoggerOptions;
	sweepers: SweeperOptions;
	presence: PresenceData;
	api: ServerOptions;
}

export type ModuleName = 'leveling' | 'games' | 'core' | 'faction' | 'economy' | 'welcomer';
export type ModulePath = `modules/${ModuleName}`;
