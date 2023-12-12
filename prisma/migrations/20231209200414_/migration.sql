/*
  Warnings:

  - You are about to alter the column `price` on the `OrderItems` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(7,5)`.
  - You are about to alter the column `price` on the `ProductVariants` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(7,5)`.

*/
-- AlterTable
ALTER TABLE "OrderItems" ALTER COLUMN "price" SET DATA TYPE DECIMAL(7,5);

-- AlterTable
ALTER TABLE "ProductVariants" ALTER COLUMN "price" SET DATA TYPE DECIMAL(7,5);
