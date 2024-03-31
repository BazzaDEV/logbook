/*
  Warnings:

  - Changed the type of `google_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "google_id",
ADD COLUMN     "google_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_google_id_key" ON "User"("google_id");
