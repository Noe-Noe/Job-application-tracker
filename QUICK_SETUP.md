# Quick Setup Guide - Browser Extension

## 🚀 5-Minute Setup

### Step 1: Install Extension (2 min)
```
1. Open Chrome/Edge/Firefox
2. Go to Extensions page:
   - Chrome: chrome://extensions/
   - Edge: edge://extensions/
   - Firefox: about:debugging#/runtime/this-firefox
3. Enable "Developer mode"
4. Click "Load unpacked" (or "Load Temporary Add-on" in Firefox)
5. Select the /extension folder
6. Extension icon appears in toolbar ✓
```

### Step 2: Get API Credentials (1 min)
```
1. Open your Job Tracker website
2. Log in to your account
3. Go to Settings page (gear icon in sidebar)
4. Scroll to "Browser Extension" section
5. You'll see:
   📍 API Endpoint: https://your-app.vercel.app
   🔑 API Token: [long token string]
6. Click "Copy" buttons to copy both ✓
```

### Step 3: Configure Extension (1 min)
```
1. Click extension icon in browser toolbar
2. Paste API Endpoint in first field
3. Paste API Token in second field
4. Click "Save Configuration"
5. Click "Test Connection"
6. Should see: "✓ Connected successfully!" ✓
```

### Step 4: Use It! (30 seconds)
```
1. Visit any job posting (LinkedIn, Indeed, etc.)
2. Look for floating button: "Save to Job Tracker"
3. Click the button
4. See "Saved!" confirmation
5. Check your Job Tracker dashboard - job is there! ✓
```

## 🎯 Visual Flow

```
┌─────────────────────────────────────────────────┐
│  1. Install Extension in Browser                │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│  2. Login to Job Tracker → Go to Settings       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│  3. Copy API Endpoint & Token                   │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│  4. Paste into Extension → Test Connection      │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│  5. Visit Job Sites → Click "Save" Button       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│  6. Jobs Appear in Your Dashboard! 🎉           │
└─────────────────────────────────────────────────┘
```

## 💡 Tips

### Where to Find the Extension After Installing
Look for the puzzle piece icon in your toolbar (Chrome/Edge) or the extensions icon (Firefox). The Job Tracker icon will be there.

### The Floating Button
- **Draggable**: Click and drag to move it anywhere on the page
- **Smart**: Only appears on job posting pages
- **Always there**: Stays in same position across pages

### What Gets Saved
| Field | Example | Can Edit Later? |
|-------|---------|----------------|
| Company | "Google" | ✅ Yes |
| Position | "Software Engineer" | ✅ Yes |
| Location | "San Francisco, CA" | ✅ Yes |
| Salary | "$120k - $150k" | ✅ Yes |
| Job URL | "https://..." | ✅ Yes |
| Status | "Applied" | ✅ Yes |
| Date | Today's date | ✅ Yes |
| Notes | "Auto-saved..." | ✅ Yes |

## 🔧 Troubleshooting

### Button doesn't appear?
- Refresh the page (F5)
- Make sure you're on a job posting page
- Check extension is enabled in browser settings

### "Not Connected" error?
- Go to Settings and click "Refresh Token"
- Copy new token to extension
- Click "Test Connection" again

### Data looks wrong?
- No problem! Edit it in your dashboard
- Click "Edit" on any application
- Update any fields and save

## 📱 Supported Sites

Works great on:
- ✅ LinkedIn Jobs
- ✅ Indeed
- ✅ Glassdoor
- ✅ Company career pages
- ✅ Most job boards
- ✅ ATS systems (Lever, Greenhouse, Workday)

## 🎉 That's It!

You're now saving job applications 10x faster!

Questions? Check [EXTENSION_README.md](EXTENSION_README.md) for full docs.
