import { container } from '@sapphire/pieces';

export class GlobalNumberVariableClass {
	private static instance: GlobalNumberVariableClass;

	public Data = {
		GlobalBoost: 0.0
	};

	private constructor() {
		this.initVariables().then(() => {
			this.startUp();
		});
	} // Private constructor to prevent external instantiation

	public static getInstance(): GlobalNumberVariableClass {
		if (!GlobalNumberVariableClass.instance) {
			GlobalNumberVariableClass.instance = new GlobalNumberVariableClass();
		}

		return GlobalNumberVariableClass.instance;
	}

	private save() {
		for (const variable in this.Data) {
			console.log(Object.prototype.hasOwnProperty.call(this.Data, variable));
			if (Object.prototype.hasOwnProperty.call(this.Data, variable)) {
				const value = this.Data[variable as keyof typeof this.Data];
				container.db.globalVariable.upsert({
					where: {
						name: variable
					},
					create: {
						name: variable,
						value: value.toString(),
						type: typeof value
					},
					update: {
						value: value.toString(),
						type: typeof value
					}
				});
			}
		}
	}

	private async initVariables() {
		const variables = await container.db.globalVariable.findMany();
		console.log(variables);
		for (const variable of variables) {
			const name = variable.name as keyof typeof this.Data;
			if (this.Data[name] !== undefined) {
				this.Data[name] = Number(variable.value);
			}
		}
	}

	private startUp() {
		setInterval(() => {
			this.save();
			console.log('[NumberVariable] Saved Data');
		}, 60000);
	}
}

export class GlobalStringVariableClass {
	private static instance: GlobalStringVariableClass;

	public Data = {
		WelcomeMessage: ''
	};

	private constructor() {
		this.initVariables().then(() => {
			this.startUp();
		});
	} // Private constructor to prevent external instantiation

	public static getInstance(): GlobalStringVariableClass {
		if (!GlobalStringVariableClass.instance) {
			GlobalStringVariableClass.instance = new GlobalStringVariableClass();
		}

		return GlobalStringVariableClass.instance;
	}

	private save() {
		for (const variable in this.Data) {
			console.log(Object.prototype.hasOwnProperty.call(this.Data, variable));
			if (Object.prototype.hasOwnProperty.call(this.Data, variable)) {
				const value = this.Data[variable as keyof typeof this.Data];
				container.db.globalVariable.upsert({
					where: {
						name: variable
					},
					create: {
						name: variable,
						value: value.toString(),
						type: typeof value
					},
					update: {
						value: value.toString(),
						type: typeof value
					}
				});
			}
		}
	}

	private async initVariables() {
		const variables = await container.db.globalVariable.findMany();
		for (const variable of variables) {
			const name = variable.name as keyof typeof this.Data;
			if (this.Data[name] !== undefined) {
				this.Data[name] = String(variable.value);
			}
		}
	}

	private startUp() {
		setInterval(() => {
			this.save();
			console.log('[StringVariable] Saved Data');
		}, 60000);
	}
}

export enum GlobalVariablesNames {
	GlobalBoost = 'GlobalBoost',
	WelcomeMessage = 'WelcomeMessage'
}

export const Globals = { ...GlobalNumberVariableClass.getInstance().Data, ...GlobalStringVariableClass.getInstance().Data };
