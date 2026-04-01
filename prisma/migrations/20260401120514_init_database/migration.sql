-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'KITCHEN');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('AlaCarte', 'Beverage', 'Appetizer', 'Package');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('READY', 'PENDING', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'QRIS', 'CARD');

-- CreateEnum
CREATE TYPE "OrderTransactionStatus" AS ENUM ('PENDING', 'CANCELED', 'SUCCESS');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(100) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" "ProductCategory" NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" VARCHAR(100) NOT NULL,
    "orderDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderTimestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderNumber" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_products_details" (
    "id" VARCHAR(100) NOT NULL,
    "order_id" VARCHAR(100) NOT NULL,
    "product_id" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_products_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_transactions" (
    "id" VARCHAR(100) NOT NULL,
    "order_id" VARCHAR(100) NOT NULL,
    "paymentMehthod" "PaymentMethod" NOT NULL,
    "totalCost" INTEGER NOT NULL,

    CONSTRAINT "order_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderDate_orderNumber_key" ON "orders"("orderDate", "orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "order_products_details_order_id_product_id_key" ON "order_products_details"("order_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_transactions_order_id_key" ON "order_transactions"("order_id");

-- AddForeignKey
ALTER TABLE "order_products_details" ADD CONSTRAINT "order_products_details_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products_details" ADD CONSTRAINT "order_products_details_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_transactions" ADD CONSTRAINT "order_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
