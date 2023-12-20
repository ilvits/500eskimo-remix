/*
  Warnings:

  - A unique constraint covering the columns `[assetId]` on the table `ProductImages` will be added. If there are existing duplicate values, this will fail.
  - Made the column `assetId` on table `ProductImages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductImages" ALTER COLUMN "assetId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductImages_assetId_key" ON "ProductImages"("assetId");
