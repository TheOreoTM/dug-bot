import { DugEvents } from '#constants';
import { FactionType } from '#lib/types/Data';
import { FactionStatus, User } from '@prisma/client';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ event: DugEvents.FactionJoin })
export class UserEvent extends Listener {
	public override async run(user: User, faction: FactionType) {
		if (!faction) return;
		if (faction.joinType === FactionStatus.INVITE_ONLY) this.container.client.emit(DugEvents.FactionSendInvite, user, faction);

		await this.container.db.user.update({
			where: {
				id: user.id
			},
			data: {
				faction: {
					connect: {
						id: faction.id
					}
				}
			}
		});
	}
}
