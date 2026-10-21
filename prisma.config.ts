import "dotenv/config"
import { defineConfig } from "prisma/config"

const databaseUrl = process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? process.env.PRISMA_DATABASE_URL ?? "postgresql://voxa:voxa@localhost:5432/voxa"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: databaseUrl },
})
