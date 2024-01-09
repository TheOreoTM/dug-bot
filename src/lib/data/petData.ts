import { PetData } from '#lib/types';

// Define an array of pets with names and stats
export const PET_DATA: PetData[] = [
	{
		id: 1,
		names: ['Gir'],
		baseStats: {
			hp: 100,
			atk: 125,
			def: 106,
			spd: 120
		}
	},
	{
		id: 2,
		names: ['MiMi'],
		baseStats: {
			hp: 95,
			atk: 110,
			def: 88,
			spd: 100
		}
	},
	{
		id: 3,
		names: ['Pig'],
		baseStats: {
			hp: 56,
			atk: 80,
			def: 56,
			spd: 61
		}
	},
	{
		id: 4,
		names: ['Minimoose'],
		baseStats: {
			hp: 44,
			atk: 65,
			def: 48,
			spd: 66
		}
	}
] as const;

export const PET_EMOJIS: Record<number, string> = {
	1: '1133333533218328616', // gir
	2: '1133331310367232001', // mimi
	3: '1133333593905696798', // pig
	4: '1133335432877314078' // minimoose
};

export const NATURES = [
	'Adamant',
	'Bold',
	'Brave',
	'Calm',
	'Gentle',
	'Hardy',
	'Hasty',
	'Impish',
	'Jolly',
	'Lax',
	'Lonely',
	'Mild',
	'Modest',
	'Naive',
	'Naughty',
	'Quiet',
	'Relaxed',
	'Sassy',
	'Timid'
] as const;

export const NATURE_MULTIPLIERS: Record<string, { hp: number; atk: number; def: number; spd: number }> = {
	Hardy: {
		hp: 1,
		atk: 1,
		def: 1,
		spd: 1
	},
	Lonely: {
		hp: 1,
		atk: 1.1,
		def: 0.9,
		spd: 1
	},
	Brave: {
		hp: 1,
		atk: 1.1,
		def: 1,
		spd: 0.9
	},
	Adamant: {
		hp: 1,
		atk: 1.1,
		def: 1,
		spd: 1
	},
	Naughty: {
		hp: 1,
		atk: 1.1,
		def: 1,
		spd: 1
	},
	Bold: {
		hp: 1,
		atk: 0.9,
		def: 1.1,
		spd: 1
	},
	Relaxed: {
		hp: 1,
		atk: 1,
		def: 1.1,
		spd: 0.9
	},
	Impish: {
		hp: 1,
		atk: 1,
		def: 1.1,
		spd: 1
	},
	Lax: {
		hp: 1,
		atk: 1,
		def: 1.1,
		spd: 1
	},
	Timid: {
		hp: 1,
		atk: 0.9,
		def: 1,
		spd: 1.1
	},
	Hasty: {
		hp: 1,
		atk: 1,
		def: 0.9,
		spd: 1.1
	},
	Jolly: {
		hp: 1,
		atk: 1,
		def: 1,
		spd: 1.1
	},
	Naive: {
		hp: 1,
		atk: 1,
		def: 1,
		spd: 1.1
	},
	Modest: {
		hp: 1,
		atk: 0.9,
		def: 1,
		spd: 1
	},
	Mild: {
		hp: 1,
		atk: 1,
		def: 0.9,
		spd: 1
	},
	Quiet: {
		hp: 1,
		atk: 1,
		def: 1,
		spd: 0.9
	},
	Calm: {
		hp: 1,
		atk: 0.9,
		def: 1,
		spd: 1
	},
	Gentle: {
		hp: 1,
		atk: 1,
		def: 0.9,
		spd: 1
	},
	Sassy: {
		hp: 1,
		atk: 1,
		def: 1,
		spd: 0.9
	}
};
