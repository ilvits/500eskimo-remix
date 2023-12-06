-- DropIndex
DROP INDEX "delivered_at_idx";

-- DropIndex
DROP INDEX "delivered_idx";

-- DropIndex
DROP INDEX "delivery_method_idx";

-- DropIndex
DROP INDEX "user_id_idx";

-- CreateIndex
CREATE INDEX "price_idx" ON "OrderItems"("price");
