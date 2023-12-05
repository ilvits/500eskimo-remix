/*
  Warnings:

  - The `callories` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fat` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `protein` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `carbs` column on the `Products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "callories",
ADD COLUMN     "callories" INTEGER,
DROP COLUMN "fat",
ADD COLUMN     "fat" INTEGER,
DROP COLUMN "protein",
ADD COLUMN     "protein" INTEGER,
DROP COLUMN "carbs",
ADD COLUMN     "carbs" INTEGER;
