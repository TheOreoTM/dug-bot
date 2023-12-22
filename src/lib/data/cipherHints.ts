export const CIPHER_HINTS: Readonly<Record<CipherLevel, CipherHint>> = {
	CIPHER_1: {
		DESCRIPTION: 'The Old Newspapers',
		MINOR: 'Doors are not the only things that are knocked.',
		MEDIUM: 'There is another term used for knocking.',
		MAJOR: 'Prisoners communicate with each other using fun methods.'
	}
} as const;

type CipherHint = {
	DESCRIPTION: string;
	MINOR: string;
	MEDIUM: string;
	MAJOR: string;
};

export type CipherLevel = `CIPHER_${string}`;
