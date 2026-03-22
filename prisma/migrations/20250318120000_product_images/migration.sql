-- AlterTable
ALTER TABLE "Product" ADD COLUMN "images" JSONB NOT NULL DEFAULT '[]';

-- Backfill: one image per row from legacy `image` column
UPDATE "Product" SET "images" = jsonb_build_array("image") WHERE jsonb_array_length("images") = 0;
