/**
 * Prisma client singleton (optional — only active when DATABASE_URL is set).
 *
 * The app works fully without a database, using localStorage for history.
 * To enable DB: set DATABASE_URL in .env.local and run `npm run db:push`.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prisma: any = null;

export function isDatabaseEnabled(): boolean {
  return !!process.env.DATABASE_URL;
}

export async function getPrisma() {
  if (!isDatabaseEnabled()) return null;
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient({ log: [] });
    return prisma;
  } catch {
    // Prisma client not generated yet — run `npm run db:generate`
    return null;
  }
}

export { prisma };
