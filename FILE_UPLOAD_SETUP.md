# Resume File Upload Setup Guide

## Overview

Your resume page now supports **TWO ways** to add resumes:

1. **Upload from Computer** - Upload PDF, DOCX, or TXT files directly (NEW!)
2. **Add Link** - Link to Google Drive, Dropbox, etc. (Original method)

## Setup Instructions

### Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Storage** in the left sidebar
3. Click **"New Bucket"**
4. Enter bucket name: `resumes`
5. Check **"Public bucket"** (allows sharing resume links with employers)
6. Click **"Create bucket"**

### Step 2: Configure Storage Policies

Run the storage setup SQL:

1. Go to **SQL Editor** in Supabase
2. Click **"New Query"**
3. Copy and paste the contents of `supabase-storage-setup.sql`
4. Click **"Run"** to execute

This will create security policies so:
- Users can only upload/view/delete their own files
- Files are organized by user ID
- Public URLs work for sharing with employers

### Step 3: Verify Setup

1. Go to **Storage** → **resumes** bucket
2. You should see it's a public bucket
3. Policies tab should show 5 policies

### Step 4: Test File Upload

1. Start your app: `npm run dev`
2. Go to Saved Resume page
3. Click **"Add Resume"**
4. Select **"Upload File"** tab
5. Choose a PDF/DOCX file from your computer
6. Click **"Save Resume"**
7. File should upload successfully!

## How It Works

### File Upload Process

```
1. User selects file from computer
   ↓
2. File validated (type & size)
   ↓
3. File uploaded to Supabase Storage
   ↓ (organized by user ID)
4. Public URL generated
   ↓
5. URL saved to database
   ↓
6. Resume appears in list with download link
```

### File Organization

Files are stored with this structure:
```
resumes/
  ├── user-id-1/
  │   ├── 1705512000000-abc123.pdf
  │   ├── 1705512100000-def456.docx
  │   └── 1705512200000-ghi789.pdf
  ├── user-id-2/
  │   └── 1705512300000-jkl012.pdf
  └── ...
```

### Security Features

- ✅ Users can only access their own files
- ✅ Files organized by user ID folders
- ✅ Public URLs for sharing (but not discoverable)
- ✅ File type validation (PDF, DOCX, TXT only)
- ✅ File size limit (10MB max)
- ✅ Old files deleted when updating

## File Upload Features

### Supported File Types
- **PDF** (`.pdf`) - Most professional format
- **DOCX** (`.docx`) - Microsoft Word format
- **TXT** (`.txt`) - Plain text format

### File Size Limit
- **Maximum**: 10MB per file
- Files larger than 10MB will be rejected

### File Validation
- ✅ Type checking (only PDF, DOCX, TXT)
- ✅ Size checking (max 10MB)
- ✅ Auto-detect format from file
- ✅ Preview selected file before upload
- ✅ Progress indicator during upload

### Upload UI Features
- **Drag & Drop area** (visual feedback)
- **File preview** (shows name and size)
- **Remove file** (before saving)
- **Progress bar** (shows upload status)
- **Error handling** (clear error messages)

## Using the Upload Feature

### Option 1: Upload File from Computer

1. Click **"Add Resume"**
2. Select **"Upload File"** tab
3. Click **"Choose file"** or drag & drop
4. Select your resume file
5. File name and size will display
6. Fill in other details (title, type, etc.)
7. Click **"Save Resume"**
8. File uploads automatically!

### Option 2: Add Link (Original Method)

1. Click **"Add Resume"**
2. Select **"Add Link"** tab
3. Paste Google Drive/Dropbox link
4. Fill in other details
5. Click **"Save Resume"**

## Benefits of File Upload

### For Users
- **No external storage needed** - Keep everything in one place
- **Faster setup** - No need to upload to Drive first
- **Better organization** - All files in your Supabase project
- **Easy sharing** - Get public URL automatically
- **Version control** - Easy to replace with updated versions

### For Security
- **User isolation** - Files separated by user ID
- **Access control** - Row Level Security on storage
- **Public sharing** - Share links with employers safely
- **Auto cleanup** - Old files deleted when updating

## File Management

### Viewing Files
- Click **"View/Download"** button on any resume
- Opens file in new tab
- Can download or share link with employers

### Updating Files
- Click **"Edit"** on a resume
- Select **"Upload File"** tab
- Choose new file
- Old file automatically deleted
- New file uploaded and URL updated

### Deleting Resumes
- Click delete button on resume
- Database entry removed
- File remains in storage (for URL history)
- Can manually clean up from Storage if needed

## Troubleshooting

### "Failed to upload file"

**Possible causes:**
- File too large (max 10MB)
- Wrong file type (only PDF, DOCX, TXT)
- Storage bucket not created
- Network issue

**Solutions:**
1. Check file size and type
2. Verify storage bucket exists
3. Check browser console for errors
4. Try again with smaller file

### "Storage bucket not found"

**Solution:**
1. Go to Supabase Storage
2. Create bucket named `resumes`
3. Make it public
4. Run the storage setup SQL

### "Permission denied"

**Solution:**
1. Verify you're logged in
2. Check storage policies are set up
3. Run `supabase-storage-setup.sql`

### File won't download

**Solution:**
1. Check bucket is public
2. Verify file was uploaded
3. Try opening URL directly in browser

## Storage Limits

### Supabase Free Tier
- **Storage**: 1GB total
- **Bandwidth**: 2GB per month
- **File uploads**: Unlimited number

### Recommended File Sizes
- **Optimal**: 100-500 KB (compressed PDF)
- **Good**: 500 KB - 2 MB
- **Maximum**: 10 MB (enforced by app)

### Tips to Reduce File Size
1. Export PDF with "Reduce file size" option
2. Remove embedded images if possible
3. Use black & white instead of color
4. Compress PDF online (e.g., smallpdf.com)

## Manual Storage Management

### View Uploaded Files
1. Go to Supabase Storage
2. Click **resumes** bucket
3. Browse by user ID folders
4. See all uploaded files

### Delete Files Manually
1. Navigate to file in Storage
2. Click three dots (...)
3. Select **"Delete"**
4. Confirm deletion

### Check Storage Usage
1. Go to Project Settings
2. Check Storage usage
3. Monitor against free tier limit

## Database Integration

The uploaded file URL is automatically saved to the `file_url` field in the `resumes` table:

```sql
-- Example record after upload
{
  "id": "uuid",
  "title": "Software Engineer Resume",
  "file_url": "https://[project].supabase.co/storage/v1/object/public/resumes/[user-id]/[timestamp]-[random].pdf",
  "file_format": "PDF",
  ...
}
```

## Migration from Links

If you already have resumes with Google Drive/Dropbox links:

1. They continue to work - no changes needed!
2. Can mix both methods (some uploaded, some linked)
3. When editing, can replace link with upload
4. Or keep link and just update other details

## Best Practices

### File Naming
- Use descriptive titles in the app
- Original filename doesn't matter (auto-renamed)
- Files named: `timestamp-random.extension`

### Version Control
- Upload new version when editing
- Old file automatically deleted
- Keeps storage usage down

### Sharing with Employers
- File URL is public (but not discoverable)
- Safe to share direct link
- Consider privacy of file content

### Organization
- Use tags to categorize uploads
- Add notes about each version
- Set default for primary resume

## Next Steps

1. ✅ Create storage bucket in Supabase
2. ✅ Run storage setup SQL
3. ✅ Test uploading a file
4. ✅ Verify download works
5. ✅ Try updating a resume with new file

---

**Congratulations!** You can now upload resume files directly from your computer!
