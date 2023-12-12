/*
  Warnings:

  - You are about to alter the column `price` on the `OrderItems` table. The data in that column could be lost. The data in that column will be cast from `Decimal(7,5)` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `ProductVariants` table. The data in that column could be lost. The data in that column will be cast from `Decimal(7,5)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "OrderItems" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "ProductImages" ADD COLUMN     "asset_id" TEXT;

-- AlterTable
ALTER TABLE "ProductVariants" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
