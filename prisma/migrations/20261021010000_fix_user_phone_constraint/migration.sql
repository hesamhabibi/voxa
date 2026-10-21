ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_phone_e164_format";

ALTER TABLE "users"
  ADD CONSTRAINT "users_phone_e164_format"
  CHECK ("phone_e164" ~ '^\+[1-9][0-9]{7,14}$');
