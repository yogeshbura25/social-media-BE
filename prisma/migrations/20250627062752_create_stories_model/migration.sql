-- CreateTable
CREATE TABLE "Stories" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "story_expire" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Stories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stories_userId_key" ON "Stories"("userId");

-- AddForeignKey
ALTER TABLE "Stories" ADD CONSTRAINT "Stories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
