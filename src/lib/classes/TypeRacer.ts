import { DugColors, TyperacerConfig } from '#constants';
import Words from '#lib/typerace-data/words';
import { GuildMessage } from '#lib/types/Discord';
import { seconds } from '#lib/util/common';
import { formatFailMessage } from '#lib/util/formatter';
import { sleep } from '@sapphire/utilities';
import { Collection, EmbedBuilder, Message, MessageCollector, MessageCreateOptions, Snowflake, User } from 'discord.js';
import { EventEmitter } from 'events';

export class TypeRacer extends EventEmitter {
	message: Message;
	lobbyTime: number = TyperacerConfig.LobbyTime;
	gameTime: number = TyperacerConfig.GameTime;
	started: boolean = false;
	ended: boolean = false;
	text: string = getRandomText('word');
	startedAt: Date = new Date();
	collector: MessageCollector;
	partipants: Collection<Snowflake, User> = new Collection();
	finished: Collection<Snowflake, Result> = new Collection();
	constructor(message: GuildMessage) {
		super();
		const filter = (m: Message) => {
			return this.partipants.some((u) => u.id === m.author.id) && !this.finished.some((u) => u.user.id === m.author.id) && this.started;
		};
		this.message = message;
		this.collector = message.channel.createMessageCollector({ filter, time: this.gameTime + this.lobbyTime });
		this.collector.on('collect', (msg) => {
			this.addResponse(msg);
		});
		this.collector.on('end', () => {
			this.finish();
		});
	}

	public async finish() {
		this.ended = true;
	}

	public async start() {
		if (this.started) return;
		if (this.partipants.size < 1) {
			TypeRacer.announce(this.message, formatFailMessage(`Not enough players to start the game.`));
			return;
		}
		// Ready to start
		let msg = await TypeRacer.announce(this.message, 'Get ready...');
		await sleep(seconds(1));
		msg.delete();
		msg = await TypeRacer.announce(this.message, 'Go!');
		this.emit('game:start');
		this.started = true;
	}

	private addResponse(message: Message) {
		if (message.content.length === 0) return;
		const timeTakenMS = new Date(Date.now() - this.startedAt.getTime()).getTime();
		const response = message.content;
		const { errors, str } = TypeRacer.compare(this.text, response);
		const accuracy = ((this.text.length - errors) / this.text.length) * 100;
		const wpm = calculateWPM(response.split(' ').length, timeTakenMS);

		const position = this.finished.size + 1;
		this.finished.set(message.author.id, {
			accuracy,
			timeTakenMS,
			user: message.author,
			wpm,
			errors,
			info: str
		});

		if (message.deletable) message.delete();
		TypeRacer.announce(message, {
			embeds: [
				new EmbedBuilder()
					.setColor(DugColors.Default)
					.setDescription(`Congrats! You finished at **#${position}**`)
					.addFields({
						name: 'Stats:',
						value: `Errors: ${errors}\nAccuracy: ${accuracy.toFixed(2)}%\nWPM: ${wpm.toFixed(2)}\n Time Taken: ${(
							timeTakenMS / 1000
						).toFixed(2)} seconds\n\n ${str}`
					})
			]
		});
	}

	static async announce(message: Message, announcement: MessageCreateOptions | string) {
		return await message.channel.send(announcement);
	}

	static compare(originalString: string, newString: string) {
		let str = '```css\n';
		let errors = 0;
		for (let i = 0; i < originalString.length; i++) {
			if (originalString[i] !== newString[i]) {
				str += `[${originalString[i]}]`;
				errors++;
				continue;
			}
			str += originalString[i];
		}
		str += '```';
		return {
			errors,
			str
		};
	}
}

function getRandomText(type: 'word' | 'sentence' = 'word') {
	if (type !== 'word') return '';
	const words = shuffleArray<string>(Words).slice(1, 15);
	return words.join(' ');
}

function shuffleArray<T>(array: Array<T>) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function calculateWPM(wordsTyped: number, timeTakenMS: number) {
	const minutes = timeTakenMS / (1000 * 60);
	return Math.round(wordsTyped / minutes);
}

type Result = {
	user: User;
	accuracy: number;
	wpm: number;
	timeTakenMS: number;
	errors: number;
	info: string;
};
