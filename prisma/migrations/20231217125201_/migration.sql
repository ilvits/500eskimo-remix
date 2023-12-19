/*
  Warnings:

  - You are about to drop the column `cover_public_id` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "cover_public_id",
ADD COLUMN     "coverPublicId" TEXT;
