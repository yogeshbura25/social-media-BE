-- CreateTable
CREATE TABLE "note_Song" (
    "id" SERIAL NOT NULL,
    "song" TEXT,
    "descritpion" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "songId" INTEGER NOT NULL,

    CONSTRAINT "note_Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "note_Song_songId_key" ON "note_Song"("songId");

-- AddForeignKey
ALTER TABLE "note_Song" ADD CONSTRAINT "note_Song_songId_fkey" FOREIGN KEY ("songId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
