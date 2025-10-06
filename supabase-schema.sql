-- Supabase Database Schema for Exam Platform
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('admin', 'student')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Questions table
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    subtest_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of options
    correct_answer INTEGER NOT NULL, -- Index of correct answer (0-3)
    image_url TEXT, -- Optional: URL for question image
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Exam results table
CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subtest_id INTEGER NOT NULL,
    subtest_name VARCHAR(255) NOT NULL,
    score DECIMAL(6,2) NOT NULL, -- Score out of 1000
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    wrong_answers INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    duration INTEGER NOT NULL, -- Duration in seconds
    answers JSONB NOT NULL -- Array of student answers with details
);

-- Create indexes for better performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_role ON students(role);
CREATE INDEX idx_questions_subtest ON questions(subtest_id);
CREATE INDEX idx_exam_results_student ON exam_results(student_id);
CREATE INDEX idx_exam_results_subtest ON exam_results(subtest_id);
CREATE INDEX idx_exam_results_completed ON exam_results(completed_at);

-- Row Level Security (RLS) Policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Students table policies
CREATE POLICY "Students can view their own profile" ON students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update their own profile" ON students
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all students" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Anyone can create student profile" ON students
    FOR INSERT WITH CHECK (true);

-- Questions table policies
CREATE POLICY "Everyone can view questions" ON questions
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage questions" ON questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Exam results table policies
CREATE POLICY "Students can view their own results" ON exam_results
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own results" ON exam_results
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Admins can view all results" ON exam_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert sample questions for testing
INSERT INTO questions (subtest_id, question_text, options, correct_answer) VALUES
(1, 'Semua burung dapat terbang. Pinguin adalah burung. Kesimpulan yang tepat adalah:',
 '["Pinguin dapat terbang", "Pinguin tidak dapat terbang", "Semua burung kecuali pinguin dapat terbang", "Pernyataan pertama salah"]', 3),

(1, 'Jika A > B dan B > C, maka:',
 '["A = C", "A < C", "A > C", "A ≤ C"]', 2),

(1, 'Dalam sebuah kelas, semua siswa yang rajin mendapat nilai bagus. Budi mendapat nilai bagus. Dapat disimpulkan:',
 '["Budi adalah siswa yang rajin", "Budi mungkin siswa yang rajin", "Budi bukan siswa yang rajin", "Tidak dapat disimpulkan"]', 3),

(1, 'Manakah yang melanjutkan pola: 2, 6, 12, 20, 30, ?',
 '["40", "42", "44", "46"]', 1),

(2, 'Hasil dari 2³ + 3² adalah:',
 '["15", "17", "19", "21"]', 1),

(2, 'Jika x + 5 = 12, maka nilai x adalah:',
 '["5", "6", "7", "8"]', 2),

(3, 'Manakah kalimat yang menggunakan ejaan yang benar?',
 '["Dia datang ke rumah saya kemarin", "Dia datang kerumah saya kemarin", "Dia datang ke-rumah saya kemarin", "Dia datang ke rumahsaya kemarin"]', 0),

(4, 'Choose the correct sentence:',
 '["She go to school everyday", "She goes to school everyday", "She going to school everyday", "She gone to school everyday"]', 1),

(5, 'Ibu kota Indonesia adalah:',
 '["Jakarta", "Surabaya", "Bandung", "Medan"]', 0),

(6, 'Turunan dari f(x) = x² + 3x - 5 adalah:',
 '["2x + 3", "x² + 3", "2x - 5", "x + 3"]', 0);

-- Create a default admin user (you'll need to replace with actual admin credentials)
-- This is just a placeholder - you should create the admin through Supabase Auth
INSERT INTO students (id, email, name, role) VALUES
('00000000-0000-0000-0000-000000000000', 'admin@exam.com', 'Administrator', 'admin');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on students table
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();