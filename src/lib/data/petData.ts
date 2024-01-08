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
