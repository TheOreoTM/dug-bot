import { DugEvents } from '#constants';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
	event: DugEvents.MessageDelete
})
export class UserEvent extends Listener {
	public run(message: Message) {
		if (message.partial || message.guild === null || message.author.bot) return;
		this.container.client.emit(DugEvents.GuildMessageDelete, message);
	}
}
