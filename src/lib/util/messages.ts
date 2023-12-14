import { InteractionReplyOptions, InteractionResponse, MessageCreateOptions } from 'discord.js';
import { Message } from 'discord.js';
import { seconds } from '#utils/common';
import { send } from '@sapphire/plugin-editable-commands';
import { sleep } from '@sapphire/utilities';
import { InteractionOrMessage } from '#lib/types';

export function sendInteractionOrMessage(
	interactionOrMessage: InteractionOrMessage,
	messageOptions: string | MessageCreateOptions | InteractionReplyOptions
): Promise<Message<boolean>> | Promise<InteractionResponse<true>> {
	// Use TypeScript type checking to handle different cases
	if (interactionOrMessage instanceof Message) {
		// If it's a message, use send function with MessageCreateOptions
		return send(interactionOrMessage, messageOptions as MessageCreateOptions | string);
	} else {
		// If it's an interaction, use reply function with InteractionReplyOptions
		return interactionOrMessage.reply(messageOptions as InteractionReplyOptions | string);
	}
}

async function deleteMessageImmediately(message: Message): Promise<Message> {
	return (message.deletable ? await message.delete().catch(() => null) : message) ?? message;
}

/**
 * Deletes a message, skipping if it was already deleted, and aborting if a non-zero timer was set and the message was
 * either deleted or edited.
 *
 * This also ignores the `UnknownMessage` error code.
 * @param message The message to delete.
 * @param time The amount of time, defaults to 0.
 * @returns The deleted message.
 */
export async function deleteMessage(message: Message, time = 0): Promise<Message> {
	if (!message.deletable) return message;
	if (time === 0) return deleteMessageImmediately(message);

	const lastEditedTimestamp = message.editedTimestamp;
	await sleep(time);

	// If it was deleted or edited, cancel:
	if (!message.deletable || message.editedTimestamp !== lastEditedTimestamp) {
		return message;
	}

	return deleteMessageImmediately(message);
}

/**
 * Sends a temporary editable message and then floats a {@link deleteMessage} with the given `timer`.
 * @param message The message to reply to.
 * @param options The options to be sent to the channel.
 * @param timer The timer in which the message should be deleted, using {@link deleteMessage}.
 * @returns The response message.
 */
export async function sendTemporaryMessage(message: Message, options: string | MessageCreateOptions, timer = seconds(7)): Promise<Message> {
	if (typeof options === 'string') options = { content: options };

	const response = (await send(message, options)) as Message;
	await deleteMessage(response, timer);
	return response;
}
