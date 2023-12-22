import { DugCommand } from '#lib/structures';
import { formatFailMessage, formatSuccessMessage } from '#lib/util/formatter';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<DugCommand.Options>({
	description: 'ADD',
	preconditions: ['EventManager']
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message, args: DugCommand.Args) {
		const cipherLevel = await args.pick('number');

		if (cipherLevel > 10 || cipherLevel < 0) {
			send(message, formatFailMessage('Cipher level should be greater than 0 and less than 10'));
			return;
		}
		await this.container.cipher.unlockCipher(cipherLevel);

		send(message, formatSuccessMessage(`Unlocked cipher \`#${cipherLevel}\``));
	}
}
