/*
  Warnings:

  - You are about to drop the column `descritpion` on the `user_Post` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `user_Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user_Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `user_Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_Post" DROP CONSTRAINT "user_Post_postId_fkey";

-- AlterTable
ALTER TABLE "user_Post" DROP COLUMN "descritpion",
DROP COLUMN "postId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_Post_userId_key" ON "user_Post"("userId");

-- AddForeignKey
ALTER TABLE "user_Post" ADD CONSTRAINT "user_Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
