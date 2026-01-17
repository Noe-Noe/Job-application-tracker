# 📆 Events Feature - Complete Guide

## 🎯 What is the Events Feature?

The Events feature helps you track all job search-related events in one place:
- Career fairs and networking events
- Application deadlines
- Follow-up reminders
- Company info sessions
- Offer decision deadlines
- Workshops and professional development events

Think of it as your job search calendar and reminder system combined!

---

## 🚀 Quick Start (5 Minutes)

### 1. Set Up Database (2 minutes)
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to SQL Editor
3. Copy contents from `supabase-events-setup.sql`
4. Paste and run
5. ✅ You'll see "Success" message

### 2. Access Events Page (1 minute)
1. Run your app: `npm run dev`
2. Log in
3. Click "Events" in sidebar (under JOB BOARD)
4. You're ready!

### 3. Add Your First Event (2 minutes)
1. Click "Add Event" button
2. Enter: "Spring Career Fair"
3. Type: Career Fair
4. Date: Tomorrow
5. Location: "Convention Center"
6. Click "Add Event"
7. 🎉 Done!

---

## 📋 Files You Need

### Core Files (Already Created)
```
✅ src/pages/Events.jsx              - Main Events page
✅ src/components/EventForm.jsx      - Event form modal
✅ supabase-events-setup.sql         - Database setup
✅ src/App.jsx                       - Route configured
```

### Documentation Files (For Reference)
```
📖 EVENTS_PAGE_FEATURES.md           - All features explained
📖 EVENTS_QUICK_REFERENCE.md         - Quick usage guide
📖 EVENTS_VISUAL_GUIDE.md            - UI layout guide
📖 EVENTS_IMPLEMENTATION_SUMMARY.md  - Technical details
📖 EVENTS_SETUP_CHECKLIST.md         - Complete setup checklist
📖 EVENTS_README.md                  - This file!
```

---

## 🎨 What You'll See

### Main Page Layout
```
┌─────────────────────────────────────────────┐
│ Events                        [+ Add Event] │
├─────────────────────────────────────────────┤
│  [12]      [3]       [8]        [25]       │
│ Upcoming  This Week This Month  Completed   │
├─────────────────────────────────────────────┤
│ [Search...] [Status ▼] [Type ▼] [Sort ▼]  │
├─────────────────────────────────────────────┤
│ 📅 Spring Tech Career Fair                  │
│    Career Fair • Multiple Companies         │
│    Mar 15, 2026 • In 5 days                │
│    📍 Convention Center                     │
│    [Upcoming] [All Day]      [Edit] [Delete]│
└─────────────────────────────────────────────┘
```

---

## 🎯 Common Use Cases

### 1. Track Career Fair
```
BEFORE EVENT:
- Create event with date, location
- Add notes: Companies to visit, what to bring
- Set reminder for 1 day before

DURING EVENT:
- Check your notes on phone
- Take notes on conversations

AFTER EVENT:
- Mark as "Completed"
- Add outcome: Results, leads
- Add contacts: People you met
```

### 2. Application Deadline
```
- Title: "Apply to Google SWE"
- Type: Application Deadline
- Date: 2 weeks from now
- Link to Application: [Select Google application]
- Reminder: 2 days before
- Notes: Update resume with latest project first
```

### 3. Follow-up Reminder
```
- Title: "Follow up with Microsoft Recruiter"
- Type: Follow-up Reminder
- Date: 1 week after initial contact
- Notes: Reference career fair conversation
        Discussed cloud infrastructure role
        Email: recruiter@microsoft.com
```

### 4. Company Info Session
```
- Title: "Netflix Engineering Info Session"
- Type: Info Session
- Date & Time: Specific time
- Event Link: Zoom link
- Notes: Questions to ask about tech stack
        Research their recent projects
```

---

## 🔍 Features at a Glance

### Event Types (9 Types)
| Type | Use For | Example |
|------|---------|---------|
| 📋 Career Fair | Job fairs, expos | "Tech Career Fair 2026" |
| 👥 Networking Event | Meetups, gatherings | "Engineers Meetup" |
| ⏰ Application Deadline | Due dates | "Google Application Due" |
| 🔔 Follow-up Reminder | Follow-up tasks | "Email Recruiter" |
| 🏢 Company Event | Open houses | "Amazon Open House" |
| ✅ Offer Decision | Offer responses | "Accept/Decline Tesla" |
| ℹ️ Info Session | Learn about companies | "Meta Info Session" |
| 📚 Workshop | Development events | "Resume Workshop" |
| ⋯ Other | Miscellaneous | Any other event |

### Status Colors
- 🔵 **Upcoming** - Events in the future
- 🟢 **Completed** - Past events
- ⚪ **Cancelled** - Cancelled events

### Smart Features
- ⏱️ **Countdown**: "In 3 days", "In 2 hours", "Soon"
- 🔗 **Link to Applications**: Connect events to job applications
- 📅 **All-Day Events**: Career fairs without specific times
- 🔔 **Reminders**: 1 hour to 1 week before
- 📝 **Post-Event Notes**: Document outcomes and contacts

---

## 🎓 Tips & Best Practices

### ✅ DO:
- ✅ Set reminders for all important events
- ✅ Link events to job applications when possible
- ✅ Be specific in titles and descriptions
- ✅ Document outcomes after events
- ✅ Include contact information in notes
- ✅ Use all-day toggle for career fairs
- ✅ Add preparation notes before events

### ❌ DON'T:
- ❌ Use vague titles like "Event" or "Reminder"
- ❌ Forget to mark events as completed
- ❌ Skip adding outcomes after attending
- ❌ Ignore the reminder settings
- ❌ Create events without dates
- ❌ Duplicate events unnecessarily

---

## 🔧 Customization Ideas

### Add Custom Event Types
Edit `supabase-events-setup.sql` and `EventForm.jsx`:
```sql
-- Add your custom type to the check constraint
event_type text not null check (event_type in (
  'Career Fair',
  'Your Custom Type',  -- Add here
  ...
))
```

### Adjust Reminder Options
Edit `EventForm.jsx` line ~261:
```jsx
<select name="reminder_hours_before">
  <option value="1">1 hour before</option>
  <option value="12">12 hours before</option>  // Add custom
  ...
</select>
```

---

## 📊 Statistics Explained

### Upcoming
Count of events with:
- Status = "Upcoming"
- Event date in the future

### This Week
Count of upcoming events with:
- Event date within next 7 days

### This Month
Count of upcoming events with:
- Event date within next 30 days

### Completed
Count of all events with:
- Status = "Completed"

---

## 🐛 Troubleshooting

### Problem: Events not showing
**Solution:**
1. Check status filter (might be filtering them out)
2. Clear search box
3. Verify events exist in Supabase table
4. Check browser console for errors

### Problem: Can't create events
**Solution:**
1. Verify database table exists
2. Check RLS policies are in place
3. Ensure you're logged in
4. Check form validation errors

### Problem: Statistics wrong
**Solution:**
1. Refresh the page
2. Check event dates are valid
3. Verify statuses are set correctly
4. Open browser console for errors

### Problem: Sidebar link missing
**Solution:**
1. Verify `App.jsx` has Events import
2. Check route is configured
3. Restart dev server
4. Clear browser cache

---

## 🔐 Security & Privacy

### Row Level Security (RLS)
All events are protected by RLS policies:
- ✅ You can only see YOUR events
- ✅ You can only edit YOUR events
- ✅ You can only delete YOUR events
- ✅ Other users can't see your events

### Data Storage
- All data stored in Supabase (secure)
- No data leaves your Supabase instance
- Encrypted in transit and at rest
- User authentication required

---

## 📱 Mobile Responsive

The Events page works great on mobile:
- Touch-friendly buttons
- Stacked layout on small screens
- Easy to add/edit events on the go
- Full functionality on all devices

---

## 🔮 Future Enhancements

Potential features for future:
- [ ] Calendar view (month/week/day)
- [ ] Export to Google Calendar / iCal
- [ ] Email/push notifications
- [ ] Recurring events
- [ ] Event templates
- [ ] Color coding by type
- [ ] Drag-and-drop reordering
- [ ] Event sharing with others
- [ ] Attach files to events
- [ ] Map integration for locations

---

## 📞 Need Help?

### Documentation Order
1. Start here: `EVENTS_README.md` (this file)
2. Quick tips: `EVENTS_QUICK_REFERENCE.md`
3. All features: `EVENTS_PAGE_FEATURES.md`
4. Visual guide: `EVENTS_VISUAL_GUIDE.md`
5. Technical details: `EVENTS_IMPLEMENTATION_SUMMARY.md`
6. Setup checklist: `EVENTS_SETUP_CHECKLIST.md`

### Common Questions

**Q: Can I change event types after creation?**
A: Yes! Edit the event and select a different type.

**Q: What happens to events linked to deleted applications?**
A: The event remains, but the link becomes null (no error).

**Q: Can I have multiple events on the same day?**
A: Absolutely! Create as many as you need.

**Q: Do reminders send emails?**
A: Not yet. Reminder field is tracked but requires external setup for notifications.

**Q: Can I export my events?**
A: Not built-in yet, but data is in Supabase and can be exported from there.

**Q: How do I backup my events?**
A: Events are in your Supabase database. Use Supabase backup features.

---

## ✅ Quick Test

After setup, test these:
1. [ ] Create a test event
2. [ ] Search for it
3. [ ] Filter by status
4. [ ] Edit the event
5. [ ] Mark as completed
6. [ ] Add outcome notes
7. [ ] Delete the test event

If all work, you're good to go! 🎉

---

## 🎊 You're All Set!

The Events feature is now ready to help you:
- Never miss a career fair
- Stay on top of deadlines
- Remember to follow up
- Track networking opportunities
- Organize your job search

**Start by adding your next career event!**

Happy job hunting! 🚀

---

*Last updated: January 2026*
*Version: 1.0.0*
