# 📤 FILE UPLOAD - QUICK REFERENCE CARD

## ⚡ 2-Minute Setup

### Step 1: Create Bucket (1 min)
```
Supabase → Storage → New Bucket
Name: "resumes"
✓ Public bucket
Create!
```

### Step 2: Set Policies (1 min)
```
SQL Editor → Run: supabase-storage-setup.sql
```

### ✅ Done! Start uploading!

---

## 🎯 How to Upload

```
1. Click "Add Resume"
2. Select "Upload File" tab
3. Choose PDF/DOCX/TXT
4. Fill in title and details
5. Click "Save Resume"
6. Done!
```

---

## 📋 File Specs

| Property | Value |
|----------|-------|
| **Max Size** | 10 MB |
| **Formats** | PDF, DOCX, TXT |
| **Storage** | Supabase Storage |
| **URL Type** | Public (shareable) |

---

## 🔀 Two Methods Available

### Upload File (NEW!)
- ✅ From computer
- ✅ Auto-managed
- ⚠️ 10MB limit

### Add Link
- ✅ Google Drive, Dropbox
- ✅ No size limit
- ⚠️ External dependency

**Pick what works best for each resume!**

---

## 🎨 UI Changes

### Upload Tab
```
[Upload File] ✓  [Add Link]

┌─────────────────┐
│   ☁️            │
│ [Choose file]   │
│ 10MB max        │
└─────────────────┘
```

### After Selection
```
✅ resume.pdf
245 KB
[Remove file]
```

### Progress
```
Uploading... 67%
▓▓▓▓▓▓▓▓▓░░░
```

---

## 🔐 Security

- ✅ User-isolated folders
- ✅ Public URLs (but not discoverable)
- ✅ Row Level Security
- ✅ Type & size validation

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| "Bucket not found" | Create bucket |
| "Permission denied" | Run SQL setup |
| Upload fails | Check file size/type |
| Can't download | Verify bucket is public |

---

## 💾 Storage Info

### Free Tier
- **Total**: 1 GB
- **Bandwidth**: 2 GB/month

### Optimal File Sizes
- **Best**: 100-500 KB
- **Good**: 500 KB - 2 MB
- **Max**: 10 MB

---

## 📊 File Organization

```
resumes/
  └── user-abc123/
      ├── 170551-x1y2.pdf
      └── 170552-a4b5.docx
```

---

## 🎯 Features

- ✅ Direct upload from PC
- ✅ Progress indicator
- ✅ File preview
- ✅ Auto format detection
- ✅ Delete old file when updating
- ✅ Public shareable URLs
- ✅ Error handling
- ✅ Works with link method

---

## 🚀 Quick Commands

### Check Storage Usage
```
Supabase → Settings → Usage
```

### View Uploaded Files
```
Supabase → Storage → resumes
```

### Delete Files Manually
```
Storage → resumes → user folder → ... → Delete
```

---

## 📱 Use Cases

### When to Upload
- ✅ Quick setup
- ✅ Small files (<10MB)
- ✅ Keep everything together
- ✅ Auto file management

### When to Link
- ✅ Large files (>10MB)
- ✅ Already on Drive/Dropbox
- ✅ Save storage quota
- ✅ Multiple copies needed

---

## 🔧 Code Location

| Component | File |
|-----------|------|
| Upload UI | `ResumeForm.jsx` |
| Upload logic | `uploadFile()` function |
| File validation | `handleFileSelect()` |
| Storage setup | `supabase-storage-setup.sql` |

---

## ✅ Testing Checklist

Quick test (2 min):
- [ ] Upload PDF → Works?
- [ ] Download → Opens?
- [ ] Update file → Old deleted?
- [ ] Try >10MB → Rejected?

---

## 📚 Documentation

| File | What's Inside |
|------|--------------|
| **FILE_UPLOAD_SETUP.md** | Full setup guide |
| **FILE_UPLOAD_SUMMARY.md** | Complete overview |
| **FILE_UPLOAD_VISUAL_GUIDE.md** | UI screenshots |
| **FILE_UPLOAD_QUICK_REFERENCE.md** | This card! |

---

## 💡 Pro Tips

1. **Compress PDFs** to save space
2. **Use descriptive titles** in app
3. **Delete old versions** regularly
4. **Mix both methods** as needed
5. **Monitor storage** usage

---

## 🎉 What You Get

✨ **Upload directly** from computer  
✨ **Auto-managed** storage  
✨ **Public URLs** for sharing  
✨ **10MB per file** limit  
✨ **PDF, DOCX, TXT** supported  
✨ **Progress** indicators  
✨ **Secure** user isolation  
✨ **Easy** file management  

---

## ⏱️ Time Estimates

- **Setup**: 3-5 minutes (one-time)
- **Upload file**: 5-30 seconds
- **Update resume**: 10-40 seconds
- **Delete resume**: 2 seconds

---

## 🌟 Key Points

1. **Two methods** now available (Upload + Link)
2. **Super easy** setup (just create bucket)
3. **Auto cleanup** when updating files
4. **Works great** with existing features
5. **No breaking changes** to current resumes

---

**Setup Time**: 3 minutes  
**Complexity**: Super Low  
**Result**: Professional resume management! 🚀

---

Need help? Check `FILE_UPLOAD_SETUP.md` for details!
