-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "hashRefreshToken" VARCHAR(255),
ADD COLUMN     "lastLogin" TIMESTAMP(6);
