import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { MessageSubcommandSuccessPayload, SubcommandPluginEvents } from '@sapphire/plugin-subcommands';
import { GuildMember } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: SubcommandPluginEvents.MessageSubcommandRun,
	enabled: false
})
export class UserListener extends Listener {
	public override async run(payload: MessageSubcommandSuccessPayload) {
		const { message, context } = payload;
		if (Reflect.get(Object(context), 'silent')) return;

		const commandName = payload.context.commandName;
		const member = message.member;

		if (commandName !== 'card') return;
		if (!member) return;

		this.updateCard(member);
	}

	private async getData(memberId: string) {
		const data = await this.container.db.userLevel.findUnique({
			where: {
				userId: memberId
			}
		});

		return data;
	}
	private async updateCard(member: GuildMember) {
		const data = await this.getData(member.id);
		if (!data) return;

		await this.container.leveling.setCardData(data);
	}
}
