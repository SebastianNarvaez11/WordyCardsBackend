/*
  Warnings:

  - Made the column `spanishTranslation` on table `Word` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Word" ALTER COLUMN "spanishTranslation" SET NOT NULL;
