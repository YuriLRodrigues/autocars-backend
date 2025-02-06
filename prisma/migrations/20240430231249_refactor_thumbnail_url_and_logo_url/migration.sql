/*
  Warnings:

  - You are about to drop the column `thumbnailId` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Brand` table. All the data in the column will be lost.
  - Added the required column `thumbnailUrl` to the `Advertisement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoUrl` to the `Brand` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Advertisement" DROP CONSTRAINT "Advertisement_thumbnailId_fkey";

-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_imageId_fkey";

-- DropIndex
DROP INDEX "Advertisement_thumbnailId_key";

-- AlterTable
ALTER TABLE "Advertisement" DROP COLUMN "thumbnailId",
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "imageId",
ADD COLUMN     "logoUrl" TEXT NOT NULL;
