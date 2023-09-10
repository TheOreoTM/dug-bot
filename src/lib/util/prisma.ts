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
			},
			async hasPendingInvite(userId: string, factionId: number) {
				const factionPendingMembers = (
					(await prisma.faction.findUnique({
						where: {
							id: factionId
						},
						select: {
							pendingMemberIds: true
						}
					})) ?? { pendingMemberIds: [] }
				).pendingMemberIds;

				return factionPendingMembers.includes(userId);
			}
		}
	}
});

export async function resetAutoIncrement() {
	try {
		await prisma.$queryRaw`
     SELECT setval('"User_idx_seq"', 1, false);
    `;

		console.log('Auto-increment sequence reset successfully.');
	} catch (error) {
		console.error('Error resetting auto-increment sequence:', error);
	} finally {
		await prisma.$disconnect();
	}
}
