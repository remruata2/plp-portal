-- Create SystemSetting table for admin-configurable system settings
CREATE TABLE IF NOT EXISTS "system_setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("id")
);

-- Create unique index on the key field
CREATE UNIQUE INDEX IF NOT EXISTS "system_setting_key_key" ON "system_setting"("key");

-- Insert default monthly submission deadline setting
INSERT INTO "system_setting" ("id", "key", "value", "created_at", "updated_at")
VALUES (
    gen_random_uuid(),
    'monthly_submission_deadline',
    '15',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT ("key") DO NOTHING;
