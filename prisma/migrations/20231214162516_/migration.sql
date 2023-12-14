/*
  Warnings:

  - You are about to drop the column `asset_id` on the `ProductImages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductImages" DROP COLUMN "asset_id",
ADD COLUMN     "assetId" TEXT;
