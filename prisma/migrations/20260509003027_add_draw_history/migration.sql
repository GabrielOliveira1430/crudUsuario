-- CreateTable
CREATE TABLE "draw_history" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "source" TEXT DEFAULT 'realtime',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "draw_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "draw_history_number_idx" ON "draw_history"("number");

-- CreateIndex
CREATE INDEX "draw_history_createdAt_idx" ON "draw_history"("createdAt");
