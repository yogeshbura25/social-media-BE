/*
  Warnings:

  - You are about to drop the column `desciption` on the `user_Post` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `user_Post` table. All the data in the column will be lost.
  - Added the required column `userId` to the `user_Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_Post" DROP CONSTRAINT "user_Post_postId_fkey";

-- DropIndex
DROP INDEX "user_Post_postId_key";

-- AlterTable
ALTER TABLE "user_Post" DROP COLUMN "desciption",
DROP COLUMN "postId",
ADD COLUMN     "descritpion" TEXT,
ADD COLUMN     "postPath" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_Post" ADD CONSTRAINT "user_Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
