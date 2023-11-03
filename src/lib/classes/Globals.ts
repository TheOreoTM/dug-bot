export class GlobalVariableClass {
	private static instance: GlobalVariableClass;

	public GlobalBoost: number = 0.5;

	private constructor() {} // Private constructor to prevent external instantiation

	public static getInstance(): GlobalVariableClass {
		if (!GlobalVariableClass.instance) {
			GlobalVariableClass.instance = new GlobalVariableClass();
		}

		return GlobalVariableClass.instance;
	}
}
