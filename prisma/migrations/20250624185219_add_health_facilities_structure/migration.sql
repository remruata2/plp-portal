-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "nin" VARCHAR(50),
    "can_have_subcentres" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facility_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(50),
    "district_id" INTEGER NOT NULL,
    "facility_type_id" INTEGER NOT NULL,
    "address" TEXT,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "bed_capacity" INTEGER,
    "staff_count" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_centre" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(50),
    "facility_id" INTEGER NOT NULL,
    "address" TEXT,
    "phone" VARCHAR(20),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "population_served" INTEGER,
    "staff_count" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sub_centre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "district_name_key" ON "district"("name");

-- CreateIndex
CREATE UNIQUE INDEX "district_code_key" ON "district"("code");

-- CreateIndex
CREATE UNIQUE INDEX "facility_type_name_key" ON "facility_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "facility_type_code_key" ON "facility_type"("code");

-- CreateIndex
CREATE UNIQUE INDEX "facility_type_nin_key" ON "facility_type"("nin");

-- CreateIndex
CREATE UNIQUE INDEX "facility_code_key" ON "facility"("code");

-- CreateIndex
CREATE INDEX "facility_district_id_idx" ON "facility"("district_id");

-- CreateIndex
CREATE INDEX "facility_facility_type_id_idx" ON "facility"("facility_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "sub_centre_code_key" ON "sub_centre"("code");

-- CreateIndex
CREATE INDEX "sub_centre_facility_id_idx" ON "sub_centre"("facility_id");

-- AddForeignKey
ALTER TABLE "facility" ADD CONSTRAINT "facility_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility" ADD CONSTRAINT "facility_facility_type_id_fkey" FOREIGN KEY ("facility_type_id") REFERENCES "facility_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_centre" ADD CONSTRAINT "sub_centre_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;
