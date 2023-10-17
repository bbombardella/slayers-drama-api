/*
  Warnings:

  - You are about to drop the column `tmdb_id` on the `Genre` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `tmdb_id` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `vote_average` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tmdbId]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tmdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tmdbId` to the `Genre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voteAverage` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Genre_tmdb_id_key";

-- DropIndex
DROP INDEX "Movie_tmdb_id_key";

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "tmdb_id",
ADD COLUMN     "tmdbId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "release_date",
DROP COLUMN "tmdb_id",
DROP COLUMN "vote_average",
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tmdbId" INTEGER NOT NULL,
ADD COLUMN     "voteAverage" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Genre_tmdbId_key" ON "Genre"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");
