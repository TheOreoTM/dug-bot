import { WeeklyActiveRoleID } from '#constants';
import { DEFAULT_ROLE_COLOR, RANDOM_ROLE_COLORS } from '#lib/data/roleData';
import { DugCommand } from '#lib/structures';
import { randomItem } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<DugCommand.Options>({
	description: 'A basic command',
	requiredUserPermissions: ['Administrator'],
	flags: ['default']
})
export class UserCommand extends DugCommand {
	public override async messageRun(message: DugCommand.Message, args: DugCommand.Args) {
		const role = message.guild.roles.cache.get(WeeklyActiveRoleID);

		if (!role) return;

		const defaultFlag = args.getFlags('default');

		const currentHex = role.hexColor;
		let randomHex = DEFAULT_ROLE_COLOR;

		if (!defaultFlag) {
			randomHex = randomItem(RANDOM_ROLE_COLORS);

			while (randomHex === currentHex) {
				randomHex = randomItem(RANDOM_ROLE_COLORS);
			}
		}

		role.setColor(randomHex).catch(() => null);

		send(message, `Updated the weekly active role color to ${randomHex}`);
	}
}
