import { type ItemValue } from '#lib/types/Data';
import { isItemValue } from '#lib/util/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Argument } from '@sapphire/framework';

@ApplyOptions<Argument.Options>({})
export class UserArgument extends Argument<ItemValue> {
	public override run(parameter: string) {
		const itemValue = isItemValue(parameter, false);
		return itemValue ? this.ok(itemValue) : this.error({ parameter, identifier: 'InvalidItem', message: 'Please provide a valid item' });
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		item: ItemValue;
	}
}
