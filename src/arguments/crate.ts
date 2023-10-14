import { DropRarityType } from '#lib/types/Data';
import { ApplyOptions } from '@sapphire/decorators';
import { Argument } from '@sapphire/framework';

@ApplyOptions<Argument.Options>({})
export class UserArgument extends Argument<DropRarityType> {
	public override run(parameter: string) {
		const input = parameter.toLowerCase();

		const legendaryCrateNames = ['leg', 'l', 'legend', 'legendary'];
		const mythicCrateNames = ['m', 'my', 'mythic', 'mythical'];
		const goldCrateNames = ['g', 'gold', 'golden'];
		const silverCrateNames = ['s', 'silv', 'silver'];
		const bronzeCrateNames = ['b', 'bronze'];

		if (legendaryCrateNames.includes(input)) return this.ok('legendary');
		if (mythicCrateNames.includes(input)) return this.ok('mythic');
		if (goldCrateNames.includes(input)) return this.ok('gold');
		if (silverCrateNames.includes(input)) return this.ok('silver');
		if (bronzeCrateNames.includes(input)) return this.ok('bronze');

		return this.error({
			identifier: 'InvalidCrate',
			message: 'Not a valid crate',
			parameter
		});
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		crate: DropRarityType | null;
	}
}
