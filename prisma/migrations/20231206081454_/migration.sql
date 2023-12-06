/*
  Warnings:

  - You are about to drop the column `productId` on the `OrderItems` table. All the data in the column will be lost.
  - Added the required column `productVariantId` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_productId_fkey";

-- DropIndex
DROP INDEX "product_id_idx";

-- AlterTable
ALTER TABLE "OrderItems" DROP COLUMN "productId",
ADD COLUMN     "productVariantId" INTEGER NOT NULL,
ADD COLUMN     "productsId" INTEGER;

-- CreateIndex
CREATE INDEX "product_variant_id_idx" ON "OrderItems"("productVariantId");

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
