/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `ProductImages` will be added. If there are existing duplicate values, this will fail.
  - Made the column `publicId` on table `ProductImages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductImages" ALTER COLUMN "publicId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductImages_publicId_key" ON "ProductImages"("publicId");
