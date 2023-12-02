-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "callories" TEXT,
ADD COLUMN     "conditions" TEXT,
ADD COLUMN     "fat" TEXT,
ADD COLUMN     "freeDelivery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "protein" TEXT,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "numReviews" DROP NOT NULL;
