/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `ProductVariants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductVariants_id_key" ON "ProductVariants"("id");
