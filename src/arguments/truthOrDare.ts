import { ApplyOptions } from '@sapphire/decorators';
import { Argument } from '@sapphire/framework';

@ApplyOptions<Argument.Options>({})
export class UserArgument extends Argument<TruthOrDare> {
	public override run(parameter: string) {
		if (['truth', 'dare'].includes(parameter)) return this.ok(parameter as TruthOrDare);

		return this.error({ identifier: 'InvalidHexCode', message: 'Please provide a valid hex code (including the "#")', parameter });
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		truthOrDare: TruthOrDare;
	}
}

type TruthOrDare = 'truth' | 'dare';
