-- Quick diagnostic and fix script for profiles table
-- Run this in Supabase SQL Editor

-- 1. Check if profiles table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) AS profiles_table_exists;

-- 2. Check RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Check if you have any profiles
SELECT COUNT(*) as profile_count FROM public.profiles;

-- 4. See all profiles (if any)
SELECT id, user_id, full_name, email, created_at 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Create profile for current authenticated user (UNCOMMENT TO RUN)
-- Make sure you're logged into your app in another tab so auth.uid() returns your user ID
/*
INSERT INTO public.profiles (id, user_id, full_name, created_at, updated_at)
SELECT 
  auth.uid(),
  auth.uid(),
  COALESCE(raw_user_meta_data->>'full_name', email),
  NOW(),
  NOW()
FROM auth.users
WHERE id = auth.uid()
ON CONFLICT (user_id) DO NOTHING;
*/

-- 6. Verify the profile was created
SELECT id, user_id, full_name, created_at 
FROM public.profiles 
WHERE user_id = auth.uid();
