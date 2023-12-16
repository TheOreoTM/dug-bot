import { PermissionsPrecondition } from '#lib/structures';
import type { InteractionOrMessage } from '#lib/types';
import { PermissionFlagsBits } from 'discord.js';

export class UserPermissionsPrecondition extends PermissionsPrecondition {
	public override async handle(iom: InteractionOrMessage): PermissionsPrecondition.AsyncResult {
		const allowed = iom.member.permissions.has(PermissionFlagsBits.Administrator);

		return allowed
			? this.ok()
			: this.error({
					identifier: `staffError`,
					message: `This command is only for admins`
			  });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Administrator: never;
	}
}
