/*
  Warnings:

  - You are about to drop the column `assetId` on the `ProductImages` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `Sorts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asset_id]` on the table `ProductImages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `asset_id` to the `ProductImages` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProductImages_assetId_key";

-- AlterTable
ALTER TABLE "ProductImages" DROP COLUMN "assetId",
ADD COLUMN     "asset_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sorts" DROP COLUMN "assetId",
ADD COLUMN     "asset_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProductImages_asset_id_key" ON "ProductImages"("asset_id");
