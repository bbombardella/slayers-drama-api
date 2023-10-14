/*
  Warnings:

  - A unique constraint covering the columns `[tmdb_id]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tmdb_id` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "tmdb_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Genre_tmdb_id_key" ON "Genre"("tmdb_id");
