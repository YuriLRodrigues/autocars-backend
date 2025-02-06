/*
  Warnings:

  - Changed the type of `salePrice` on the `Advertisement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Advertisement" DROP COLUMN "salePrice",
ADD COLUMN     "salePrice" DOUBLE PRECISION NOT NULL;
