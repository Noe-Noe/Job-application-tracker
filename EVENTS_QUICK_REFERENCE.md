# Events Page - Quick Reference

## Setup Steps

### 1. Database Setup
Run this SQL in your Supabase SQL Editor:
```sql
-- Copy and paste the entire contents of supabase-events-setup.sql
```

### 2. Verify Installation
- The Events page is already added to the sidebar under "JOB BOARD"
- Route is configured at `/events`
- All necessary components are in place

## Common Event Types & When to Use Them

### Career Fair
- Job fairs, career expos
- Example: "Tech Career Fair at Convention Center"

### Networking Event
- Meetups, professional gatherings
- Example: "Software Engineers Meetup Downtown"

### Application Deadline
- Important application closing dates
- Example: "Google SWE Application Deadline"

### Follow-up Reminder
- Remind yourself to follow up
- Example: "Follow up with Microsoft Recruiter"

### Company Event
- Open houses, company info sessions
- Example: "Amazon Open House - Seattle Office"

### Offer Decision Deadline
- When you need to respond to offers
- Example: "Accept/Decline Tesla Offer"

### Info Session
- Learn about companies
- Example: "Netflix Engineering Info Session"

### Workshop
- Professional development
- Example: "Resume Writing Workshop"

## Quick Actions

### Adding an Event
1. Click "Add Event" button
2. Fill in title and event type
3. Set date/time
4. Optionally link to a job application
5. Add notes/description
6. Click "Add Event"

### Setting Reminders
Choose from:
- 1 hour before
- 2 hours before
- 4 hours before
- 1 day before (default)
- 2 days before
- 1 week before

### Marking as Completed
1. Edit the event
2. Change status to "Completed"
3. Fill in outcome and contacts made
4. Save

## Filtering & Search

### Search
Searches across:
- Event title
- Company name
- Location
- Description

### Filters
- **Status**: Upcoming, Completed, Cancelled
- **Type**: All event types
- **Sort**: By date, title, or type
- **Order**: Ascending or descending

## Statistics Explained

- **Upcoming**: Events with status "Upcoming" that are in the future
- **This Week**: Upcoming events in the next 7 days
- **This Month**: Upcoming events in the next 30 days
- **Completed**: All events marked as completed

## Best Practices

### For Career Fairs
```
Title: "Spring Tech Career Fair 2026"
Type: Career Fair
All-Day: Yes
Location: Convention Center
Notes: Companies attending: Google, Meta, Amazon
      Bring: 20 copies of resume, business cards
      Goals: Talk to at least 5 companies
```

### For Application Deadlines
```
Title: "Apply to SpaceX Software Engineer"
Type: Application Deadline
Reminder: 2 days before
Link to Application: [Select the SpaceX application]
Notes: Need to update resume with latest project
```

### For Follow-up Reminders
```
Title: "Follow up with Jane Doe at Microsoft"
Type: Follow-up Reminder
Date: 1 week after initial contact
Notes: Met at career fair, discussed cloud infrastructure role
      Email: jane.doe@microsoft.com
```

### For Networking Events
```
Title: "Silicon Valley Tech Meetup"
Type: Networking Event
Event Link: meetup.com/tech-group
Notes: Topics: AI/ML Career Paths
      Goals: Make 3 new connections
      
After event (mark as Completed):
Outcome: Great event! Met several hiring managers
Contacts Made:
- John Smith, Engineering Manager at Stripe
- Sarah Lee, Recruiter at Airbnb
```

## Tips

1. **Always use reminders** - Don't miss important deadlines
2. **Link to applications** - Better organization and context
3. **Document outcomes** - Track what worked for future reference
4. **Be specific in titles** - "Google SWE Interview Prep" not just "Prep"
5. **Use notes liberally** - Include details like what to bring, who to contact
6. **Set all-day for fairs** - Career fairs usually don't have specific times
7. **Include event links** - Registration or Zoom links for easy access

## Time Display

The system shows:
- **Future events**: "In X days" or "In X hours"
- **Today**: "Soon"
- **Past events**: "Past"

All-day events show only the date, timed events show date and time.

## Troubleshooting

### Events not showing?
- Check your status filter (might be filtering them out)
- Check your search term
- Verify events are in the database

### Can't edit/delete?
- Only the event creator (you) can edit/delete
- Make sure you're logged in as the correct user

### Reminder not working?
- Note: Reminders are currently tracked in the database
- Email/push notifications need to be configured separately
- This is a placeholder for future notification systems

## Database Schema

Key fields in the `events` table:
- `title` - Event name
- `event_type` - Type of event
- `event_date` - Start date/time
- `end_date` - End date/time (optional)
- `status` - Upcoming/Completed/Cancelled
- `application_id` - Linked application (optional)
- `company` - Company name (optional)
- `location` - Physical location
- `event_link` - URL for virtual events
- `description` - What the event is about
- `notes` - Your preparation notes
- `is_all_day` - All-day event flag
- `reminder_hours_before` - Reminder timing
- `outcome` - Post-event outcome
- `contacts_made` - People you met
