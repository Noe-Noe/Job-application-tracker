# Events Page Features

## Overview
The Events page helps you track career fairs, networking events, application deadlines, follow-up reminders, and other important job search-related events.

## Features

### Event Types
- **Career Fair** - Job fairs and career expos
- **Networking Event** - Professional meetups and networking opportunities
- **Application Deadline** - Important dates when applications close
- **Follow-up Reminder** - Reminders to follow up on applications or after interviews
- **Company Event** - Open houses, info sessions, company-sponsored events
- **Offer Decision Deadline** - When you need to respond to job offers
- **Info Session** - Company information sessions
- **Workshop** - Professional development workshops
- **Other** - Any other event type

### Event Statuses
- **Upcoming** - Events that haven't occurred yet
- **Completed** - Events that have already happened
- **Cancelled** - Events that were cancelled

### Core Features

#### 1. Event Management
- Add, edit, and delete events
- Link events to specific job applications (optional)
- Set all-day events or specific times
- Set start and end dates/times
- Add location or event links

#### 2. Statistics Dashboard
Four stat cards showing:
- **Upcoming** - Total number of upcoming events
- **This Week** - Events scheduled for the next 7 days
- **This Month** - Events scheduled for the next 30 days
- **Completed** - Total completed events

#### 3. Search & Filtering
- **Search**: Search by title, company, location, or description
- **Status Filter**: Filter by Upcoming, Completed, or Cancelled
- **Type Filter**: Filter by event type
- **Sort Options**: Sort by date, title, or type
- **Sort Order**: Toggle between ascending and descending

#### 4. Event Cards
Each event card displays:
- Event icon based on type
- Title and type
- Company name (if applicable)
- Date and time
- Time until event (e.g., "In 3 days")
- Location or event link
- Status badge
- All-day indicator (if applicable)
- Description preview
- Outcome (for completed events)

#### 5. Event Form
Comprehensive form with sections:

**Basic Information**
- Event title *
- Event type *
- Status
- Link to job application (optional)
- Company name

**Date & Time**
- All-day event toggle
- Start date & time *
- End date & time (optional)
- Reminder settings (1 hour to 1 week before)

**Location & Link**
- Physical location
- Event link/URL

**Details**
- Description - What the event is about
- Notes - Your preparation items, things to bring

**Post-Event** (shown when status is "Completed")
- Outcome - What happened, leads, opportunities
- Contacts Made - People you met with their contact info

### 6. Visual Features
- Clean, modern card-based UI
- Color-coded status badges
- Type-specific icons
- Responsive grid layout
- Hover effects on cards
- Loading and empty states

### 7. Reminders
- Set reminder time before event (1 hour to 1 week)
- Configurable reminder hours before event

## Database Setup

Run the SQL script `supabase-events-setup.sql` in your Supabase SQL Editor to create:
- `events` table with all necessary fields
- Row Level Security (RLS) policies
- Indexes for performance

## Use Cases

### Career Fair Tracking
Track upcoming career fairs, prepare company lists, and record contacts made afterward.

### Application Deadlines
Never miss an application deadline by creating deadline events with reminders.

### Follow-up Management
Set reminders to follow up on applications or after networking events at specific dates.

### Networking Events
Track professional meetups and conferences, with notes on who you met and what was discussed.

### Offer Decision Tracking
Create events for offer decision deadlines to ensure you respond in time.

### Company Info Sessions
Track when companies are hosting information sessions to learn more about opportunities.

## Tips

1. **Link to Applications**: Connect events to specific job applications for better organization
2. **Use Reminders**: Set appropriate reminder times to ensure you don't miss important events
3. **Document Outcomes**: For completed events, always fill in the outcome and contacts made
4. **All-Day Events**: Use the all-day toggle for events without specific times (like career fairs)
5. **Include Links**: Add event links or registration URLs for easy access
6. **Detailed Notes**: Use the notes field to prepare what to bring, questions to ask, or research needed

## Integration with Other Features

- **Job Applications**: Link events to specific applications
- **Dashboard**: Events count toward your activity metrics
- **Interviews**: Follow-up reminders can reference interviews

## Future Enhancements
- Calendar view for visual event scheduling
- iCal/Google Calendar export
- Email/push notifications for reminders
- Recurring events
- Event templates for common event types
