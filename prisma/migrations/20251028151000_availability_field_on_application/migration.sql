/*
  Warnings:

  - You are about to drop the column `portfolioLink` on the `applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."applications" DROP COLUMN "portfolioLink",
ADD COLUMN     "availability" TEXT;
