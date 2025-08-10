-- AlterTable
ALTER TABLE "facility_type" ADD COLUMN     "display_name" VARCHAR(200);

-- CreateTable
CREATE TABLE "facility_field_mapping" (
    "id" SERIAL NOT NULL,
    "facility_type_id" INTEGER NOT NULL,
    "field_id" INTEGER NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facility_field_mapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facility_field_mapping_facility_type_id_field_id_key" ON "facility_field_mapping"("facility_type_id", "field_id");

-- AddForeignKey
ALTER TABLE "facility_field_mapping" ADD CONSTRAINT "facility_field_mapping_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_field_mapping" ADD CONSTRAINT "facility_field_mapping_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
