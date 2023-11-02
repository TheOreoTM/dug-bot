import { seconds } from '#lib/util/common';
import { formatFailMessage } from '#lib/util/formatter';
import { sendTemporaryMessage } from '#lib/util/messages';
import { DurationFormatter } from '@sapphire/duration';
import type { Events, MessageCommandDeniedPayload } from '@sapphire/framework';
import { Identifiers, Listener, type UserError } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const cooldownMessageCooldown = new Set();
export class UserEvent extends Listener<typeof Events.MessageCommandDenied> {
	public override async run({ context, message: content, identifier }: UserError, { message }: MessageCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;
		if (identifier === 'NotRegistered') {
			const registerButton = new ButtonBuilder().setCustomId('register').setLabel('Register').setStyle(ButtonStyle.Secondary);
			send(message, {
				content: formatFailMessage(content),
				components: [new ActionRowBuilder<ButtonBuilder>().addComponents(registerButton)],
				allowedMentions: { users: [message.author.id], roles: [] }
			});
		}
		if (identifier === Identifiers.PreconditionCooldown) {
			let send = !cooldownMessageCooldown.has(message.author.id);
			const { remaining } = context as { remaining: number };
			const formattedTime = new DurationFormatter().format(remaining);
			if (send) {
				cooldownMessageCooldown.add(message.author.id);
				await sendTemporaryMessage(
					message,
					{
						content: `${message.author}, a little too quick there. Wait ${formattedTime ?? '1 second'}`
					},
					seconds(7)
				);

				setTimeout(() => cooldownMessageCooldown.delete(message.author.id), seconds(5));
			}
			return;
		}

		sendTemporaryMessage(message, { content: formatFailMessage(content), allowedMentions: { users: [message.author.id], roles: [] } });
	}
}
