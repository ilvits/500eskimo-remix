/*
  Warnings:

  - You are about to drop the column `optionValueId` on the `ProductVariants` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductVariants" DROP CONSTRAINT "ProductVariants_optionValueId_fkey";

-- AlterTable
ALTER TABLE "ProductVariants" DROP COLUMN "optionValueId";

-- CreateTable
CREATE TABLE "_OptionsToProductVariants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OptionsToProductVariants_AB_unique" ON "_OptionsToProductVariants"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionsToProductVariants_B_index" ON "_OptionsToProductVariants"("B");

-- AddForeignKey
ALTER TABLE "_OptionsToProductVariants" ADD CONSTRAINT "_OptionsToProductVariants_A_fkey" FOREIGN KEY ("A") REFERENCES "Options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionsToProductVariants" ADD CONSTRAINT "_OptionsToProductVariants_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
