import { container } from '@sapphire/pieces';
import { CookieStore } from '@sapphire/plugin-api';

export class GlobalVariableClass {
	private static instance: GlobalVariableClass;

	public Data = {
		GlobalBoost: 0.0
	};

	private constructor() {
		this.initVariables().then(() => {
			this.startUp();
		});
	} // Private constructor to prevent external instantiation

	public static getInstance(): GlobalVariableClass {
		if (!GlobalVariableClass.instance) {
			GlobalVariableClass.instance = new GlobalVariableClass();
		}

		return GlobalVariableClass.instance;
	}

	private save() {
		for (const variable in this.Data) {
			console.log(Object.prototype.hasOwnProperty.call(this.Data, variable));
			if (Object.prototype.hasOwnProperty.call(this.Data, variable)) {
				const value = this.Data[variable as keyof typeof this.Data];
				container.db.globalVariable
					.upsert({
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
					})
					.then((d) => {
						console.log('Saved Variable:', d);
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
			console.log('Saved Data');
		}, 60000);
	}
}

export enum GlobalVariablesNames {
	GlobalBoost = 'GlobalBoost'
}

export const Globals = GlobalVariableClass.getInstance().Data;
