-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PAID');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(30) NOT NULL,
    "phone" VARCHAR(18) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grades" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ustadzs" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "photo_url" VARCHAR(255) NOT NULL,
    "video_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "ustadzs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "umrah_packages" (
    "id" VARCHAR(30) NOT NULL,
    "ustadz_id" VARCHAR(30) NOT NULL,
    "grade_id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "photo_urls" JSONB,
    "video_urls" JSONB,

    CONSTRAINT "umrah_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" VARCHAR(30) NOT NULL,
    "user_id" VARCHAR(30) NOT NULL,
    "umrah_package_id" VARCHAR(30) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total_price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" VARCHAR(30) NOT NULL,
    "user_id" VARCHAR(30) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PAID',
    "created_at" TIMESTAMP NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" VARCHAR(30) NOT NULL,
    "order_id" VARCHAR(30) NOT NULL,
    "umrah_package_id" VARCHAR(30) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users" USING HASH ("id");

-- CreateIndex
CREATE INDEX "grades_id_idx" ON "grades" USING HASH ("id");

-- CreateIndex
CREATE INDEX "ustadzs_id_idx" ON "ustadzs" USING HASH ("id");

-- CreateIndex
CREATE INDEX "umrah_packages_id_idx" ON "umrah_packages" USING HASH ("id");

-- CreateIndex
CREATE INDEX "cart_items_id_idx" ON "cart_items" USING HASH ("id");

-- CreateIndex
CREATE INDEX "orders_id_idx" ON "orders" USING HASH ("id");

-- CreateIndex
CREATE INDEX "order_items_id_idx" ON "order_items" USING HASH ("id");

-- AddForeignKey
ALTER TABLE "umrah_packages" ADD CONSTRAINT "umrah_packages_ustadz_id_fkey" FOREIGN KEY ("ustadz_id") REFERENCES "ustadzs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "umrah_packages" ADD CONSTRAINT "umrah_packages_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_umrah_package_id_fkey" FOREIGN KEY ("umrah_package_id") REFERENCES "umrah_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_umrah_package_id_fkey" FOREIGN KEY ("umrah_package_id") REFERENCES "umrah_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
