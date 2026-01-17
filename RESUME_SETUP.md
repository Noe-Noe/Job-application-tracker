# Resume Page Setup Guide

## Quick Start

Follow these steps to get the Resume page working in your job application tracker.

## 1. Database Setup

Run the SQL script to create the resumes table:

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase-resumes-setup.sql`
5. Click **Run** to execute

This will create:
- `resumes` table with all necessary columns
- Row Level Security policies
- Indexes for better performance

## 2. Verify Installation

The following files have been created:

```
src/
  pages/
    Resume.jsx          # Main resume page component
  components/
    ResumeForm.jsx      # Add/Edit resume modal form

supabase-resumes-setup.sql    # Database setup script
RESUME_PAGE_FEATURES.md       # Complete feature documentation
RESUME_SETUP.md               # This file
```

## 3. Test the Feature

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in to your application

3. Click **"Saved Resume"** in the sidebar

4. You should see:
   - Empty state with "Add Resume" button
   - Stats cards showing 0 resumes
   - Search and filter options

5. Click **"Add Resume"** to test the form

## 4. Add Your First Resume

### Option A: Using Cloud Storage (Recommended)

1. Upload your resume to Google Drive or Dropbox
2. Get a shareable link
3. In the app, click "Add Resume"
4. Fill in:
   - Title: "Software Engineer Resume 2026"
   - Description: "Technical resume for software engineering roles"
   - Type: "Technical"
   - Format: "PDF"
   - File URL: Paste your cloud storage link
   - Tags: "React, Node.js, JavaScript, AWS"
   - Check "Set as default"
5. Click "Save Resume"

### Option B: No File Link

You can also track resumes without file links:
- Use the app just to organize resume metadata
- Add notes about where the file is stored locally
- Use tags to remember which version is which

## 5. Features to Try

### Search and Filter
- Search by title, description, or tags
- Filter by resume type
- Sort by date, title, or type
- Toggle between grid and list view

### Resume Management
- Set one resume as default
- Edit resume details
- Delete old versions
- View/download files via links

### Organization Tips
- Create different versions for different job types
- Use tags for skills and technologies
- Add notes about target companies
- Keep one resume as default

## 6. Integration with Applications

While the Resume page is standalone, you can reference it when:
- Applying to jobs (check which resume to send)
- Updating your applications (link to resume version)
- Tracking which version worked best

## 7. Troubleshooting

### "Failed to fetch resumes"
- Check that you ran the SQL setup script
- Verify you're logged in
- Check browser console for errors

### "Failed to save resume"
- Ensure title field is filled in
- Check that file URL is valid (if provided)
- Verify Supabase connection

### Resume not appearing
- Check filters - reset to "All" types
- Verify the resume was saved (check Supabase table)
- Try refreshing the page

## 8. Database Verification

To verify the table was created:

1. Go to Supabase **Table Editor**
2. Look for `resumes` table
3. Should have columns:
   - id
   - user_id
   - title
   - description
   - resume_type
   - file_format
   - file_url
   - tags
   - is_default
   - notes
   - created_at
   - updated_at

## 9. Security

The resume page uses Row Level Security (RLS):
- Users can only see their own resumes
- Data is automatically filtered by user_id
- No one else can access your resume data

## 10. Cloud Storage Setup (Optional)

### Google Drive
1. Upload resume to Google Drive
2. Right-click → Get link → Anyone with the link can view
3. Copy link and paste in File URL field

### Dropbox
1. Upload resume to Dropbox
2. Share → Create link → Copy link
3. Change `dl=0` to `dl=1` at the end for direct download
4. Paste in File URL field

### OneDrive
1. Upload to OneDrive
2. Share → Anyone with the link can view
3. Copy link and paste in File URL field

## Next Steps

1. **Run the SQL setup script** ✓
2. **Add your first resume** ✓
3. **Set a default resume** ✓
4. **Explore the features** ✓
5. **Read the full documentation** in `RESUME_PAGE_FEATURES.md`

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify the SQL script ran successfully
3. Ensure Supabase credentials are correct
4. Check that you're using a supported browser

---

**Congratulations!** Your Resume page is ready to use. Start organizing your resume versions today!
