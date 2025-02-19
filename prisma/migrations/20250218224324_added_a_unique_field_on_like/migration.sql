/*
  Warnings:

  - A unique constraint covering the columns `[advertisementId,userId,feedbackId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_advertisementId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Like_advertisementId_userId_feedbackId_key" ON "Like"("advertisementId", "userId", "feedbackId");
