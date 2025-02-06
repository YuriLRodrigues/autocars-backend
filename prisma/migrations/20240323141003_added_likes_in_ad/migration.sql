/*
  Warnings:

  - Added the required column `likes` to the `Advertisement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Advertisement" ADD COLUMN     "likes" DOUBLE PRECISION NOT NULL;
