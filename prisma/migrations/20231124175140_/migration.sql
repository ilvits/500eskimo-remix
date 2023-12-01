/*
  Warnings:

  - Added the required column `optionValueId` to the `ProductVariants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariants" ADD COLUMN     "optionValueId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductVariants" ADD CONSTRAINT "ProductVariants_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES "OptionValues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
