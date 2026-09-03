-- CreateTable
CREATE TABLE "ComicStory" (
    "id" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "cast" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComicStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComicStory_banner_key" ON "ComicStory"("banner");
