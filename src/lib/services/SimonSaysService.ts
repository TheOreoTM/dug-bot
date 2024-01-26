import { ChannelIDs, DugColors } from '#constants';
import { minutes } from '#lib/util/common';
import { container } from '@sapphire/pieces';
import { sleep } from '@sapphire/utilities';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Collection,
	EmbedBuilder,
	Message,
	Snowflake,
	TextChannel,
	User,
	userMention
} from 'discord.js';

const LOBBY_DURATION = minutes(1.5);
const MIN_PLAYERS = 1;
const BASE_EMBED = new EmbedBuilder()
	.setColor(DugColors.Info)
	.setTitle('Sion Says')
	.setDescription(`This is an automated game of Sion Says. To join, click the button below.`);
const JOIN_BUTTON = new ButtonBuilder().setCustomId('@says/join').setLabel('Join Game').setStyle(ButtonStyle.Success);

export class SimonSaysService {
	public inProgress = false;

	private players: Collection<Snowflake, User> = new Collection();
	private controller: User | null = null;
	private channel: TextChannel = container.client.channels.cache.get(ChannelIDs.SionSaysChannel) as TextChannel;
	private message: Message | null = null;

	public constructor() {}

	public async startGame() {
		if (this.inProgress) {
			return;
		}
		this.resetGame();

		console.log('[SimonSaysService] Starting game...');

		const invitationEmbed = await this.channel.send({
			embeds: [BASE_EMBED],
			components: [new ActionRowBuilder<ButtonBuilder>().addComponents(JOIN_BUTTON)]
		});

		this.message = invitationEmbed;

		await sleep(LOBBY_DURATION);

		if (this.players.size < MIN_PLAYERS) {
			await invitationEmbed.delete();
			this.startGame();
			return;
		}

		let controller = this.getController();

		if (!controller) {
			this.setController();
			controller = this.getController();
		}

		if (!controller) {
			this.channel.send(`No controller found. Game cancelled.`);
			await invitationEmbed.delete();
			this.endGame();
			return;
		}

		this.inProgress = true;
		const startingEmbed = BASE_EMBED.setDescription(
			[
				`The simon is ${userMention(controller.id)} so make sure to follow their orders`,
				'',
				`**Simon:** Its up to ${userMention(controller.id)},
         to ask questions. You're the simon for this game. 
         You can eliminate players using \`.eliminate\` and you can see the list of remaining players using \`.remaining\`.`,
				'',
				`**Players:** You must answer the questions asked by the simon. If you answer incorrectly, you will be eliminated.`
			].join('\n')
		);

		await invitationEmbed.edit({
			embeds: [startingEmbed],
			components: []
		});

		this.channel.send(
			`There are ${this.players.size} players in the game. ${userMention(controller.id)} is the simon. And ${this.players
				.map((player) => userMention(player.id))
				.join(', ')} are the players.`
		);
	}

	private resetGame() {
		this.inProgress = false;
		this.players.clear();
		this.controller = null;
		this.message = null;
	}

	public async endGame() {
		const channel = this.getChannel();

		await channel.send(`Game ended. Thanks for playing!`);

		// send embed again and start game again

		await sleep(minutes(0.5));

		this.startGame();
	}

	public addPlayer(user: User) {
		this.players.set(user.id, user);

		const message = this.message;
		if (!message) return;
	}

	public removePlayer(userId: Snowflake) {
		this.players.delete(userId);
	}

	public getPlayers() {
		return this.players;
	}

	public async eliminatePlayer(userId: Snowflake) {
		const channel = this.getChannel();

		this.players.delete(userId);

		channel.send(`You have been eliminated ${userMention(userId)}! ${this.players.size} players remain.`);

		if (this.players.size === 1) {
			channel.send(`Congratulations ${userMention(this.players.first()!.id)}! You won the game!`);
			this.endGame();
			return;
		}

		if (this.players.size === 0) {
			this.endGame();
			return;
		}
	}

	private getController() {
		return this.controller;
	}

	private setController() {
		const randomUser = this.players.random();

		if (!randomUser) {
			return;
		}

		this.controller = randomUser;
		this.players.delete(randomUser.id);
	}

	private getChannel() {
		return this.channel;
	}
}
