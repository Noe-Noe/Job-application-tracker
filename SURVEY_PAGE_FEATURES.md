# Survey Request Page - Feature Documentation

## Overview
The Survey Request page helps you track and manage all survey and feedback requests you receive from companies during your job search process. This includes post-interview surveys, compensation benchmarking, company reviews, and more.

## Key Features

### 1. Survey Request Management
- **Add Survey Requests**: Create new survey request entries
- **Edit Surveys**: Update survey details, status, and notes
- **Delete Surveys**: Remove survey requests you no longer need
- **Link to Applications**: Optionally connect surveys to specific job applications

### 2. Survey Types
Track different types of surveys:
- Post-Interview Feedback
- Candidate Experience
- Compensation Survey
- Company Culture
- Glassdoor Review
- Indeed Review
- LinkedIn Review
- Referral Program
- Exit Survey
- Market Research
- Other

### 3. Status Tracking
Monitor survey progress with 5 status options:
- **Pending**: Survey request received, not started
- **In Progress**: Currently working on the survey
- **Completed**: Survey finished and submitted
- **Declined**: Chose not to complete the survey
- **Expired**: Survey deadline has passed

### 4. Priority Levels
Organize surveys by importance:
- **Low**: Complete when convenient
- **Medium**: Standard priority
- **High**: Important to complete soon
- **Urgent**: Requires immediate attention

### 5. Statistics Dashboard
At-a-glance metrics showing:
- **Pending Surveys**: Number of surveys waiting to be completed
- **Due Soon**: Surveys due within the next 3 days
- **Completed**: Total number of completed surveys
- **Total**: Total survey requests tracked

### 6. Advanced Filtering & Search
- **Search**: Find surveys by company name, position, or survey type
- **Status Filter**: View surveys by their current status
- **Priority Filter**: Filter by priority level
- **Sort Options**: Sort by due date, requested date, company, priority, or status
- **Sort Order**: Toggle between ascending and descending order

### 7. Survey Details
Track comprehensive information:
- Company and position information
- Survey type and description
- Survey URL for easy access
- Due date with countdown indicators
- Requested date and completed date
- Requester name and email
- Priority level
- Notes for additional context

### 8. Visual Indicators
- **Due Date Alerts**: Color-coded warnings for overdue and upcoming deadlines
  - Red: Overdue or due today
  - Orange: Due within 1-3 days
  - Gray: Due later
- **Status Colors**: Visual badges for quick status identification
- **Priority Colors**: Easy-to-spot priority indicators

### 9. Quick Actions
- **Quick Status Updates**: Change status directly from the card view
- **Open Survey**: One-click access to external survey URLs
- **Edit Survey**: Full access to edit all survey details
- **Delete Survey**: Remove surveys you no longer need to track

### 10. Application Integration
- Link surveys to specific job applications from your Jobs page
- Auto-fills company and position when linked
- Helps maintain context between applications and feedback requests

## How to Use

### Adding a New Survey Request

1. Click the "Add Survey Request" button in the top right
2. Fill in the required information:
   - Company name (required)
   - Survey type (required)
   - Optional: Link to a job application
   - Optional: Survey URL, due date, requester details
3. Add any additional notes or description
4. Set priority level
5. Click "Add Survey" to save

### Managing Survey Status

1. **Quick Update**: Click the status dropdown on any survey card to update immediately
2. **Full Edit**: Click "Edit" button to access all fields and make comprehensive changes
3. **Mark as Completed**: When you change status to "Completed", the completed date is automatically set

### Tracking Deadlines

- Surveys with due dates show countdown timers
- "Due Soon" stat shows surveys due within 3 days
- Color-coded indicators help prioritize which surveys need attention

### Using Filters

1. Use the search bar to find specific companies or survey types
2. Apply status filter to focus on pending, completed, or other statuses
3. Apply priority filter to see high-priority or urgent surveys
4. Sort by due date to see which surveys need attention first

## Best Practices

1. **Set Due Dates**: Always add due dates when provided to track deadlines effectively
2. **Add URLs**: Save survey links for easy access when you're ready to complete them
3. **Link Applications**: Connect surveys to job applications for better context
4. **Update Status**: Keep status current to track your progress
5. **Add Notes**: Use the notes field to remember why a survey is important or any special considerations
6. **Set Priorities**: Mark urgent surveys to ensure you don't miss important opportunities
7. **Complete Promptly**: Companies appreciate timely feedback, which can help future candidates

## Tips

- **Post-Interview Surveys**: These are often tied to your interview performance feedback
- **Compensation Surveys**: Help establish market rates and can benefit you and others
- **Company Reviews**: Can improve your professional network and help others in their job search
- **Referral Programs**: May lead to additional opportunities or rewards
- **Track Everything**: Even if you decline a survey, track it to remember you received the request

## Database Setup

Before using this feature, run the SQL setup script in Supabase:

```sql
-- See supabase-surveys-setup.sql for the complete setup script
```

The script creates:
- `surveys` table with all necessary fields
- Row Level Security (RLS) policies
- Proper indexes for performance
- Foreign key relationships to applications

## Integration with Other Features

- **Jobs Page**: Surveys can be linked to specific job applications
- **Dashboard**: Survey statistics may be displayed in your overview (future enhancement)
- **Interviews**: Track post-interview survey requests related to specific interviews

## Future Enhancements

Potential features for future updates:
- Email reminders for upcoming due dates
- Survey completion rate statistics
- Export survey list to CSV
- Bulk status updates
- Calendar integration for due dates
- Survey templates for common types
