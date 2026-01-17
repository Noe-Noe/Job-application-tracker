-- Create interviews table
create table interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  application_id uuid references applications on delete cascade,
  company text not null,
  position text not null,
  interview_type text not null default 'Phone Screen',
  interview_date timestamp with time zone,
  duration_minutes integer default 60,
  location text,
  meeting_link text,
  interviewer_name text,
  interviewer_title text,
  interviewer_email text,
  interviewer_linkedin text,
  round_number integer default 1,
  status text not null default 'Scheduled',
  preparation_notes text,
  questions_to_ask text,
  post_interview_notes text,
  outcome text,
  rating integer check (rating >= 1 and rating <= 5),
  follow_up_sent boolean default false,
  follow_up_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table interviews enable row level security;

-- Create policies
create policy "Users can view their own interviews"
  on interviews for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interviews"
  on interviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own interviews"
  on interviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own interviews"
  on interviews for delete
  using (auth.uid() = user_id);

-- Create index for better query performance
create index interviews_user_id_idx on interviews(user_id);
create index interviews_application_id_idx on interviews(application_id);
create index interviews_interview_date_idx on interviews(interview_date);
create index interviews_status_idx on interviews(status);
