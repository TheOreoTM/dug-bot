export type TruthOrDare = {
	id: string;
	type: 'TRUTH' | 'DARE' | 'WYR';
	rating: Rating;
	question: string;
	translations: {
		bn: string;
		de: string;
		es: string;
		fr: string;
		hi: string;
		tl: string;
	};
};

export type Rating = 'PG' | 'PG13' | 'R';
