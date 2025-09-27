# Supabase Setup Guide for Exam Platform

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name:** `exam-platform`
   - **Database Password:** Create a strong password
   - **Region:** Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be set up (2-3 minutes)

## 🔑 Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings > API**
2. Copy the following values:
   - **Project URL** (something like `https://abcdefgh.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOi...`)

## 📝 Step 3: Configure Environment Variables

1. In your project root, create a file called `.env.local`
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🗄️ Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire content from `supabase-schema.sql`
4. Click "Run" to execute the schema
5. This will create:
   - `students` table
   - `questions` table
   - `exam_results` table
   - Security policies
   - Sample questions

## 🔐 Step 5: Set Up Authentication

1. In Supabase dashboard, go to **Authentication > Settings**
2. Configure the following:
   - **Site URL:** `http://localhost:5173` (for development)
   - **Redirect URLs:** `http://localhost:5173/**`
3. Enable **Email** auth provider
4. Disable **Email confirmations** for development (optional)

## 👨‍💼 Step 6: Create Admin User

1. Go to **Authentication > Users**
2. Click "Add user"
3. Fill in:
   - **Email:** `admin@exam.com`
   - **Password:** Your admin password
   - **Auto Confirm User:** Yes
4. After user is created, note the User ID
5. Go to **Table Editor > students**
6. Find the admin user and update the `role` column to `admin`

## 🎯 Step 7: Test the Connection

1. Start your development server: `npm run dev`
2. Try logging in with:
   - **Admin:** `admin@exam.com` / your_admin_password
   - **Student:** Create a new account via signup

## 🚀 Step 8: Deployment Setup

For production deployment:

1. Update **Site URL** and **Redirect URLs** in Auth settings
2. Add your production domain
3. Update environment variables in your hosting platform

## 📊 Features Included

### ✅ **Database Tables:**
- **Students:** User profiles with roles
- **Questions:** Exam questions by subtest
- **Exam Results:** Detailed exam results with answers

### ✅ **Security:**
- Row Level Security (RLS) enabled
- Students can only see their own data
- Admins can see all data
- Secure authentication

### ✅ **Sample Data:**
- 10+ sample questions across different subtests
- Ready-to-use question format

## 🔧 Troubleshooting

### Connection Issues:
- Check if `.env.local` exists and has correct values
- Verify Supabase URL and key are correct
- Ensure you're using `VITE_` prefix for environment variables

### Auth Issues:
- Check if email confirmation is disabled for development
- Verify redirect URLs match your local/production domains
- Make sure admin user has correct role in database

### Database Issues:
- Run the schema SQL again if tables are missing
- Check if RLS policies are applied correctly
- Verify sample data was inserted

## 📞 Support

If you encounter issues:
1. Check Supabase dashboard logs
2. Check browser console for errors
3. Verify all environment variables are set correctly

Your exam platform is now ready with a scalable Supabase backend! 🎉