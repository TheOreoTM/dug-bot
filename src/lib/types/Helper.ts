export type LessThan<TNumber extends number, TArray extends any[] = []> = TNumber extends TArray['length']
	? TArray[number]
	: LessThan<TNumber, [...TArray, TArray['length']]>;

export type NumericRange<TStart extends number, TEnd extends number> =
	| Exclude<TEnd, LessThan<TStart, []>>
	| Exclude<LessThan<TEnd, []>, LessThan<TStart, []>>;
