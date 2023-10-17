import { DugEvents } from '#constants';
import { GuildMessage } from '#lib/types/Discord';
import { getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { LevelUp } from 'canvafy';

@ApplyOptions<Listener.Options>({ event: DugEvents.MemberLevelUp })
export class UserEvent extends Listener {
	public override async run(message: GuildMessage, oldLevel: number, newLevel: number) {
		const member = message.member;
		const levelUp = await new LevelUp()
			.setAvatar(member.displayAvatarURL({ forceStatic: true }))
			.setBackground('color', `#23272a`)
			.setUsername(getTag(member.user))
			.setLevels(oldLevel, newLevel)
			.setBorder(member.roles.highest.hexColor)
			.setAvatarBorder(member.roles.highest.hexColor)
			.build();

		message.reply({
			content: `GG ${member}, You just leveled up!`,
			files: [
				{
					attachment: levelUp,
					name: 'levelup.png'
				}
			],
			allowedMentions: { repliedUser: true }
		});
	}
}
