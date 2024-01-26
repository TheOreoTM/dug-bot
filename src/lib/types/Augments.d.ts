import { DugEvents } from '#constants';
import { BaseDropType, FactionType } from '#lib/types/Data';
import { EmbedBuilder, GuildMember, Message, User } from 'discord.js';
import { GuildMessage } from './Discord';
import { ArrayString, NumberString } from '@skyra/env-utilities';
import { ModuleName } from '#config';
import { xprisma } from '#lib/util/prisma';
import type { BlacklistService, CipherService, CoreSettingsService, FactionService, LeaderboardService, LevelingService } from '#lib/services';
import { Redis } from 'ioredis';
import { PetService } from '#lib/services/PetService';
import { SimonSaysService } from '#lib/services/SimonSaysService';

declare module '@sapphire/framework' {
	interface SapphireClient {
		emit(event: DugEvents.FactionSendInvite, user: User, faction: FactionType): boolean;
		emit(event: DugEvents.FactionJoin, user: User, faction: FactionType): boolean;
		emit<T extends BaseDropType>(event: DugEvents.TriggerDrop, id: string, drop: T): boolean;
		emit(event: DugEvents.MemberLevelUp, message: GuildMessage, oldLevel: number, newLevel: number): boolean;
		emit(event: DugEvents.GuildMemberAdd, member: GuildMember): boolean;
		emit(event: DugEvents.LogSend, logEmbed: EmbedBuilder);
		emit(event: DugEvents.GuildMessageDelete, message: Message);
		loadedModules: ModuleName[];
	}
}

declare module '@skyra/env-utilities' {
	interface Env {
		DISCORD_TOKEN: string;
		API_KEY: string;
		API_URI: string;

		BOT_OWNER: string;
		BOT_PRIVILEGED_USERS?: ArrayString;
		BOT_PREFIX: string;

		REDIS_PORT: NumberString;
		REDIS_HOST: string;
		REDIS_PASSWORD: string;

		WEBHOOK_LOGGING_MESSAGE: string;
		WEBHOOK_LOGGING_SERVER: string;
		WEBHOOK_LOGGING_CHANNEL: string;
		WEBHOOK_LOGGING_ROLE: string;
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		ExpireBoostsTask: never;
		SendDailyQuestionTask: never;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		db: typeof xprisma;
		cache: Redis;

		core: CoreSettingsService;
		leaderboard: LeaderboardService;
		blacklist: BlacklistService;
		leveling: LevelingService;
		faction: FactionService;
		cipher: CipherService;
		pet: PetService;
		says: SimonSaysService;
	}
}
