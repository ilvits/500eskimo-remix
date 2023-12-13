/*
  Warnings:

  - You are about to drop the column `sku` on the `ProductVariants` table. All the data in the column will be lost.
  - Added the required column `SKU` to the `ProductVariants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariants" DROP COLUMN "sku",
ADD COLUMN     "SKU" TEXT NOT NULL;
