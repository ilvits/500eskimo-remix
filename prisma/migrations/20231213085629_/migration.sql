/*
  Warnings:

  - The values [delivery,pickup] on the enum `OrderDeliveryMethod` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,shipped,delivered] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [published,draft,archived] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [published,archived] on the enum `ProductVariantsStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderDeliveryMethod_new" AS ENUM ('DELIVERY', 'PICKUP');
ALTER TYPE "OrderDeliveryMethod" RENAME TO "OrderDeliveryMethod_old";
ALTER TYPE "OrderDeliveryMethod_new" RENAME TO "OrderDeliveryMethod";
DROP TYPE "OrderDeliveryMethod_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED');
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('PUBLISHED', 'DRAFT', 'ARCHIVED');
ALTER TABLE "Products" ALTER COLUMN "productStatus" DROP DEFAULT;
ALTER TABLE "Products" ALTER COLUMN "productStatus" TYPE "ProductStatus_new" USING ("productStatus"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "ProductStatus_old";
ALTER TABLE "Products" ALTER COLUMN "productStatus" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductVariantsStatus_new" AS ENUM ('PUBLISHED', 'ARCHIVED');
ALTER TABLE "ProductVariants" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ProductVariants" ALTER COLUMN "status" TYPE "ProductVariantsStatus_new" USING ("status"::text::"ProductVariantsStatus_new");
ALTER TYPE "ProductVariantsStatus" RENAME TO "ProductVariantsStatus_old";
ALTER TYPE "ProductVariantsStatus_new" RENAME TO "ProductVariantsStatus";
DROP TYPE "ProductVariantsStatus_old";
ALTER TABLE "ProductVariants" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';
COMMIT;

-- AlterTable
ALTER TABLE "ProductVariants" ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "productStatus" SET DEFAULT 'DRAFT';
