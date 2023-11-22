/*
  Warnings:

  - You are about to drop the column `state` on the `Products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('published', 'hidden', 'draft', 'archived');

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "state",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'draft';

-- DropEnum
DROP TYPE "ProductState";
