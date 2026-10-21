CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

CREATE TABLE "roles" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "key" TEXT NOT NULL, "name" TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '', "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "permissions" ("id" UUID NOT NULL DEFAULT gen_random_uuid(), "key" TEXT NOT NULL, "description" TEXT NOT NULL DEFAULT '', CONSTRAINT "permissions_pkey" PRIMARY KEY ("id"));
CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "phone_e164" TEXT NOT NULL, "full_name" TEXT NOT NULL,
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, "last_login_at" TIMESTAMPTZ(6),
  CONSTRAINT "users_pkey" PRIMARY KEY ("id"), CONSTRAINT "users_phone_e164_format" CHECK ("phone_e164" ~ '^\\+[1-9][0-9]{7,14}$')
);
CREATE TABLE "role_permissions" ("role_id" UUID NOT NULL, "permission_id" UUID NOT NULL, CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id"));
CREATE TABLE "user_roles" ("user_id" UUID NOT NULL, "role_id" UUID NOT NULL, CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id"));
CREATE TABLE "otp_challenges" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "phone_e164" TEXT NOT NULL, "code_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMPTZ(6) NOT NULL, "consumed_at" TIMESTAMPTZ(6), "attempts" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "otp_challenges_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "otp_challenges_attempts_check" CHECK ("attempts" >= 0 AND "attempts" <= 5)
);
CREATE TABLE "sessions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(), "user_id" UUID NOT NULL, "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMPTZ(6) NOT NULL, "revoked_at" TIMESTAMPTZ(6), "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "roles_key_key" ON "roles"("key");
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");
CREATE UNIQUE INDEX "users_phone_e164_key" ON "users"("phone_e164");
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");
CREATE INDEX "otp_challenges_phone_e164_expires_at_idx" ON "otp_challenges"("phone_e164", "expires_at");
CREATE INDEX "sessions_user_id_expires_at_idx" ON "sessions"("user_id", "expires_at");
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
