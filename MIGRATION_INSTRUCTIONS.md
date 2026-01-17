# Fix: Column "user_id" does not exist

## Problem
When running the profiles setup script, you get:
```
ERROR: 42703: column "user_id" does not exist
```

This means you have an **old version** of the profiles table that's missing the `user_id` column.

## Solution

### Use the Migration Script Instead

Since your table already exists, you need to **migrate** it rather than create it from scratch.

1. **Open Supabase Dashboard** → SQL Editor
2. **Open this file**: `supabase-profiles-migration.sql`
3. **Copy ALL the SQL**
4. **Paste into Supabase SQL Editor**
5. **Click Run** ▶️

This migration script will:
- ✅ Add the missing `user_id` column to your existing table
- ✅ Add all other missing columns (title, bio, linkedin_url, etc.)
- ✅ Populate `user_id` with existing `id` values
- ✅ Update RLS policies to use `user_id`
- ✅ Fix the trigger function
- ✅ Verify everything works

### After Running the Migration

1. Check the verification results at the bottom
2. All three checks should show `true`
3. You should see your profile data in the final query
4. Refresh your app
5. Go to Settings - error should be gone! ✅

## Why This Happened

Your profiles table was created with an older schema that only had an `id` column. The app now expects both `id` and `user_id` columns for better consistency with Supabase patterns.

## Alternative: Start Fresh (if migration fails)

If the migration doesn't work, you can drop and recreate the table:

**⚠️ WARNING: This deletes all existing profile data!**

```sql
-- 1. Drop the old table
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Now run the complete setup script
-- Use: supabase-profiles-complete-setup.sql
```

## Next Steps

After the migration:
1. Your Settings page should load without errors
2. Edit Profile should work
3. All pages should display user names correctly
4. New user signups will automatically create profiles with all columns

## Still Having Issues?

Check these in Supabase SQL Editor:

```sql
-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check your profile
SELECT * FROM public.profiles WHERE id = auth.uid();
```
