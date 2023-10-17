import { ApplyOptions } from '@sapphire/decorators';
import { Argument } from '@sapphire/framework';
import { HexColorString } from 'discord.js';

@ApplyOptions<Argument.Options>({})
export class UserArgument extends Argument<HexColorString> {
	public override run(parameter: string) {
		const hexCodeRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
		const valid = hexCodeRegex.test(parameter);

		return valid
			? this.ok(parameter as HexColorString)
			: this.error({ identifier: 'InvalidHexCode', message: 'Please provide a valid hex code (including the "#")', parameter });
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		hexCode: HexColorString;
	}
}
