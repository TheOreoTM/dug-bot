import { DugEvents } from '#constants';
import { GuildMessage } from '#lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({ event: DugEvents.MessageCreate })
export class UserEvent extends Listener {
	public override async run(message: GuildMessage) {
		if (message.content === '' || message.author.bot) return;
		const member = message.member;
		const shouldAddXP = await this.container.db.userLevel.shouldAddXP(member.id);
		console.log('🚀 ~ file: leveling.ts:12 ~ UserEvent ~ overriderun ~ shouldAddXP:', shouldAddXP);
		if (!shouldAddXP) return;
		await this.container.db.userLevel.addXp(member.id);

		const data = await this.container.db.userLevel.findUnique({
			where: {
				userId: member.id
			}
		});

		message.channel.send({
			content: `\`\`\`json\n${JSON.stringify(data, null, 2)}\`\`\``
		});
	}
}
