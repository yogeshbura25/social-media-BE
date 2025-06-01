-- AlterTable
ALTER TABLE "user_Bio" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_Bio_pkey" PRIMARY KEY ("id");
