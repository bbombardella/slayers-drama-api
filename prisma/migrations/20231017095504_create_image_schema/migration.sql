/*
  Warnings:

  - You are about to drop the column `poster_path` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[posterImageId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `posterImageId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "poster_path",
ADD COLUMN     "posterImageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_cloudinaryPublicId_key" ON "Image"("cloudinaryPublicId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_posterImageId_key" ON "Movie"("posterImageId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_posterImageId_fkey" FOREIGN KEY ("posterImageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
