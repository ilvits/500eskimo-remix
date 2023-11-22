-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('published', 'hidden', 'draft', 'archived');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'draft',
    "categoryId" INTEGER NOT NULL,
    "categoryName" TEXT NOT NULL,
    "tagIds" TEXT[],
    "tagNames" TEXT[],
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "image" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "numReviews" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productIds" TEXT[],

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "deliveryMethod" TEXT NOT NULL,
    "deliveredAt" TIMESTAMP(3) NOT NULL,
    "delivered" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductsToTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "username_idx" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Products_slug_key" ON "Products"("slug");

-- CreateIndex
CREATE INDEX "title_idx" ON "Products"("title");

-- CreateIndex
CREATE INDEX "tagIds_idx" ON "Products" USING GIN ("tagIds");

-- CreateIndex
CREATE INDEX "category_id_idx" ON "Products"("categoryId");

-- CreateIndex
CREATE INDEX "price_idx" ON "Products"("price");

-- CreateIndex
CREATE INDEX "stock_idx" ON "Products"("stock");

-- CreateIndex
CREATE INDEX "rating_idx" ON "Products"("rating");

-- CreateIndex
CREATE INDEX "num_reviews_idx" ON "Products"("numReviews");

-- CreateIndex
CREATE INDEX "updated_at_idx" ON "Products"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "Tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_slug_key" ON "Tags"("slug");

-- CreateIndex
CREATE INDEX "status_idx" ON "Orders"("status");

-- CreateIndex
CREATE INDEX "total_idx" ON "Orders"("total");

-- CreateIndex
CREATE INDEX "user_id_idx" ON "Orders"("userId");

-- CreateIndex
CREATE INDEX "delivered_at_idx" ON "Orders"("deliveredAt");

-- CreateIndex
CREATE INDEX "delivered_idx" ON "Orders"("delivered");

-- CreateIndex
CREATE INDEX "delivery_method_idx" ON "Orders"("deliveryMethod");

-- CreateIndex
CREATE INDEX "created_at_idx" ON "Orders"("createdAt");

-- CreateIndex
CREATE INDEX "order_id_idx" ON "OrderItems"("orderId");

-- CreateIndex
CREATE INDEX "product_id_idx" ON "OrderItems"("productId");

-- CreateIndex
CREATE INDEX "quantity_idx" ON "OrderItems"("quantity");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductsToTags_AB_unique" ON "_ProductsToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductsToTags_B_index" ON "_ProductsToTags"("B");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsToTags" ADD CONSTRAINT "_ProductsToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductsToTags" ADD CONSTRAINT "_ProductsToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
