/*
  Warnings:

  - You are about to drop the `note_Song` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "note_Song" DROP CONSTRAINT "note_Song_songId_fkey";

-- DropIndex
DROP INDEX "Likes_userId_key";

-- DropTable
DROP TABLE "note_Song";
