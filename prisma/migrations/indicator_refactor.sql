-- Step 1: Create the new indicator table
CREATE TABLE "indicator" (
  "id" SERIAL PRIMARY KEY,
  "code" VARCHAR(50) UNIQUE,
  "name" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "type" VARCHAR(20) NOT NULL,
  "structure" JSONB,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Migrate data from field table to indicator table (as simple type)
INSERT INTO "indicator" ("code", "name", "description", "type", "created_at", "updated_at")
SELECT "code", "name", "description", 'simple', "created_at", "updated_at"
FROM "field";

-- Step 3: Migrate data from formula table to indicator table (as formula type)
INSERT INTO "indicator" ("code", "name", "description", "type", "structure", "created_at", "updated_at")
SELECT 
  COALESCE(
    (SELECT "code" FROM "field" WHERE "name" = "formula"."name"), 
    'F' || "formula"."id"
  ) as "code",
  "name", 
  "description", 
  'formula', 
  "structure", 
  "created_at", 
  "updated_at"
FROM "formula";

-- We'll keep the original tables for now and drop them after confirming the migration worked
