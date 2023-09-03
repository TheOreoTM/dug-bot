import { GuildMessage } from '#lib/types/Discord';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, GuildMember } from 'discord.js';

@ApplyOptions<Precondition.Options>({
	position: 1
})
export class UserPrecondition extends Precondition {
	public override messageRun(message: GuildMessage, command: Command) {
		if (command.name === 'register') return this.ok();
		return this.check(message.member);
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		if (interaction.commandName === 'register') return this.ok();
		return this.check(interaction.member);
	}

	public override contextMenuRun(interaction: ContextMenuCommandInteraction<'cached'>) {
		if (interaction.commandName === 'register') return this.ok();
		return this.check(interaction.member);
	}

	private async check(member: GuildMember) {
		return (await this.container.db.user.isRegistered(member.id))
			? this.ok()
			: this.error({ message: 'You have to be registered to run commands', identifier: 'NotRegistered' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Registered: never;
	}
}
