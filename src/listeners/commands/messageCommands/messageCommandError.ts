import { DugColors } from '#constants';
import { formatRoles } from '#lib/util/formatter';
import { sendTemporaryMessage } from '#lib/util/messages';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, type MessageCommandErrorPayload, UserError, Events, ArgumentError } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: Events.MessageCommandError
})
export class UserListener extends Listener {
	public override async run(error: UserError, { message }: MessageCommandErrorPayload) {
		let content = '';
		if (error instanceof UserError || ArgumentError) {
			if (Reflect.get(Object(error.context), 'silent')) return;

			if (error.identifier === 'NotRegistered') {
				content = `Please register your account using \`${await this.container.client.fetchPrefix(message)}register\``;
			} else if (error.identifier === 'argsMissing') {
				content = `You are missing some arguments`;
			} else if (error.identifier === 'argsUnavailable') {
				content = `Some arguments arent available`;
			} else if (error.identifier === 'preconditionGuildOnly') {
				content = `This command can only run in guilds`;
			} else if (error.identifier === 'preconditionNsfw') {
				content = `This command can only be used in NSFW channels`;
			} else if (error.identifier === 'preconditionUserPermissions') {
				const { missing } = error.context as { missing: [] };
				content = `You need \`${formatRoles(missing).join('` `')}\` permission${missing.length - 1 === 0 ? '' : '(s)'} to run this command`;
			} else {
				return await sendTemporaryMessage(message, {
					embeds: [
						new EmbedBuilder()
							.setColor(DugColors.Fail)
							.setDescription(content === '' ? error.message : content)
							.setTitle(error.identifier ?? 'Error')
					]
				});
			}

			return await sendTemporaryMessage(message, {
				embeds: [new EmbedBuilder().setDescription(content === '' ? error.message : content).setTitle(error.identifier ?? 'Error')]
			});
		}
		return undefined;
	}
}
