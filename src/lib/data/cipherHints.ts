export const CIPHER_DATA: Readonly<Record<CipherLevel, CipherData>> = {
	CIPHER_1: {
		DESCRIPTION: 'The Old Newspapers',
		MINOR: 'Doors are not the only things that are knocked.',
		MEDIUM: 'There is another term used for knocking.',
		MAJOR: 'Prisoners communicate with each other using fun methods.'
	},
	CIPHER_2: {
		DESCRIPTION: 'The Ad Book',
		MAJOR: 'The numbers are not related but their answers are related, you can not find one without solving other.',
		MEDIUM: 'A = 0',
		MINOR: 'The books know it all '
	}
} as const;

export type CipherData = {
	DESCRIPTION: string;
	MINOR: string;
	MEDIUM: string;
	MAJOR: string;
};

export type CipherLevel = `CIPHER_${number}`;
