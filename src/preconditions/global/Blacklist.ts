import { ApplyOptions } from '@sapphire/decorators';
import { AllFlowsPrecondition, Precondition } from '@sapphire/framework';
import { ChatInputCommandInteraction, ContextMenuCommandInteraction } from 'discord.js';
@ApplyOptions<Precondition.Options>({
	position: 2
})
export class UserPrecondition extends Precondition {
	public override async messageRun(...[message]: Parameters<AllFlowsPrecondition['messageRun']>) {
		return this.isBlacklisted(message.author.id);
	}

	public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		return this.isBlacklisted(interaction.member.id);
	}

	public override async contextMenuRun(interaction: ContextMenuCommandInteraction<'cached'>) {
		return this.isBlacklisted(interaction.member.id);
	}

	private async isBlacklisted(id: string | null) {
		if (!id) return this.ok();

		const blacklisted = await this.container.blacklist.isBlacklisted(id);

		return blacklisted ? this.error({ context: { silent: true } }) : this.ok();
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Blacklisted: never;
	}
}
