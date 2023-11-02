import { DugEvents } from '#constants';
import { GuildMessage } from '#lib/types/Discord';
import { getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import canvafy from 'canvafy';
import { ActionRowBuilder, ButtonBuilder, quote } from 'discord.js';
const { LevelUp } = canvafy;

@ApplyOptions<Listener.Options>({ event: DugEvents.MemberLevelUp })
export class UserEvent extends Listener {
	public override async run(message: GuildMessage, oldLevel: number, newLevel: number) {
		const member = message.member;

		const refButton = new ButtonBuilder()
			.setLabel('Click Here')
			.setURL(`https://discord.com/channels/519734247519420438/910957338482057256/1147770237945651210`);

		const levelUp = await new LevelUp()
			.setAvatar(member.displayAvatarURL({ forceStatic: true }))
			.setBackground('color', `#23272a`)
			.setUsername(getTag(member.user))
			.setLevels(oldLevel, newLevel)
			.setAvatarBorder(member.roles.highest.hexColor)
			.build();

		const availableLevelRoles = await this.container.db.levelRole.findMany({
			where: {
				level: {
					lte: newLevel
				}
			}
		});

		member.roles.add(availableLevelRoles.map((r) => r.roleId));

		message.reply({
			content: `GG ${member}, You just leveled up!\n\n ${quote(
				`Did your levels not get transferred? [\`click here\`](https://discord.com/channels/519734247519420438/910957338482057256/1147770237945651210 'create a ticket') or the button below to create a ticket and click the \`Other\` option and request your levels back`
			)}`,
			files: [
				{
					attachment: levelUp,
					name: 'levelup.png'
				}
			],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(refButton)],
			allowedMentions: { repliedUser: true }
		});
	}
}
