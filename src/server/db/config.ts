import "server-only"

/** Supports the names supplied by Vercel Postgres and Prisma deployments. */
export function getDatabaseUrl() {
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? process.env.PRISMA_DATABASE_URL
  if (!url) throw new Error("A PostgreSQL connection URL is required.")
  return url
}
