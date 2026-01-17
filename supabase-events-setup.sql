-- Create events table
create table events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  application_id uuid references applications(id) on delete set null,
  title text not null,
  event_type text not null check (event_type in (
    'Career Fair',
    'Networking Event',
    'Application Deadline',
    'Follow-up Reminder',
    'Company Event',
    'Offer Decision Deadline',
    'Info Session',
    'Workshop',
    'Other'
  )),
  event_date timestamptz not null,
  end_date timestamptz,
  location text,
  event_link text,
  company text,
  description text,
  notes text,
  is_all_day boolean default false,
  reminder_sent boolean default false,
  reminder_hours_before integer default 24,
  status text not null default 'Upcoming' check (status in ('Upcoming', 'Completed', 'Cancelled')),
  outcome text,
  contacts_made text,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table events enable row level security;

-- Create policies
create policy "Users can view their own events"
  on events for select
  using (auth.uid() = user_id);

create policy "Users can insert their own events"
  on events for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own events"
  on events for update
  using (auth.uid() = user_id);

create policy "Users can delete their own events"
  on events for delete
  using (auth.uid() = user_id);

-- Create index for better query performance
create index events_user_id_idx on events(user_id);
create index events_event_date_idx on events(event_date);
