/*
  Warnings:

  - You are about to drop the column `image` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "image",
ADD COLUMN     "carbs" TEXT,
ADD COLUMN     "cover" TEXT,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];
