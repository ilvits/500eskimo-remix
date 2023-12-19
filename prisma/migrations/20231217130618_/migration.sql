-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('ACTIVE', 'TEMPORARY');

-- AlterTable
ALTER TABLE "ProductImages" ADD COLUMN     "status" "ImageStatus" NOT NULL DEFAULT 'TEMPORARY';
