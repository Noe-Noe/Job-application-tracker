# Job Application Tracker

A modern web application to track your job applications built with React and Supabase.

## Features

- 🔐 User authentication (Sign up/Login)
- 📝 Track job applications with details like company, position, status
- 📊 View all applications in a beautiful dashboard
- 📅 Interview tracking and management system
- 📆 Events tracking for career fairs, deadlines, and reminders
- ✏️ Add, edit, and delete applications and interviews
- 🔍 Advanced search and filtering
- 📈 Statistics and insights
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Supabase (Database + Auth)
- **Styling**: Tailwind CSS
- **Routing**: React Router

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Create the database tables in Supabase SQL Editor:
   
   **First, create the applications table:**
   ```sql
   -- Create applications table
   create table applications (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users not null,
     company text not null,
     position text not null,
     status text not null default 'applied',
     location text,
     salary text,
     job_url text,
     notes text,
     applied_date date,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable Row Level Security
   alter table applications enable row level security;

   -- Create policies
   create policy "Users can view their own applications"
     on applications for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own applications"
     on applications for insert
     with check (auth.uid() = user_id);

   create policy "Users can update their own applications"
     on applications for update
     using (auth.uid() = user_id);

   create policy "Users can delete their own applications"
     on applications for delete
     using (auth.uid() = user_id);
   ```
   
   **Then, run the profiles setup script** (if not done already):
   - See `supabase-profiles-setup.sql`
   
   **Then, create the interviews table:**
   - Run the SQL script in `supabase-interviews-setup.sql`
   
   **Finally, create the events table:**
   - Run the SQL script in `supabase-events-setup.sql`

5. Run the development server:
   ```bash
   npm run dev
   ```

## Application Statuses

- Applied
- Shortlisted
- Interview Scheduled
- Interview Completed
- Offer Received
- Rejected
- Accepted
- Withdrawn

## Pages

### Dashboard
Overview with statistics, recent applications, and profile information with quick stats.

### Jobs
Comprehensive list of all job applications with advanced filtering, search, and dual-view modes (table/grid).

### Interviews
Complete interview management system for tracking all interviews from preparation to follow-up.

### Survey Requests
Complete survey management system for tracking feedback and review requests from companies.

### Events
Track career fairs, networking events, application deadlines, and follow-up reminders.

### Resume
Manage and organize your resumes for different job applications.

## License

MIT
