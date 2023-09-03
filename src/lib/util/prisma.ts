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
