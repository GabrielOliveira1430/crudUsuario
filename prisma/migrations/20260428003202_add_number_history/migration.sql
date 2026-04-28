-- CreateTable
CREATE TABLE "NumberHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "numbers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NumberHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NumberHistory_userId_idx" ON "NumberHistory"("userId");

-- AddForeignKey
ALTER TABLE "NumberHistory" ADD CONSTRAINT "NumberHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
