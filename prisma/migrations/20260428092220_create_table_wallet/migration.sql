/*
  Warnings:

  - The values [CREDIT_CARD,DEBIT_CARD,E_WALLET] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `course_id` on the `payment_history` table. All the data in the column will be lost.
  - You are about to drop the column `learner_id` on the `payment_history` table. All the data in the column will be lost.
  - Added the required column `payment_mode` to the `payment_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id` to the `payment_history` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('TOPUP', 'WITHDRAW', 'COURSE');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CARD', 'EWALLET', 'CASH', 'WALLET');
ALTER TABLE "payment_history" ALTER COLUMN "payment_method" TYPE "PaymentMethod_new" USING ("payment_method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "payment_history" DROP CONSTRAINT "payment_history_course_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_history" DROP CONSTRAINT "payment_history_learner_id_fkey";

-- AlterTable
ALTER TABLE "payment_history" DROP COLUMN "course_id",
DROP COLUMN "learner_id",
ADD COLUMN     "payment_mode" "PaymentMode" NOT NULL,
ADD COLUMN     "wallet_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- AddForeignKey
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
