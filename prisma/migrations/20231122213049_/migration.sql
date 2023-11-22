-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_userId_fkey";

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "customersId" INTEGER;

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "customersId" INTEGER;

-- CreateTable
CREATE TABLE "Customers" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- CreateIndex
CREATE INDEX "customer_username_idx" ON "Customers"("username");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customersId_fkey" FOREIGN KEY ("customersId") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_customersId_fkey" FOREIGN KEY ("customersId") REFERENCES "Customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
