import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const xprisma = new PrismaClient().$extends({
	name: 'xprisma',
	model: {
		user: {
			async isRegistered(userId: string) {
				const user = await prisma.user.findUnique({
					where: {
						id: userId
					}
				});

				return user ? true : false;
			},
			async register(userId: string) {
				return await prisma.user.upsert({
					where: {
						id: userId
					},
					create: {
						id: userId
					},
					update: {
						id: userId
					}
				});
			},
			async getUser(userId: string) {
				return await prisma.user.findUnique({
					where: {
						id: userId
					}
				});
			}
		}
	}
});

export async function resetAutoIncrement() {
	try {
		const result: any = await prisma.$queryRaw`
      SELECT MAX(idx) FROM "User";
    `;

		const currentMaxId = result[0].max;

		await prisma.$queryRaw`
      SELECT setval('"User_idx_seq"', ${currentMaxId + 1});
    `;

		console.log('Auto-increment sequence reset successfully.');
	} catch (error) {
		console.error('Error resetting auto-increment sequence:', error);
	} finally {
		await prisma.$disconnect();
	}
}
