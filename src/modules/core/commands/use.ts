import { SendLogEmbed } from '#lib/classes';
import { BoostItems } from '#lib/items';
import { LevelUpItemValue, XpBoostItemValue } from '#lib/types/Data';
import { hours } from '#lib/util/common';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { getLevelInfo } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		const item = await args.pick('item');
		const invItems = await this.container.db.user.getInventory(message.author.id);
		const itemToUse = invItems.find((i) => i.value === item);
		if (!itemToUse) {
			send(message, formatFailMessage('You dont have that item'));
			return;
		}

		const dbItem = await this.container.db.item.findFirst({
			where: {
				ownerId: message.author.id,
				value: item
			}
		});

		if (!dbItem) {
			send(message, formatFailMessage('You dont have that item'));
			return;
		}

		await this.container.db.item.delete({
			where: {
				id: dbItem.id
			}
		});

		if (!itemToUse.usable) {
			send(message, formatFailMessage(`You cant use \` ${item} \``));
			return;
		}

		if (itemToUse.value.startsWith('levelUp')) {
			const itemValue = itemToUse.value as LevelUpItemValue;
			const itemData = BoostItems[itemValue];
			const levelsToAdd = itemData.amount;

			const currentLevel = await this.container.db.userLevel.getCurrentLevel(message.author.id);

			const levelData = getLevelInfo(currentLevel + levelsToAdd);
			const levelToSet = levelData.level;

			await this.container.db.userLevel.upsert({
				where: {
					userId: message.author.id
				},
				create: {
					userId: message.author.id,
					currentLevel: levelToSet,
					currentXp: 0,
					totalXp: levelData.totalXpOfCurrentLevel,
					requiredXp: levelData.xpNeededToLevelUp
				},
				update: {
					currentLevel: levelToSet,
					currentXp: 0,
					totalXp: levelData.totalXpOfCurrentLevel,
					requiredXp: levelData.xpNeededToLevelUp
				}
			});
			SendLogEmbed.LevelUp({ user: message.author, level: levelToSet, reason: `Used \`${itemValue}\`` });
		}

		if (itemToUse.value.startsWith('xpBoost')) {
			const itemValue = itemToUse.value as XpBoostItemValue;
			const itemData = BoostItems[itemValue];
			const xpBoostToAdd = itemData.amount;
			const expiresAt = new Date(Date.now() + (itemData.durationMs ?? hours(2)));

			await this.container.db.userLevel.addXpBoost(message.author.id, xpBoostToAdd, expiresAt);
			SendLogEmbed.AddXpBoost({ user: message.author, amount: xpBoostToAdd, expiresAt: expiresAt, reason: `Used \`${itemValue}\`` });
		}

		if (itemToUse.value.endsWith('Crate')) {
		}

		send(message, formatSuccessMessage(`Used \` ${itemToUse.name} \``));
	}
}
