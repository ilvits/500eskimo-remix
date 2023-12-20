/*
  Warnings:

  - You are about to drop the column `temp` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "temp",
ADD COLUMN     "temporary" BOOLEAN NOT NULL DEFAULT false;
