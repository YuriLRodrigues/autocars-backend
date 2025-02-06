/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `Advertisement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageId` to the `Advertisement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Advertisement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Advertisement" ADD COLUMN     "imageId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Advertisement_imageId_key" ON "Advertisement"("imageId");

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advertisement" ADD CONSTRAINT "Advertisement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
