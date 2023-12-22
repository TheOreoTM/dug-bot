import { ChannelIDs, DugColors, DugEmojis } from '#constants';
import { cipherCacheKey } from '#lib/database/keys';
import { fetchChannel } from '#lib/util/utils';
import { container } from '@sapphire/pieces';
import { EmbedBuilder, TextChannel } from 'discord.js';

export class CipherService {
	private readonly key = cipherCacheKey;
	private readonly cache = container.cache;

	public async unlockCipher(level: number) {
		const currentUnlockedSet = await this.getUnlockedSet();
		if (currentUnlockedSet.has(level)) return;

		currentUnlockedSet.add(level);

		await this.setUnlockedList(currentUnlockedSet);

		const updatesChannel = await fetchChannel<TextChannel>(ChannelIDs.UpdatesChannel);
		if (!updatesChannel) return;

		await updatesChannel.send({
			embeds: [new EmbedBuilder().setColor(DugColors.Info).setDescription(`${DugEmojis.On} Cipher \`#${level}\` has been unlocked`)]
		});
	}

	public async setUnlockedList(newSet: Set<number>) {
		const arr = Array.from(newSet);
		await this.cache.set(this.key, JSON.stringify(arr));
	}

	public async __getUnlockedList() {
		const currentUnlockedList: Array<number> = JSON.parse((await this.cache.get(this.key)) ?? '[]');
		return currentUnlockedList;
	}

	public async getUnlockedSet() {
		const currentUnlockedList: Array<number> = JSON.parse((await this.cache.get(this.key)) ?? '[]');
		return new Set(currentUnlockedList);
	}
}
