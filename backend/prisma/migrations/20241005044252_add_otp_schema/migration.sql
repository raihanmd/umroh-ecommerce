-- CreateTable
CREATE TABLE "otps" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(30) NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otps_user_id_key" ON "otps"("user_id");

-- CreateIndex
CREATE INDEX "otps_id_idx" ON "otps" USING HASH ("id");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
