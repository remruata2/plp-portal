-- AlterTable
ALTER TABLE "field_value" ADD COLUMN     "is_override" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "override_reason" VARCHAR(200);

-- CreateTable
CREATE TABLE "facility_field_defaults" (
    "id" SERIAL NOT NULL,
    "field_id" INTEGER NOT NULL,
    "facility_id" INTEGER NOT NULL,
    "string_value" VARCHAR(500),
    "numeric_value" DECIMAL(15,2),
    "boolean_value" BOOLEAN,
    "json_value" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facility_field_defaults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facility_field_defaults_field_id_facility_id_key" ON "facility_field_defaults"("field_id", "facility_id");

-- AddForeignKey
ALTER TABLE "facility_field_defaults" ADD CONSTRAINT "facility_field_defaults_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_field_defaults" ADD CONSTRAINT "facility_field_defaults_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
