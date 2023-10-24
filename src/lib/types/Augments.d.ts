import { DugEvents } from '#constants';
import { BaseDropType, FactionType } from '#lib/types/Data';
import { User } from 'discord.js';
import { GuildMessage } from './Discord';
import { ArrayString, NumberString } from '@skyra/env-utilities';

declare module '@sapphire/framework' {
	interface SapphireClient {
		emit(event: DugEvents.FactionSendInvite, user: User, faction: FactionType): boolean;
		emit(event: DugEvents.FactionJoin, user: User, faction: FactionType): boolean;
		emit<T extends BaseDropType>(event: DugEvents.TriggerDrop, id: string, drop: T): boolean;
		emit(event: DugEvents.MemberLevelUp, message: GuildMessage, oldLevel: number, newLevel: number): boolean;
	}
}

declare module '@skyra/env-utilities' {
	interface Env {
		DISCORD_TOKEN: string;

		BOT_OWNER: string;
		BOT_PRIVILEGED_USERS?: ArrayString;
		BOT_PREFIX: string;

		REDIS_PORT: NumberString;
		REDIS_HOST: string;
		REDIS_PASSWORD: string;
	}
}
