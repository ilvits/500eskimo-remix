/*
  Warnings:

  - Added the required column `color` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "color" TEXT NOT NULL;
