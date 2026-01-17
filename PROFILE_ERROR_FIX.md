# Fix: "Failed to load profile settings"

## Problem
You're seeing "Failed to load profile settings. Please try again." error when accessing Settings or Edit Profile.

## Root Causes
This error typically happens because:
1. ❌ The `profiles` table doesn't exist in your Supabase database
2. ❌ Your user account doesn't have a profile record yet
3. ❌ Row Level Security (RLS) policies are blocking access
4. ❌ The table schema is incorrect or missing columns

## Solution - Run This SQL Script

### Quick Fix (Recommended)

1. **Open Supabase Dashboard**
   - Go to your project at https://supabase.com/dashboard
   - Navigate to: **SQL Editor** (in the left sidebar)

2. **Run the Complete Setup Script**
   - Click **"New query"**
   - Copy the ENTIRE contents of `supabase-profiles-complete-setup.sql`
   - Paste it into the SQL editor
   - Click **"Run"** button

3. **Verify Setup**
   - The script will show a verification table at the end
   - All checks should show `true` (passed)
   - You should see your profile data in the last query result

4. **Reload Your App**
   - Refresh your browser
   - Navigate to Settings
   - The error should be gone!

## What the Script Does

The setup script will:
- ✅ Create the `profiles` table with all required columns
- ✅ Enable Row Level Security (RLS)
- ✅ Create proper RLS policies so users can access their own profiles
- ✅ Set up a trigger to auto-create profiles for new signups
- ✅ **Create a profile for your existing user account**
- ✅ Verify everything is working correctly

## Still Having Issues?

### Check Browser Console

1. Open your browser's Developer Tools (F12 or Right-click > Inspect)
2. Go to the **Console** tab
3. Navigate to Settings page
4. Look for error messages that start with:
   - `Error fetching profile:`
   - `Profile query result:`
   
### Common Errors and Solutions

#### Error: "relation \"public.profiles\" does not exist"
**Solution:** The table wasn't created. Run `supabase-profiles-complete-setup.sql`

#### Error: "new row violates row-level security policy"
**Solution:** RLS policies are too restrictive. Run the policy commands in the setup script

#### Error: "permission denied for table profiles"
**Solution:** RLS is enabled but policies are missing. Run the policy creation commands

#### Error: "duplicate key value violates unique constraint"
**Solution:** A profile already exists but the query can't find it. Check:
```sql
SELECT * FROM public.profiles WHERE user_id = auth.uid();
```

### Manual Diagnostic Steps

If the quick fix doesn't work, run these queries one by one:

```sql
-- 1. Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'profiles'
);

-- 2. Check your user ID
SELECT auth.uid();

-- 3. Check if you have a profile
SELECT * FROM public.profiles WHERE user_id = auth.uid();

-- 4. Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## Prevention for Future Users

The trigger function in the setup script automatically creates profiles for new users when they sign up. So this issue should only affect existing users who signed up before the profiles table was created.

## Need More Help?

Check the browser console logs for detailed error information. The Settings page now logs:
- Your user ID
- The query being executed  
- The full error response from Supabase
- Whether a profile was found or not

Share these console logs if you need further assistance.
