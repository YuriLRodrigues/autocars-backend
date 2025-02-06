/*
  Warnings:

  - A unique constraint covering the columns `[advertisementId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_advertisementId_userId_key" ON "Like"("advertisementId", "userId");
