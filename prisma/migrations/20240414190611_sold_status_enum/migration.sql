/*
  Warnings:

  - You are about to drop the column `wasSold` on the `Advertisement` table. All the data in the column will be lost.
  - Added the required column `soldStatus` to the `Advertisement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SoldStatus" AS ENUM ('Active', 'Reserved', 'Sold');

-- AlterTable
ALTER TABLE "Advertisement" DROP COLUMN "wasSold",
ADD COLUMN     "soldStatus" "SoldStatus" NOT NULL;
