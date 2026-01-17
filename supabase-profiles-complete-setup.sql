-- COMPLETE PROFILES TABLE SETUP
-- Run ALL of these commands in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)

-- Step 1: Drop existing table if it has issues (CAREFUL - this deletes data!)
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- Step 2: Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  full_name text,
  title text,
  phone text,
  location text,
  bio text,
  avatar_url text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  -- Notification settings
  email_notifications boolean DEFAULT true,
  interview_reminders boolean DEFAULT true,
  application_updates boolean DEFAULT true,
  survey_reminders boolean DEFAULT true,
  event_reminders boolean DEFAULT true,
  -- Privacy settings
  share_analytics boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

-- Step 3: Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies (in case they exist with wrong definitions)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Step 5: Create correct RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 6: Create function to auto-create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    now(),
    now()
  );
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Could not create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Create profiles for any existing users that don't have one
INSERT INTO public.profiles (id, user_id, full_name, created_at, updated_at)
SELECT 
  u.id,
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', u.email, 'User'),
  now(),
  now()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Step 9: Verify setup
SELECT 
  'Profiles table exists' as check_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) as passed
UNION ALL
SELECT 
  'RLS is enabled' as check_name,
  (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles') as passed
UNION ALL
SELECT 
  'Policies exist' as check_name,
  COUNT(*) >= 3 as passed
FROM pg_policies 
WHERE tablename = 'profiles'
UNION ALL
SELECT 
  'Trigger exists' as check_name,
  EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) as passed
UNION ALL
SELECT 
  'Profile count' as check_name,
  (SELECT COUNT(*) FROM public.profiles) > 0 as passed;

-- Step 10: View your profile (should return a row)
SELECT * FROM public.profiles WHERE user_id = auth.uid();
