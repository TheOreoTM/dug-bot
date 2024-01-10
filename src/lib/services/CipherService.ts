import { ChannelIDs, DugColors, DugEmojis } from '#constants';
import { cipherCacheKey, cipherPurchasesCacheKey } from '#lib/database/keys';
import { fetchChannel } from '#lib/util/utils';
import { container } from '@sapphire/pieces';
import { isNullish } from '@sapphire/utilities';
import { EmbedBuilder, TextChannel } from 'discord.js';

export class CipherService {
	private readonly hintsKey = cipherCacheKey;
	private readonly purchasesKey = cipherPurchasesCacheKey;
	private readonly cache = container.cache;

	public async getBoughtHints(userId: string, level: number) {
		const key = this.purchasesKey(userId, level);
		const cachedData = await this.cache.get(key);
		if (isNullish(cachedData) || cachedData === '{}') {
			return [];
		}
		const data = JSON.parse(cachedData) as number[];
		return data;
	}

	public async buyHint(userId: string, level: number, hint: 0 | 1 | 2) {
		const key = this.purchasesKey(userId, level);
		const oldCachedData = await this.getBoughtHints(userId, level);
		const boughtHints = new Set(oldCachedData);
		if (boughtHints.has(hint)) return;
		boughtHints.add(hint);

		this.cache.set(key, JSON.stringify(Array.from(boughtHints)));
	}

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
		await this.cache.set(this.hintsKey, JSON.stringify(arr));
	}

	public async __getUnlockedList() {
		const currentUnlockedList: Array<number> = JSON.parse((await this.cache.get(this.hintsKey)) ?? '[]');
		return currentUnlockedList;
	}

	public async getUnlockedSet() {
		const currentUnlockedList: Array<number> = JSON.parse((await this.cache.get(this.hintsKey)) ?? '[]');
		return new Set(currentUnlockedList);
	}
}
