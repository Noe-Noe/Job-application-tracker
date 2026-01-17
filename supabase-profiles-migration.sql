-- MIGRATION SCRIPT FOR EXISTING PROFILES TABLE
-- Use this if you get error: column "user_id" does not exist
-- Run this in Supabase SQL Editor

-- Step 1: Add missing columns to existing profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users ON DELETE CASCADE;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS title text;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS bio text;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS linkedin_url text;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS github_url text;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS portfolio_url text;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS interview_reminders boolean DEFAULT true;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS application_updates boolean DEFAULT true;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS survey_reminders boolean DEFAULT true;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS event_reminders boolean DEFAULT true;

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS share_analytics boolean DEFAULT false;

-- Step 2: Populate user_id with id value for existing rows
UPDATE public.profiles 
SET user_id = id 
WHERE user_id IS NULL;

-- Step 3: Make user_id NOT NULL now that all rows have values
ALTER TABLE public.profiles 
  ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Add unique constraint on user_id
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_user_id_key;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

-- Step 5: Update RLS policies to use user_id
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Step 6: Update trigger function to include user_id
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
    RAISE WARNING 'Could not create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Verify the migration
SELECT 
  'user_id column exists' as check_name,
  EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'user_id'
  ) as passed
UNION ALL
SELECT 
  'All profiles have user_id' as check_name,
  NOT EXISTS (
    SELECT FROM public.profiles WHERE user_id IS NULL
  ) as passed
UNION ALL
SELECT 
  'Unique constraint exists' as check_name,
  EXISTS (
    SELECT FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' 
    AND constraint_name = 'profiles_user_id_key'
  ) as passed;

-- Step 8: View your profile to confirm it works
SELECT * FROM public.profiles WHERE user_id = auth.uid();
