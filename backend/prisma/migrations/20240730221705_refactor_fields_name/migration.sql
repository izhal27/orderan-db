/*
  Warnings:

  - You are about to drop the column `updatedBy` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[updatedById]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_updatedBy_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updatedBy",
ADD COLUMN     "updatedById" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "orderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_updatedById_key" ON "Order"("updatedById");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
