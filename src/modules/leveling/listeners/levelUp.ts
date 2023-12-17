import { ChannelIDs, DugEvents } from '#constants';
import { GuildMessage } from '#lib/types/Discord';
import { formatLevelUpMessage } from '#lib/util/formatter';
import { genRandomInt, getTag } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import canvafy from 'canvafy';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, quote } from 'discord.js';
const { LevelUp } = canvafy;

@ApplyOptions<Listener.Options>({ event: DugEvents.MemberLevelUp })
export class UserEvent extends Listener {
	public override async run(message: GuildMessage, oldLevel: number, newLevel: number) {
		const member = message.member;

		const refButton = new ButtonBuilder()
			.setLabel('Click Here')
			.setStyle(ButtonStyle.Link)
			.setURL(`https://discord.com/channels/519734247519420438/910957338482057256/1147770237945651210`);

		const levelUp = await new LevelUp()
			.setAvatar(member.displayAvatarURL({ forceStatic: true }))
			.setBackground('color', `#23272a`)
			.setUsername(getTag(member.user))
			.setLevels(oldLevel, newLevel)
			.setAvatarBorder(member.displayHexColor)
			.build();

		const availableLevelRoles = await this.container.db.levelRole.findMany({
			where: {
				level: {
					lte: newLevel
				}
			}
		});

		member.roles.add(availableLevelRoles.map((r) => r.roleId));
		const defaultMessage = `GG ${member}, You just leveled up!`;
		const levelUpMessage = (await this.container.db.userLevel.getLevelMessage(member.id)) ?? defaultMessage;
		const channel = message.guild.channels.cache.get(ChannelIDs.General) as TextChannel;
		channel.send({
			content: `${formatLevelUpMessage(levelUpMessage, message, { oldlevel: oldLevel, newlevel: newLevel })}`,
			files: [
				{
					attachment: levelUp,
					name: 'levelup.png'
				}
			],
			allowedMentions: { users: [member.id] }
		});

		const shouldSendWarning = 9 > genRandomInt(0, 100);

		if (shouldSendWarning) {
			channel.send({
				content: `\n\n ${quote(
					`Did your levels not get transferred? [\`click here\`](https://discord.com/channels/519734247519420438/910957338482057256/1147770237945651210 'create a ticket') or the button below to create a ticket and click the \`Level Request\` option at the top and send a request`
				)}`,
				components: [new ActionRowBuilder<ButtonBuilder>().addComponents(refButton)]
			});
		}
	}
}
