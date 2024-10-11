/*
  Warnings:

  - You are about to alter the column `photo_urls` on the `umrah_packages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `video_urls` on the `umrah_packages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Made the column `photo_urls` on table `umrah_packages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `video_urls` on table `umrah_packages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "umrah_packages" ALTER COLUMN "photo_urls" SET NOT NULL,
ALTER COLUMN "photo_urls" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "video_urls" SET NOT NULL,
ALTER COLUMN "video_urls" SET DATA TYPE VARCHAR(255);
