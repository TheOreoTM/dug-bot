import { DugEvents } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: DugEvents.GuildMemberAdd })
export class UserEvent extends Listener {
	public override async run(member: GuildMember) {
		const level = await this.container.db.userLevel.getCurrentLevel(member.id);
		const availableLevelRoles = await this.container.db.levelRole.findMany({
			where: {
				level: {
					lte: level
				}
			}
		});

		member.roles.add(availableLevelRoles.map((r) => r.id));
	}
}
