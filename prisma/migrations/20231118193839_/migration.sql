/*
  Warnings:

  - You are about to drop the column `ProductStatus` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "ProductStatus",
ADD COLUMN     "productStatus" "ProductStatus" NOT NULL DEFAULT 'draft';
