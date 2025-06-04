/*
  Warnings:

  - The `DOB` column on the `user_Bio` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user_Bio" ADD COLUMN     "photoPath" TEXT,
ADD COLUMN     "profilePhoto" TEXT,
DROP COLUMN "DOB",
ADD COLUMN     "DOB" TIMESTAMP(3);
