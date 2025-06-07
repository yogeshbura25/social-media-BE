/*
  Warnings:

  - You are about to drop the column `post` on the `user_Post` table. All the data in the column will be lost.
  - You are about to drop the column `postPath` on the `user_Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_Post" DROP COLUMN "post",
DROP COLUMN "postPath";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "post" TEXT,
    "postPath" TEXT,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "user_Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
