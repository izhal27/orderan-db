/*
  Warnings:

  - You are about to drop the column `updatedById` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_updatedById_fkey";

-- DropIndex
DROP INDEX "Order_updatedById_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "updatedById";
