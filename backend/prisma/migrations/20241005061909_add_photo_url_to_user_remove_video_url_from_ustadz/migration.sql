/*
  Warnings:

  - You are about to drop the column `video_url` on the `ustadzs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "photo_url" VARCHAR(255);

-- AlterTable
ALTER TABLE "ustadzs" DROP COLUMN "video_url";
