-- DropForeignKey
ALTER TABLE "ProductImages" DROP CONSTRAINT "ProductImages_productVariantId_fkey";

-- AlterTable
ALTER TABLE "ProductImages" ALTER COLUMN "productVariantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
