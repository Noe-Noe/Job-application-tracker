-- Add profiles table for user information
create table profiles (
  id uuid references auth.users primary key,
  user_id uuid references auth.users not null,
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
  email_notifications boolean default true,
  interview_reminders boolean default true,
  application_updates boolean default true,
  survey_reminders boolean default true,
  event_reminders boolean default true,
  -- Privacy settings
  share_analytics boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint profiles_user_id_key unique (user_id)
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = user_id);

-- Create a function to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_id, full_name)
  values (new.id, new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call the function
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Migration: If the table already exists, add the new columns
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id uuid references auth.users;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_url text;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications boolean default true;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interview_reminders boolean default true;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS application_updates boolean default true;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS survey_reminders boolean default true;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS event_reminders boolean default true;
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS share_analytics boolean default false;
-- UPDATE profiles SET user_id = id WHERE user_id IS NULL;
-- ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
