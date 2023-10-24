import { DugEvents } from '#constants';
import { BaseDropType } from '#lib/types/Drops';
import { container } from '@sapphire/framework';

export class BaseDropManager<T extends BaseDropType> {
	protected static instance: BaseDropManager<any>;
	protected dropsAvailable: Record<string, T> = {};
	private allowDrop: boolean = true;

	protected constructor(dropsAvailable: Record<string, T>) {
		this.dropsAvailable = dropsAvailable;
	}

	public static getInstance(dropsAvailable: Record<string, any>): BaseDropManager<any> {
		if (!BaseDropManager.instance) {
			BaseDropManager.instance = new BaseDropManager(dropsAvailable);
		}
		return BaseDropManager.instance;
	}

	public setAllowDrop(shouldAllowDrop: boolean) {
		this.allowDrop = shouldAllowDrop;
		return this;
	}

	public performDropLogic() {
		if (!this.allowDrop) return;
		const randomDrop = this.getRandomDrop();
		if (!randomDrop) return;

		this.triggerDrop(randomDrop.id, randomDrop);
		return this;
	}

	public triggerDrop(id: string, drop: T) {
		container.client.emit<T>(DugEvents.TriggerDrop, id, drop);
		this.allowDrop = false;
		return this;
	}

	get availableDrops() {
		return this.dropsAvailable;
	}

	private getRandomDrop(): (T & { id: string }) | null {
		const totalWeight = Object.values(this.dropsAvailable).reduce((acc, drop) => acc + drop.weight, 0);
		if (totalWeight === 0) return null;

		let randomWeight = Math.random() * totalWeight;

		for (const dropName in this.dropsAvailable) {
			if (Object.prototype.hasOwnProperty.call(this.dropsAvailable, dropName)) {
				const drop = this.dropsAvailable[dropName];
				randomWeight -= drop.weight;
				if (randomWeight <= 0) {
					return {
						...drop,
						id: dropName
					};
				}
			}
		}
		return null;
	}
}
