# Events Page Setup Checklist

Use this checklist to set up the Events page in your Job Application Tracker.

## ✅ Pre-Setup Verification

- [ ] Supabase project is created and configured
- [ ] Environment variables are set (`.env` file)
- [ ] Application is running (`npm run dev`)
- [ ] You can log in successfully

## ✅ Database Setup

### Step 1: Open Supabase SQL Editor
- [ ] Go to your Supabase project dashboard
- [ ] Navigate to SQL Editor (left sidebar)
- [ ] Click "New Query"

### Step 2: Run Events Table Setup
- [ ] Open `supabase-events-setup.sql` from your project
- [ ] Copy the entire contents
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" or press Cmd/Ctrl + Enter
- [ ] Verify success message appears

### Step 3: Verify Table Creation
- [ ] Go to Table Editor in Supabase
- [ ] Confirm `events` table exists
- [ ] Verify table has these columns:
  - [ ] id (uuid)
  - [ ] user_id (uuid)
  - [ ] application_id (uuid, nullable)
  - [ ] title (text)
  - [ ] event_type (text)
  - [ ] event_date (timestamptz)
  - [ ] end_date (timestamptz, nullable)
  - [ ] location (text, nullable)
  - [ ] event_link (text, nullable)
  - [ ] company (text, nullable)
  - [ ] description (text, nullable)
  - [ ] notes (text, nullable)
  - [ ] is_all_day (boolean)
  - [ ] reminder_hours_before (integer)
  - [ ] status (text)
  - [ ] outcome (text, nullable)
  - [ ] contacts_made (text, nullable)
  - [ ] reminder_sent (boolean)
  - [ ] created_at (timestamptz)
  - [ ] updated_at (timestamptz)

### Step 4: Verify RLS Policies
- [ ] Click on `events` table
- [ ] Go to "Policies" tab
- [ ] Confirm 4 policies exist:
  - [ ] "Users can view their own events"
  - [ ] "Users can insert their own events"
  - [ ] "Users can update their own events"
  - [ ] "Users can delete their own events"

## ✅ Application Verification

### Step 1: Check Files Exist
- [ ] `src/pages/Events.jsx` exists
- [ ] `src/components/EventForm.jsx` exists
- [ ] `src/App.jsx` has been updated

### Step 2: Verify Sidebar Link
- [ ] Start/restart your dev server
- [ ] Log in to the application
- [ ] Check sidebar under "JOB BOARD"
- [ ] Confirm "Events" link is visible
- [ ] Click "Events" link
- [ ] Confirm you navigate to Events page

### Step 3: Check Page Loads
- [ ] Events page loads without errors
- [ ] Check browser console (F12) for any errors
- [ ] Statistics cards display (showing 0 if no events)
- [ ] "Add Event" button is visible
- [ ] Search and filter bar is visible

## ✅ Feature Testing

### Test 1: Create Event
- [ ] Click "Add Event" button
- [ ] Form modal opens
- [ ] Fill in required fields:
  - [ ] Title: "Test Career Fair"
  - [ ] Event Type: Career Fair
  - [ ] Date: Tomorrow's date
- [ ] Click "Add Event"
- [ ] Event appears in the list
- [ ] Statistics update correctly

### Test 2: Edit Event
- [ ] Click "Edit" on the created event
- [ ] Form opens with event data
- [ ] Modify title to "Updated Career Fair"
- [ ] Click "Update Event"
- [ ] Event updates in the list
- [ ] Changes are reflected

### Test 3: Delete Event
- [ ] Click "Delete" on an event
- [ ] Confirmation dialog appears
- [ ] Click "OK"
- [ ] Event is removed from list
- [ ] Statistics update accordingly

### Test 4: Search Functionality
- [ ] Create 2-3 events with different names
- [ ] Type in search box
- [ ] Verify filtering works
- [ ] Clear search
- [ ] All events reappear

### Test 5: Status Filter
- [ ] Click status dropdown
- [ ] Select "Upcoming"
- [ ] Only upcoming events show
- [ ] Try other statuses
- [ ] Verify counts are correct

### Test 6: Type Filter
- [ ] Create events of different types
- [ ] Select a specific type from dropdown
- [ ] Only events of that type show
- [ ] Counts match actual numbers

### Test 7: Sort Functionality
- [ ] Create events with different dates
- [ ] Change sort to "Date"
- [ ] Click sort order toggle
- [ ] Events reorder correctly
- [ ] Try sorting by Title and Type

### Test 8: All-Day Event
- [ ] Create new event
- [ ] Check "All-day event"
- [ ] Notice time fields hide/change
- [ ] Save event
- [ ] Verify it displays only date (no time)

### Test 9: Link to Application
- [ ] Create or have an existing job application
- [ ] Create new event
- [ ] Select an application from dropdown
- [ ] Verify company auto-fills
- [ ] Save and verify link works

### Test 10: Completed Event
- [ ] Edit an event
- [ ] Change status to "Completed"
- [ ] Notice "Post-Event" section appears
- [ ] Fill in outcome and contacts
- [ ] Save
- [ ] Verify outcome displays in card

### Test 11: Countdown Display
- [ ] Create event for tomorrow
- [ ] Verify "In 1 day" displays
- [ ] Create event for next week
- [ ] Verify "In X days" displays

### Test 12: Responsive Design
- [ ] Open browser dev tools (F12)
- [ ] Toggle device toolbar (mobile view)
- [ ] Verify page adapts to mobile
- [ ] Test all features in mobile view
- [ ] Buttons are tap-friendly

## ✅ Data Persistence

- [ ] Create an event
- [ ] Refresh the page
- [ ] Event is still there
- [ ] Log out and log back in
- [ ] Event is still there
- [ ] Check Supabase Table Editor
- [ ] Event row exists in database

## ✅ Security Testing

### Test Different Users
- [ ] Create event as User A
- [ ] Log out
- [ ] Log in as User B (create new account if needed)
- [ ] Verify User B can't see User A's events
- [ ] Create event as User B
- [ ] Log back in as User A
- [ ] Verify User A can't see User B's events

## ✅ Documentation Review

- [ ] Read `EVENTS_PAGE_FEATURES.md`
- [ ] Read `EVENTS_QUICK_REFERENCE.md`
- [ ] Read `EVENTS_VISUAL_GUIDE.md`
- [ ] Read `EVENTS_IMPLEMENTATION_SUMMARY.md`
- [ ] Bookmark for future reference

## ✅ Performance Check

- [ ] Create 10+ events
- [ ] Page still loads quickly
- [ ] Search is responsive
- [ ] Filtering is instant
- [ ] No console errors
- [ ] No memory leaks (check browser task manager)

## ✅ Edge Cases

- [ ] Try creating event without required fields
- [ ] Form validation works
- [ ] Try very long event titles
- [ ] Text truncates properly
- [ ] Try past dates
- [ ] Events show as "Past"
- [ ] Try special characters in title
- [ ] No errors occur
- [ ] Delete all events
- [ ] Empty state displays correctly

## ✅ Integration Testing

### With Job Applications
- [ ] Create a job application
- [ ] Create event linked to it
- [ ] Verify company auto-fills
- [ ] Delete the application
- [ ] Event's application_id becomes null
- [ ] Event still exists

### With User Profile
- [ ] Check if events count in any profile stats
- [ ] Verify user_id is correctly set
- [ ] Test with different user accounts

## 🎉 Completion

### All Tests Passed?
- [ ] All checkboxes above are checked
- [ ] No errors in browser console
- [ ] No errors in terminal
- [ ] Events feature fully functional

### Optional Enhancements
- [ ] Add more event types (customize for your needs)
- [ ] Set up email reminders (requires external service)
- [ ] Create calendar view (future enhancement)
- [ ] Export events to calendar app (future enhancement)

## 📞 Troubleshooting

If any tests fail, refer to:
1. `EVENTS_IMPLEMENTATION_SUMMARY.md` - Troubleshooting section
2. Browser console for error messages
3. Supabase logs for database errors
4. Network tab to check API calls

## 🎓 Learning Resources

After setup, explore:
- How RLS policies protect user data
- How React state management works in Events.jsx
- How form validation is implemented
- How search and filter logic works

---

**Setup Complete!** 🎊

You now have a fully functional Events tracking system integrated into your Job Application Tracker.

Remember to:
- Create events for career fairs you plan to attend
- Set reminders for application deadlines
- Document outcomes after attending events
- Use the feature to stay organized in your job search!
