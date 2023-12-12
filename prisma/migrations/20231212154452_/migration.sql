-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'shipped', 'delivered');

-- CreateEnum
CREATE TYPE "OrderDeliveryMethod" AS ENUM ('delivery', 'pickup');

-- CreateEnum
CREATE TYPE "ProductVariantsStatus" AS ENUM ('published', 'archived');

-- AlterTable
ALTER TABLE "ProductVariants" ADD COLUMN     "status" "ProductVariantsStatus" NOT NULL DEFAULT 'published';
