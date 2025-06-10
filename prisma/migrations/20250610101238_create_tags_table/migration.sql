-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "tags" TEXT,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "user_Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
