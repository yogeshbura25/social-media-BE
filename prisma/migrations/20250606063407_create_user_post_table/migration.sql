-- CreateTable
CREATE TABLE "user_Post" (
    "id" SERIAL NOT NULL,
    "post" TEXT,
    "desciption" TEXT,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_Post_postId_key" ON "user_Post"("postId");

-- AddForeignKey
ALTER TABLE "user_Post" ADD CONSTRAINT "user_Post_postId_fkey" FOREIGN KEY ("postId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
