import { InventoryItemType } from '#lib/types/Data';
import { PrismaClient } from '@prisma/client';
import { genRandomXp, getLevelInfo } from '#utils/utils';
const prisma = new PrismaClient();

export const xprisma = new PrismaClient().$extends({
	name: 'xprisma',
	model: {
		userLevel: {
			async shouldAddXP(userId: string) {
				const data = await prisma.userLevel.findUnique({
					where: {
						userId
					}
				});
				if (!data) return true;
				const now = new Date();
				const lastXpEarned = new Date(data.lastXpEarned);

				// Calculate the time difference in milliseconds
				const millisecondsSinceLastXp = now.getTime() - lastXpEarned.getTime();
				const secondsSinceLastXp = Math.floor(millisecondsSinceLastXp / 1000);

				// Check if it's been more than 45 seconds since last XP earned
				if (secondsSinceLastXp > 45) {
					return true;
				}

				return false;
			},

			async getRequiredXp(userId: string) {
				const data = await prisma.userLevel.findUnique({
					where: {
						userId
					}
				});

				return data?.requiredXp ? data.requiredXp : 100;
			},
			async getCurrentLevel(userId: string) {
				const data = await prisma.userLevel.findUnique({
					where: {
						userId
					}
				});

				return data?.currentLevel ? data.currentLevel : 0;
			},

			async getTotalXp(userId: string) {
				const data = await prisma.userLevel.findUnique({
					where: {
						userId
					}
				});

				return data?.totalXp ? data.totalXp : 0;
			},
			async getCurrentXp(userId: string) {
				const data = await prisma.userLevel.findUnique({
					where: {
						userId
					}
				});

				return data?.currentXp ? data.currentXp : 0;
			},

			async addXp(userId: string, amount?: number) {
				if (!amount) amount = genRandomXp();

				const data = await prisma.userLevel.upsert({
					where: {
						userId
					},
					update: {
						currentXp: {
							increment: amount
						},
						totalXp: {
							increment: amount
						}
					},
					create: {
						currentXp: amount,
						totalXp: amount,
						userId
					}
				});

				if (data.currentXp >= data.requiredXp) {
					let levelsToAdd = 0;
					let requiredXp = data.requiredXp;
					let currentXp = data.currentXp;
					while (data.currentXp >= requiredXp) {
						currentXp -= requiredXp;
						levelsToAdd++;

						requiredXp = getLevelInfo(data.currentLevel + levelsToAdd).xpNeededToLevelUp;
					}

					await prisma.userLevel.update({
						where: {
							userId
						},
						data: {
							currentLevel: {
								increment: levelsToAdd
							}
						}
					});
				}
			}
		},
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
			/**
			 * Get a user that is expected to be registered
			 * @param userId The is of the user you want to get
			 * @returns A non-null user object
			 */
			async getUser(userId: string) {
				return (await prisma.user.findUnique({
					where: {
						id: userId
					}
				})!)!;
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
			},
			async getInventory(userId: string) {
				const items = await prisma.item.findMany({
					where: {
						ownerId: userId
					}
				});

				return items as InventoryItemType[];
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
