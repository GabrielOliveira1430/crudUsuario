-- CreateTable
CREATE TABLE "dream_words" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dream_words_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "dream_words_userId_idx" ON "dream_words"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "dream_words_userId_word_key" ON "dream_words"("userId", "word");

-- AddForeignKey
ALTER TABLE "dream_words" ADD CONSTRAINT "dream_words_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
