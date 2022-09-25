-- CreateTable
CREATE TABLE "urls" (
    "id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "long_url" VARCHAR(256) NOT NULL,
    "url_code" VARCHAR(12) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "url_stats" (
    "urlId" VARCHAR(36) NOT NULL,
    "last_visited_at" TIMESTAMPTZ(6) NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("urlId")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls.long_url_unique" ON "urls"("long_url");

-- CreateIndex
CREATE UNIQUE INDEX "urls.url_code_unique" ON "urls"("url_code");

-- AddForeignKey
ALTER TABLE "url_stats" ADD FOREIGN KEY ("urlId") REFERENCES "urls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
