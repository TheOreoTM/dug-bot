import { DugEvents } from '#constants';
import { DropType, FactionType } from '#lib/types/Data';
import { User } from 'discord.js';

declare module '@sapphire/framework' {
	interface SapphireClient {
		emit(event: DugEvents.FactionSendInvite, user: User, faction: FactionType): boolean;
		emit(event: DugEvents.FactionJoin, user: User, faction: FactionType): boolean;
		emit(event: DugEvents.TriggerDrop, drop: DropType): boolean;
	}
}
