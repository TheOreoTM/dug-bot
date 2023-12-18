import { EventConfig } from '#constants';
import { GuildMessage } from '#lib/types/Discord';
import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, GuildMember } from 'discord.js';

export class UserPrecondition extends Precondition {
	public override messageRun(message: GuildMessage) {
		return this.check(message.member);
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		return this.check(interaction.member);
	}

	public override contextMenuRun(interaction: ContextMenuCommandInteraction<'cached'>) {
		return this.check(interaction.member);
	}

	private async check(member: GuildMember) {
		return member.roles.cache.has(EventConfig.EventManager) ? this.ok() : this.error({ context: { silent: true } });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		EventManager: never;
	}
}
