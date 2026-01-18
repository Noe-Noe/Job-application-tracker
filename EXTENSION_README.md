# Job Application Tracker - Browser Extension

## Overview

The Job Application Tracker Browser Extension allows you to save job applications from any job board (LinkedIn, Indeed, Glassdoor, etc.) directly to your Job Tracker dashboard with a single click.

## Features

- 🎯 **One-Click Save**: Floating button appears on job posting pages
- 🔍 **Smart Extraction**: Automatically extracts company, position, location, and salary
- 🌐 **Universal**: Works on LinkedIn, Indeed, Glassdoor, Lever, Greenhouse, and more
- 🔒 **Secure**: Uses your existing authentication token
- 📝 **Editable**: All extracted data can be edited later in your dashboard

## Installation

### Step 1: Install the Extension

#### For Chrome/Edge:
1. Download the `extension` folder from this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `extension` folder
6. The extension icon will appear in your toolbar

#### For Firefox:
1. Download the `extension` folder
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the extension folder

### Step 2: Configure the Extension

1. **Log in to your Job Tracker web app**
2. Go to **Settings** page
3. In the "Browser Extension" section, you'll see:
   - **API Endpoint**: Your website URL (automatically displayed)
   - **API Token**: Your authentication token
4. **Copy both values**
5. Click the extension icon in your browser toolbar
6. Paste the **API Endpoint** and **API Token** into the extension popup
7. Click **"Save Configuration"**
8. Click **"Test Connection"** to verify it works
9. You should see "✓ Connected successfully!"

## How to Use

### Saving a Job Application

1. **Navigate to any job posting page** on sites like:
   - LinkedIn Jobs
   - Indeed
   - Glassdoor
   - Company career pages
   - Any website with job listings

2. **Look for the floating button** in the bottom-right corner:
   - "Save to Job Tracker" button will appear automatically
   - The button is draggable - you can move it anywhere on the page

3. **Click the button** to save:
   - The extension extracts job details automatically
   - Data is sent securely to your Job Tracker
   - You'll see "Saved!" confirmation

4. **View in your dashboard**:
   - Go to your Job Tracker website
   - Click on "Jobs" in the sidebar
   - Your saved application will appear at the top

### What Data Gets Extracted?

The extension intelligently extracts:
- ✅ **Company Name**
- ✅ **Job Title/Position**
- ✅ **Location** (city, state, or remote)
- ✅ **Salary Range** (if available)
- ✅ **Job URL** (link to the original posting)
- ✅ **Applied Date** (automatically set to today)

All data is **editable** after saving - just click "Edit" on the application in your dashboard.

## Supported Job Boards

The extension has optimized extraction for:

- **LinkedIn** (`linkedin.com/jobs`)
- **Indeed** (`indeed.com`)
- **Glassdoor** (`glassdoor.com`)
- **ZipRecruiter** (`ziprecruiter.com`)
- **Monster** (`monster.com`)
- **Lever** (`lever.co`)
- **Greenhouse** (`greenhouse.io`)
- **Workday** (`workday.com`)
- **Generic Job Sites** (works on most career pages)

## Troubleshooting

### Extension button doesn't appear
- Make sure you're on a job posting page
- Try refreshing the page
- Check that the extension is enabled in your browser

### "Not Connected" status
- Verify your API Token is correct
- Make sure you're logged into your Job Tracker website
- Try refreshing your token: Go to Settings → Click "Refresh Token"
- Test the connection again

### Data extraction is incomplete
- Some job boards may not display all information
- You can manually edit any field after saving
- The extension adds a note "Auto-extracted from page. Please verify details."

### "Failed to save application"
- Check your internet connection
- Verify the API Endpoint URL is correct
- Make sure your API Token hasn't expired (refresh it in Settings)
- Try logging out and back into your Job Tracker website

## Privacy & Security

- 🔒 **Your data stays secure**: Extension communicates directly with your Job Tracker backend
- 🔐 **Token-based auth**: Uses your existing authentication, no additional passwords
- 🚫 **No tracking**: Extension doesn't collect analytics or track your browsing
- 💾 **Local storage only**: Extension only stores your API endpoint and token locally

## How It Works (Technical)

```
1. User logs into Job Tracker web app
2. User gets API token from Settings page
3. User configures browser extension with token
4. On job posting pages:
   - Content script detects job-related content
   - Floating button is injected into page
5. When user clicks "Save":
   - Extension extracts job data from page
   - Sends data to backend API with Bearer token
   - Backend validates token with Supabase
   - Backend identifies user from token
   - Application is saved to user's account
```

## API Endpoints

The extension uses these API endpoints:

### `POST /api/applications/from-extension`
Saves a job application to the user's account.

**Headers:**
```
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "company": "Company Name",
  "position": "Job Title",
  "location": "City, State",
  "salary": "$80k - $100k",
  "job_url": "https://...",
  "notes": "Auto-saved from browser extension"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* application object */ },
  "message": "Application saved successfully"
}
```

### `GET /api/test-connection`
Tests if the API token is valid.

**Headers:**
```
Authorization: Bearer <YOUR_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Connection successful",
  "email": "user@example.com",
  "user_id": "uuid"
}
```

## Customization

### Changing Button Position
The button is draggable - just click and drag it to your preferred location on any page.

### Editing Extracted Data
After saving, go to your Job Tracker dashboard and click "Edit" on any application to modify the details.

## Updates

To update the extension:
1. Download the latest version
2. Go to your browser's extension page
3. Click "Reload" on the Job Tracker extension
4. Your configuration (API token) will be preserved

## Support

If you encounter issues:
1. Check the browser console for error messages (F12 → Console)
2. Verify your API token in Settings
3. Try refreshing the token
4. Make sure you're logged into the Job Tracker website

## Credits

Built with ❤️ for job seekers to streamline their application tracking process.
