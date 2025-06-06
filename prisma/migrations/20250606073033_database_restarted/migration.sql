/*
  Warnings:

  - You are about to drop the column `userId` on the `user_Post` table. All the data in the column will be lost.
  - Added the required column `postId` to the `user_Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_Post" DROP CONSTRAINT "user_Post_userId_fkey";

-- AlterTable
ALTER TABLE "user_Post" DROP COLUMN "userId",
ADD COLUMN     "postId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_Post" ADD CONSTRAINT "user_Post_postId_fkey" FOREIGN KEY ("postId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
