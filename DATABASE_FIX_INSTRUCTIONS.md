# Database Fix Instructions

## Problem
The exam results are not saving because:
1. The `score` column is `DECIMAL(5,2)` which can only store max `999.99`
2. We're trying to save `1000` which exceeds this limit

## Solution
Run the migration SQL in your Supabase SQL Editor to fix the database.

### Steps to Fix:

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration Script**
   Copy and paste the following SQL and click "Run":

```sql
-- Fix score column to support values up to 1000
ALTER TABLE exam_results
ALTER COLUMN score TYPE DECIMAL(6,2);

-- Add image_url column to questions table (optional field for questions with images)
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN questions.image_url IS 'Optional URL for question image (e.g., diagram, chart, photo)';
```

4. **Verify the Changes**
   Run this query to confirm:
```sql
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'exam_results' AND column_name = 'score';
```

   Should show: `score | numeric | NULL` with numeric_precision of 6

5. **Test the Exam**
   - Have a student take the exam
   - Check that results are now saving properly
   - Verify scores appear in the dashboard

## What Changed

### Before:
- `score DECIMAL(5,2)` → Max value: `999.99`
- No image support in questions

### After:
- `score DECIMAL(6,2)` → Max value: `9999.99` (supports up to 1000)
- `image_url TEXT` → Can store image URLs for questions

## Adding Images to Questions

To add an image to a question, update the question with an image URL:

```sql
UPDATE questions
SET image_url = 'https://example.com/path/to/image.jpg'
WHERE id = 1;
```

### Supported Image Formats:
- JPG/JPEG
- PNG
- GIF
- SVG
- WebP

### Best Practices for Images:
1. Use a CDN or image hosting service (Imgur, Cloudinary, etc.)
2. Keep images under 2MB
3. Use appropriate dimensions (max 1200px wide)
4. Ensure images are publicly accessible
5. Use HTTPS URLs

### Example with Image:
```sql
INSERT INTO questions (subtest_id, question_text, options, correct_answer, image_url)
VALUES (
  1,
  'Perhatikan diagram di bawah ini. Berapakah nilai x?',
  '["10", "15", "20", "25"]',
  2,
  'https://i.imgur.com/example123.png'
);
```

## Troubleshooting

### If scores still don't save:
1. Check browser console for errors
2. Verify student_id exists in localStorage
3. Check Supabase logs for detailed error messages
4. Ensure RLS policies allow insert

### If images don't load:
1. Verify the image URL is publicly accessible
2. Check that the URL uses HTTPS
3. Ensure CORS is enabled on the image host
4. Try opening the image URL in a new tab to test

## Need Help?
Check the Supabase logs in Dashboard → Logs → API Logs
