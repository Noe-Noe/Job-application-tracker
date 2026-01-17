# Interview Page - Feature Overview

## What is the Interview Page?

The Interview page is a comprehensive management interface for tracking all your job interviews in one place. It helps you prepare for upcoming interviews, record details during the process, and reflect on completed interviews to improve your performance.

## Key Features Implemented

### 1. Interview Statistics Dashboard

Four key metrics at the top of the page:

- **Upcoming Interviews**: Total count of scheduled interviews
- **This Week**: Interviews scheduled in the next 7 days
- **Completed**: Total interviews you've completed
- **Average Rating**: Your self-rated average performance across completed interviews

### 2. Advanced Search & Filtering

- **Search Bar**: Search by company name, position, or interviewer name in real-time
- **Status Filter**: Filter by interview status with counts:
  - Scheduled
  - Completed
  - Cancelled
  - Rescheduled
  - No Show
- **Type Filter**: Filter by interview type:
  - Phone Screen
  - Video Call
  - On-site
  - Technical Interview
  - Behavioral Interview
  - Panel Interview
  - Case Study
  - Take-home Assignment
  - Final Round
  - HR Interview
  - Meet the Team
  - Other
- **Sort Options**:
  - Sort by: Date, Company, Status, or Type
  - Order: Earliest First or Latest First

### 3. Comprehensive Interview Details

Each interview card displays:

- **Company & Position**: Visual company avatar with position title
- **Date & Time**: Full datetime with countdown for upcoming interviews (e.g., "In 2 days")
- **Interview Type & Round**: Clear labeling of interview type and round number
- **Location/Meeting Link**: Physical location or clickable video meeting link
- **Interviewer Information**: Name and title of the interviewer(s)
- **Status Badge**: Color-coded status indicator
- **Outcome Badge**: Shows result if completed (Passed, Rejected, Pending, etc.)
- **Rating**: Star rating display for completed interviews (1-5 stars)
- **Follow-up Indicator**: Shows if thank you email was sent
- **Notes Preview**: Quick preview of preparation or post-interview notes

### 4. Interview Form (Schedule/Edit)

The comprehensive form includes:

#### Basic Information
- Link to existing job application (auto-fills company & position)
- Company and Position (manual entry if not linked)
- Interview Type selection
- Round Number
- Status

#### Schedule Details
- Date & Time picker with timezone support
- Duration in minutes (default 60, adjustable by 15-min increments)
- Location (physical address or "Remote")
- Meeting Link (Zoom, Google Meet, etc.)

#### Interviewer Information
- Interviewer Name
- Interviewer Title/Role
- Interviewer Email
- LinkedIn Profile URL

#### Preparation Section
- **Preparation Notes**: Space to write down topics to review, common questions, company research
- **Questions to Ask**: List of questions you want to ask the interviewer

#### Post-Interview Section (Available for completed interviews)
- **Post-Interview Notes**: Reflection on how the interview went
- **Outcome**: Dropdown with options like:
  - Passed - Moving Forward
  - Passed - Waiting for Next Steps
  - Rejected
  - Pending Feedback
  - Offer Extended
  - Withdrew
- **Self-Rating**: 1-5 star rating of your performance
- **Follow-up Sent**: Checkbox to track thank you email
- **Follow-up Date**: Date when you sent the thank you email

### 5. Smart Features

- **Time Countdown**: Shows "In X days/hours" for upcoming interviews
- **Past Interview Indicator**: Automatically marks interviews as "Past" if the date has passed
- **Auto-populate from Applications**: Select an existing job application to auto-fill company and position
- **Real-time Filtering**: Instant results as you type or change filters
- **Results Counter**: Shows "X of Y interviews" based on active filters
- **Empty States**: 
  - No interviews yet → Call-to-action to schedule first interview
  - No matching filters → Helpful message to adjust search

### 6. User Experience Features

- **Color-coded Status**: Visual color coding for quick status identification
- **Color-coded Outcomes**: Different colors for different interview results
- **Responsive Design**: Works on all screen sizes
- **Hover Effects**: Visual feedback on interactive elements
- **Loading States**: Spinner animation while fetching data
- **Modal Forms**: Clean, non-intrusive modal for adding/editing interviews

### 7. Data Management

- **Add Interview**: Schedule new interview with full details
- **Edit Interview**: Update any interview details at any time
- **Delete Interview**: Remove interviews with confirmation dialog
- **Link to Application**: Optional connection to existing job applications
- **Persistent Storage**: All data saved to Supabase database

## Database Schema

The interviews table includes:

```sql
- id (UUID, primary key)
- user_id (references auth.users)
- application_id (optional link to applications table)
- company, position (text)
- interview_type (text)
- interview_date (timestamp with timezone)
- duration_minutes (integer)
- location, meeting_link (text)
- interviewer_name, interviewer_title, interviewer_email, interviewer_linkedin (text)
- round_number (integer)
- status (text)
- preparation_notes, questions_to_ask (text)
- post_interview_notes (text)
- outcome (text)
- rating (integer 1-5)
- follow_up_sent (boolean)
- follow_up_date (timestamp)
- created_at, updated_at (timestamp)
```

## How to Use

### Setting Up the Database

1. Go to your Supabase project SQL Editor
2. Run the SQL script in `supabase-interviews-setup.sql`
3. This will create the interviews table with proper security policies

### Scheduling an Interview

1. Click "Schedule Interview" button in the header
2. Optionally link to an existing job application
3. Fill in basic information (company, position, type, round)
4. Set the date, time, and duration
5. Add interviewer information if known
6. Write preparation notes and questions to ask
7. Click "Schedule Interview"

### Managing Interviews

1. **Search**: Type in the search bar to find specific interviews
2. **Filter**: Use status and type filters to narrow down the list
3. **Sort**: Change sorting to view by date, company, status, or type
4. **View Details**: All important information is visible on each card
5. **Edit**: Click the "Edit" button to update interview details
6. **Delete**: Click the delete button to remove an interview

### After an Interview

1. Click "Edit" on the completed interview
2. Change status to "Completed"
3. Fill in post-interview notes about how it went
4. Select the outcome
5. Rate your performance (1-5 stars)
6. Mark if you sent a thank you email
7. Save the changes

## Integration with Applications

The Interview page works seamlessly with the Jobs/Applications system:

- **Automatic Linking**: Can link interviews to existing job applications
- **Auto-fill Data**: When linking to an application, company and position are auto-filled
- **Status Sync**: Interview statuses can help you track application progress
- **Unified Tracking**: See both applications and interviews in one system

## Benefits

### For Job Seekers

- **Stay Organized**: All interview information in one place
- **Never Miss an Interview**: See upcoming interviews at a glance
- **Better Preparation**: Dedicated space for prep notes and questions
- **Track Progress**: See how many interviews lead to offers
- **Improve Performance**: Rate and reflect on each interview to get better

### For Interview Preparation

- **Company Research**: Store research notes for each interview
- **Question Bank**: Prepare and save questions to ask
- **Interviewer Profiles**: Look up interviewers on LinkedIn beforehand
- **Meeting Links**: Quick access to video call links

### For Post-Interview

- **Follow-up Tracking**: Never forget to send thank you emails
- **Performance Reflection**: Self-rate and improve over time
- **Outcome Tracking**: See which interviews lead to next rounds
- **Historical Data**: Review past interviews to identify patterns

## Tips for Success

1. **Schedule interviews as soon as you receive them** to avoid forgetting details
2. **Use preparation notes** to research the company and prepare answers
3. **Add interviewer LinkedIn profiles** to learn about their background
4. **Rate every interview** to track your improvement over time
5. **Send thank you emails within 24 hours** and mark them as sent
6. **Review past interviews** before similar future interviews to learn from experience

## Technical Details

- **File**: `/src/pages/Interviews.jsx`
- **Route**: `/interviews`
- **Components Used**: 
  - Sidebar (navigation)
  - InterviewForm (modal for add/edit)
- **Database**: Fetches from `interviews` table in Supabase
- **Real-time Updates**: Refetches data after any changes
- **Security**: Row Level Security ensures users only see their own interviews

## Status Color Coding

- **Scheduled**: Blue - upcoming interviews
- **Completed**: Green - finished interviews
- **Cancelled**: Red - cancelled interviews
- **Rescheduled**: Yellow - interviews that were moved
- **No Show**: Gray - missed interviews

## Outcome Color Coding

- **Passed - Moving Forward**: Emerald green - success, next round
- **Passed - Waiting**: Cyan - success, waiting for update
- **Rejected**: Red - didn't pass this round
- **Pending Feedback**: Yellow - waiting to hear back
- **Offer Extended**: Green - received an offer
- **Withdrew**: Gray - you withdrew from the process

---

Congratulations! You now have a powerful interview tracking system integrated into your job application tracker. Good luck with your interviews! 🎯
