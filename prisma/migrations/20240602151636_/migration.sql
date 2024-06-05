/*
  Warnings:

  - You are about to drop the column `wordId` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToWord` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[exerciseId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exerciseId` to the `Rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passexercise` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_wordId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToWord" DROP CONSTRAINT "_GroupToWord_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToWord" DROP CONSTRAINT "_GroupToWord_B_fkey";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "wordId",
ADD COLUMN     "exerciseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "passexercise" TEXT NOT NULL;

-- DropTable
DROP TABLE "Word";

-- DropTable
DROP TABLE "_GroupToWord";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "englishexercise" TEXT NOT NULL,
    "spanishTranslation" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rating_exerciseId_key" ON "Rating"("exerciseId");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
