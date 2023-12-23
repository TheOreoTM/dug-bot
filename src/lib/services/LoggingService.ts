import { MessageCreateOptions, WebhookClient } from 'discord.js';

export class LoggingService {
	public constructor() {}

	public async sendLog(url: string, message: MessageCreateOptions) {
		const webhook = new WebhookClient({ url });
		webhook
			.send({ ...message, avatarURL: 'https://cdn.discordapp.com/avatars/767781855193464882/75ff8af1c4b84ab9b76efc00a60480d5.webp' })
			.catch(() => null);
	}
}
