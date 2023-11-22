/*
  Warnings:

  - You are about to drop the column `tagNames` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the `_ProductsToTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductsToTags" DROP CONSTRAINT "_ProductsToTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductsToTags" DROP CONSTRAINT "_ProductsToTags_B_fkey";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "tagNames",
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "_ProductsToTags";
