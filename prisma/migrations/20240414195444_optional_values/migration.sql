-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_advertisementId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_feedbackId_fkey";

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "advertisementId" DROP NOT NULL,
ALTER COLUMN "feedbackId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_advertisementId_fkey" FOREIGN KEY ("advertisementId") REFERENCES "Advertisement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
