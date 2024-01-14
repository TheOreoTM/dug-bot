import { container } from '@sapphire/pieces';

export class BlacklistService {
	private readonly db = container.db;
	public constructor() {}

	public async add(userId: string, reason: string) {
		const response = await this.db.blacklist.upsert({
			where: {
				userId
			},
			create: {
				userId,
				reason
			},
			update: {
				userId,
				reason
			}
		});

		return response;
	}

	public async isBlacklisted(userId: string) {
		const exists = await this.db.blacklist.findUnique({ where: { userId } });
		console.log('🚀 ~ BlacklistService ~ isBlacklisted ~ exists:', exists);
		return Boolean(exists);
	}

	public async remove(userId: string) {
		const response = await this.db.blacklist.delete({ where: { userId } });
		return response;
	}
}
