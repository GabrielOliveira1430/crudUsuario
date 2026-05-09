-- CreateTable
CREATE TABLE "strategy_learning" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "runs" INTEGER NOT NULL DEFAULT 0,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "survivalRate" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "species" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "strategy_learning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "strategy_learning_name_key" ON "strategy_learning"("name");

-- CreateIndex
CREATE INDEX "strategy_learning_name_idx" ON "strategy_learning"("name");

-- CreateIndex
CREATE INDEX "strategy_learning_active_idx" ON "strategy_learning"("active");
