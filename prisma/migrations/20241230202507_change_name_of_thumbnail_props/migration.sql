/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "thumbnail",
ADD COLUMN     "isThumbnail" BOOLEAN NOT NULL DEFAULT false;
