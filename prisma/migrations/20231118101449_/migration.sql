/*
  Warnings:

  - You are about to drop the column `status` on the `Products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductState" AS ENUM ('published', 'hidden', 'draft', 'archived');

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "status",
ADD COLUMN     "state" "ProductState" NOT NULL DEFAULT 'draft';

-- DropEnum
DROP TYPE "ProductStatus";
