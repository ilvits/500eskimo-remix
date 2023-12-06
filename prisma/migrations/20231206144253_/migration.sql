-- CreateIndex
CREATE INDEX "customer_id_idx" ON "Orders"("customersId");

-- CreateIndex
CREATE INDEX "status_delivered_idx" ON "Orders"("status", "delivered");

-- CreateIndex
CREATE INDEX "updated_at_idx" ON "Orders"("updatedAt");

-- CreateIndex
CREATE INDEX "product_variant_idx" ON "ProductVariants"("productId", "optionValueId");

-- CreateIndex
CREATE INDEX "product_variant_name_idx" ON "ProductVariants"("name");
