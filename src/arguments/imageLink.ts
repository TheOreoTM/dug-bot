import { isImageLink } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Argument } from '@sapphire/framework';

@ApplyOptions<Argument.Options>({})
export class UserArgument extends Argument<string> {
	public override run(parameter: string) {
		const valid = isImageLink(parameter);

		return valid ? this.ok(parameter) : this.error({ parameter, message: 'Please provide a valid image link', identifier: 'InvalidImageLink' });
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		imageLink: string;
	}
}
