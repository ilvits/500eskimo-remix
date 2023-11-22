/*
  Warnings:

  - You are about to drop the column `status` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "status",
ADD COLUMN     "ProductStatus" "ProductStatus" NOT NULL DEFAULT 'draft';
