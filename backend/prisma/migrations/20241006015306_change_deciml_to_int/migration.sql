/*
  Warnings:

  - You are about to alter the column `total_price` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `total_price` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `total_price` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `price` on the `umrah_packages` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "cart_items" ALTER COLUMN "total_price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "total_price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total_price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "umrah_packages" ALTER COLUMN "price" SET DATA TYPE INTEGER;
