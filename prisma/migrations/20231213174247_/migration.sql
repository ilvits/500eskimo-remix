/*
  Warnings:

  - You are about to drop the column `imagePublicId` on the `ProductVariants` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `ProductVariants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductVariants" DROP COLUMN "imagePublicId",
DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "publicId" TEXT NOT NULL DEFAULT '';
