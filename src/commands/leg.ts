import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { GetLoot, LootTable, LootTableEntry } from 'loot-table-advanced';

@ApplyOptions<Command.Options>({
	description: 'A basic command'
})
export class UserCommand extends Command {
	public override async messageRun(message: Message) {
		const legendaryCrateLoot: LootTable = [
			LootTableEntry('coin', 50, 20, 100, 8, 1),
			LootTableEntry('sword', 10, 1, 1, 1, 2),
			LootTableEntry('gold', 20, 1, 5, 1, 2),
			LootTableEntry('silver', 30, 5, 10, 2, 2),
			LootTableEntry('diamond', 10, 1, 3, 1, 2),
			LootTableEntry('pearls', 5, 1, 5, 1, 2)
		];

		const loot = GetLoot(legendaryCrateLoot, 2);

		message.channel.send(JSON.stringify(loot, null, 2));
	}
}
