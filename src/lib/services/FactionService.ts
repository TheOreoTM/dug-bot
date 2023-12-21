import { FactionListService } from '#lib/services/FactionListService';

export class FactionService {
	public constructor() {}

	get list() {
		return new FactionListService();
	}
}
