-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_sortId_fkey";

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "sortId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_sortId_fkey" FOREIGN KEY ("sortId") REFERENCES "Sorts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
