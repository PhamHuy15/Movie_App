import { prisma } from '@/lib/prisma';

export async function saveUserPreferences(userId: string, genres: string[], countries: string[]) {
    return prisma.userPreference.upsert({
        where: { userId },
        update: { genres, countries },
        create: { userId, genres, countries },
    });
}

export async function getUserPreferences(userId: string) {
    return prisma.userPreference.findUnique({ where: { userId } });
}
