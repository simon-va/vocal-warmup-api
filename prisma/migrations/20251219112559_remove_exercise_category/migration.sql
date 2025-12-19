/*
  Warnings:

  - You are about to drop the column `category_id` on the `exercises` table. All the data in the column will be lost.
  - Made the column `subcategory_id` on table `exercises` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_category_id_fkey";

-- DropIndex
DROP INDEX "exercises_category_id_idx";

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "category_id",
ALTER COLUMN "subcategory_id" SET NOT NULL;
