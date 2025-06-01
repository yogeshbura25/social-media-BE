-- CreateTable
CREATE TABLE "user_Bio" (
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "gender" TEXT,
    "DOB" TEXT,
    "country" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_Bio_username_key" ON "user_Bio"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_Bio_userId_key" ON "user_Bio"("userId");

-- AddForeignKey
ALTER TABLE "user_Bio" ADD CONSTRAINT "user_Bio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
