/*
  Warnings:

  - The values [hidden] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('published', 'draft', 'archived');
ALTER TABLE "Products" ALTER COLUMN "productStatus" DROP DEFAULT;
ALTER TABLE "Products" ALTER COLUMN "productStatus" TYPE "ProductStatus_new" USING ("productStatus"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "ProductStatus_old";
ALTER TABLE "Products" ALTER COLUMN "productStatus" SET DEFAULT 'draft';
COMMIT;

-- DropForeignKey
ALTER TABLE "ProductImages" DROP CONSTRAINT "ProductImages_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
