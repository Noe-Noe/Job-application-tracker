# Dashboard Update Instructions

## What's Been Changed

### 1. Updated Sign Up Form ✅
- Now collects: Full Name, Email, Job Title, Phone Number, and Password
- All user information is stored in user metadata

### 2. Added User Profiles Table 
You need to run this SQL script in Supabase to add the profiles table.

**Go to Supabase SQL Editor and run this:**

\`\`\`sql
-- Add profiles table for user information
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  title text,
  phone text,
  location text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create a function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
\`\`\`

### 3. New Dashboard Design ✅
- Sidebar navigation (like the image you showed)
- Stats cards showing:
  - Job Applications
  - Upcoming Interviews
  - Shortlisted
  - Job Offers Received
- Profile section on the right side
- Modern, clean layout

### 4. Updated Application Statuses
- Added "Shortlisted" status
- Order: Applied → Shortlisted → Interview Scheduled → Interview Completed → Offer Received → Accepted/Rejected/Withdrawn

## What You Need To Do

1. **Run the SQL script above** in your Supabase SQL Editor
2. **Refresh your browser** - you should see the new dashboard!
3. **Try signing up a new user** to test the new form

## Current Users

For existing users (like the one you just created), they won't have profiles yet. The profile will be automatically created for new users going forward.

If you want to manually create a profile for your existing user:

\`\`\`sql
INSERT INTO profiles (id, full_name, title)
VALUES ('your-user-id-here', 'Your Name', 'Your Job Title');
\`\`\`

You can find your user ID in Authentication → Users in Supabase.

## Features Working Now

✅ Sign up with name and info
✅ Login
✅ Sidebar navigation
✅ Modern dashboard with stats
✅ Profile section
✅ Add/edit/delete applications
✅ Beautiful UI matching your design

Enjoy your new job application tracker! 🎉
