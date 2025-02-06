/*
  Warnings:

  - You are about to drop the column `likes` on the `Advertisement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Advertisement" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "advertisementId" TEXT;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_advertisementId_fkey" FOREIGN KEY ("advertisementId") REFERENCES "Advertisement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
