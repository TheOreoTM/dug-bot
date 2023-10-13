import { DugEvents } from '#constants';
import { User as PrismaUser } from '@prisma/client';
import { DropType, FactionType } from './Data';

declare module '@sapphire/framework' {
	interface SapphireClient {
		emit(event: DugEvents.TriggerDrop, drop: DropType): boolean;
		emit(event: DugEvents.FactionSendInvite, user: PrismaUser, faction: FactionType): boolean;
		emit(event: DugEvents.FactionJoin, user: PrismaUser, faction: FactionType): boolean;
		emit(event: DugEvents.TriggerDrop, drop: DropType): boolean;
	}
}
