-- Migration to fix score column and add image support
-- Run this in your Supabase SQL editor

-- 1. Fix score column to support values up to 1000
ALTER TABLE exam_results
ALTER COLUMN score TYPE DECIMAL(6,2);

-- 2. Add image_url column to questions table (optional field for questions with images)
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN questions.image_url IS 'Optional URL for question image (e.g., diagram, chart, photo)';
