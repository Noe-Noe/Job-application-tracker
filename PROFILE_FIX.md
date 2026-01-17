# Profile Loading Fix

## Issue
You may see "Failed to load profile settings" error if:
1. The profiles table doesn't exist in your Supabase database
2. Your user doesn't have a profile record yet
3. There are RLS (Row Level Security) policy issues

## Solution

### Step 1: Ensure Profiles Table Exists
Run the SQL script in `supabase-profiles-setup.sql` in your Supabase SQL Editor.

### Step 2: Create Profile for Existing User (if needed)

If you already have a user account but no profile, run this SQL in Supabase SQL Editor:

```sql
-- Replace 'your-user-id-here' with your actual user ID
-- You can find your user ID in the Supabase Dashboard > Authentication > Users
INSERT INTO public.profiles (id, user_id, full_name, created_at, updated_at)
VALUES (
  'your-user-id-here',
  'your-user-id-here',
  'Your Name',
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO NOTHING;
```

### Step 3: Verify RLS Policies

Make sure these policies exist on the profiles table:

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

If policies are missing, run the policy creation commands from `supabase-profiles-setup.sql`.

### Step 4: Test the Fix

1. Log out of your application
2. Log back in
3. Navigate to Settings or Edit Profile
4. You should now see your profile load without errors

## What Was Fixed

The following changes were made to fix the profile loading issue:

1. **Changed `.single()` to `.maybeSingle()`**: This allows the query to return `null` instead of throwing an error when no profile exists yet.

2. **Added `id` field to upserts**: The profiles table has both `id` and `user_id` columns (both referencing the same user). Now we include both in the upsert operations.

3. **Better error handling**: More informative error messages and graceful handling of missing profiles.

4. **Consistent querying**: All pages now use `user_id` consistently when querying profiles.

## Files Modified

- `src/pages/Settings.jsx` - Fixed profile fetching and saving
- `src/pages/EditProfile.jsx` - Fixed profile fetching and saving
- `src/pages/Dashboard.jsx` - Fixed profile fetching
- `src/pages/Jobs.jsx` - Fixed profile fetching
- `src/pages/Interviews.jsx` - Fixed profile fetching
- `src/pages/Resume.jsx` - Fixed profile fetching
- `src/pages/Survey.jsx` - Fixed profile fetching
- `src/pages/Events.jsx` - Fixed profile fetching

## Note

For new users who sign up, a profile is automatically created via the `handle_new_user()` trigger function defined in the profiles setup SQL.
