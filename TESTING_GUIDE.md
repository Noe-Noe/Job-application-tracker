# Testing Guide - Browser Extension

## Pre-Testing Checklist

Before we start testing, make sure:
- [ ] Your Job Tracker app is running (locally or deployed)
- [ ] You can log into the app
- [ ] Supabase is configured with your credentials
- [ ] You have a modern browser (Chrome, Edge, or Firefox)

## Test 1: Check Your App is Running

### If Testing Locally:
```bash
# In your project directory
npm run dev
```

Your app should be running at: `http://localhost:5173` (or similar)

### If Testing on Vercel:
Visit your deployed URL: `https://your-app.vercel.app`

## Test 2: Verify Settings Page Has API Token

1. **Open your app** (local or deployed)
2. **Log in** with your account
3. **Click Settings** in the sidebar
4. **Scroll down** to "Browser Extension" section
5. **Verify you see**:
   - API Endpoint field (should show your URL)
   - API Token field (should have a long token)
   - Copy buttons
   - Show/Hide token button

**If you DON'T see the Browser Extension section:**
- The Settings.jsx changes might not be saved
- Try refreshing the page
- Check browser console for errors (F12)

## Test 3: Load the Extension

### For Chrome/Edge:

1. Open browser and go to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Navigate to and select: `/Users/thetmyatnoe/job-application-tracker/extension`
5. You should see "Job Application Tracker" extension card
6. Make sure it's **enabled** (toggle is blue)

### For Firefox:

1. Go to: `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on"**
3. Navigate to: `/Users/thetmyatnoe/job-application-tracker/extension`
4. Select **manifest.json**

**Success indicators:**
- Extension icon appears in toolbar
- No error messages in extensions page
- Status shows "No errors"

## Test 4: Configure the Extension

1. **Click the extension icon** in your browser toolbar
2. You should see a popup with:
   - "Not Connected" status (red)
   - API Endpoint field
   - API Token field
   - Save Configuration button
   - Test Connection button

3. **Go back to your Job Tracker Settings page**
4. **Copy the API Endpoint** (click Copy button)
5. **Paste it** into extension's API Endpoint field
6. **Copy the API Token** (click Show first if needed, then Copy)
7. **Paste it** into extension's API Token field
8. **Click "Save Configuration"**
9. **Click "Test Connection"**

**Expected result:**
- Status changes to "Connected" (green)
- Message: "✓ Connected successfully! User: your-email@example.com"

**If connection fails:**
- Check if your app is running
- Verify token was copied correctly (no extra spaces)
- Check browser console (F12) for errors
- Make sure API endpoints are deployed

## Test 5: Test API Endpoints Directly

### Test the Connection Endpoint:

```bash
# Replace with your actual URL and token
curl -X GET \
  http://localhost:5173/api/test-connection \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Connection successful",
  "email": "your-email@example.com",
  "user_id": "some-uuid"
}
```

### Test the Save Endpoint:

```bash
curl -X POST \
  http://localhost:5173/api/applications/from-extension \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
    "company": "Test Company",
    "position": "Test Position",
    "location": "Test Location",
    "salary": "$100k",
    "job_url": "https://example.com"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "data": {
    "id": "some-uuid",
    "company": "Test Company",
    "position": "Test Position",
    ...
  },
  "message": "Application saved successfully"
}
```

**If API tests fail:**
- Check Vercel deployment logs
- Verify .env variables are set
- Check if /api folder is being deployed
- Look at browser Network tab (F12 → Network)

## Test 6: Test on a Real Job Page

Let's test on LinkedIn (easiest to test):

1. **Go to LinkedIn Jobs**: https://www.linkedin.com/jobs/
2. **Search for any job** (e.g., "Software Engineer")
3. **Click on a job posting** to open details
4. **Look for the floating button** in bottom-right corner:
   - Should say "Save to Job Tracker"
   - Should have a purple gradient background
   - Should be draggable

**If button doesn't appear:**
- Refresh the page (F5)
- Check browser console (F12) for errors
- Make sure extension is enabled
- Try a different job posting

5. **Click the "Save to Job Tracker" button**
6. **Wait for confirmation**:
   - Button should show "Extracting..." briefly
   - Then "Saved!"
   - Then return to normal

7. **Go to your Job Tracker dashboard**
8. **Click "Jobs" in sidebar**
9. **Verify the job appears** at the top of the list

**Check the extracted data:**
- Company name should be correct
- Position should be correct
- Job URL should link back to LinkedIn
- Location might be present
- Salary might be present (if shown on LinkedIn)

## Test 7: Test on Multiple Sites

Try these sites to verify extraction works:

### Indeed
1. Go to: https://www.indeed.com/
2. Search for a job
3. Click on a posting
4. Look for "Save to Job Tracker" button
5. Click and verify it saves

### Glassdoor
1. Go to: https://www.glassdoor.com/Job/
2. Search for a job
3. Click on a posting
4. Verify button appears and saves

### Company Career Page
1. Go to any company's career page (e.g., https://www.google.com/careers)
2. Find a job posting
3. Verify button appears
4. Test saving

## Test 8: Test Error Handling

### Test with Invalid Token:
1. Open extension popup
2. Change one character in the API Token
3. Click "Save Configuration"
4. Click "Test Connection"
5. **Should show**: "Connection failed" error

### Test with No Internet:
1. Disconnect from internet
2. Try to save a job
3. **Should show**: Error message
4. Reconnect and try again

### Test with Missing Data:
The extension should still save even if some data is missing.
Try on a page with minimal job info.

## Test 9: Test Data Editing

1. **Go to your dashboard**
2. **Find a saved job** from the extension
3. **Click "Edit"**
4. **Modify the data** (change company name, add notes, etc.)
5. **Save changes**
6. **Verify changes persist**

## Test 10: Browser Console Check

1. Open any job posting page
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. **Look for**:
   - No red errors related to extension
   - You might see some info logs (that's ok)
5. Click "Save to Job Tracker"
6. **Watch for**:
   - Success message in console
   - Or error message if something fails

## Common Issues & Solutions

### Issue: Extension icon doesn't appear in toolbar
**Solution**: 
- Check Extensions page - make sure it's enabled
- Pin the extension to toolbar (click puzzle icon → pin)

### Issue: Button doesn't show on job pages
**Solution**:
- Refresh the page (F5)
- Try a different job posting
- Check if page URL contains job-related keywords
- View console for errors

### Issue: "Not Connected" status
**Solution**:
- Verify API endpoint URL is correct (no trailing slash)
- Copy token again from Settings (might have expired)
- Make sure you're logged into web app
- Try refreshing token in Settings

### Issue: Data extraction is incomplete
**Solution**:
- This is normal for some sites
- You can edit the data after saving
- Extension adds note "Please verify details"

### Issue: API returns 401 Unauthorized
**Solution**:
- Token expired - refresh it in Settings
- Copy new token to extension
- Test connection again

### Issue: Jobs not appearing in dashboard
**Solution**:
- Refresh the Jobs page
- Check Supabase database directly
- Look at browser Network tab for failed requests
- Check Vercel function logs

## Success Criteria

✅ Extension loads without errors
✅ Settings page shows API token
✅ Extension connects successfully
✅ Button appears on job pages
✅ Clicking button saves job
✅ Job appears in dashboard
✅ Data is editable
✅ Works on multiple job sites

## Next Steps After Testing

Once everything works:
1. Try different job boards
2. Save several applications
3. Test on different browsers
4. Share with friends for feedback
5. Consider converting SVG icons to PNG for better browser support

## Need Help?

If tests fail:
1. Check browser console (F12)
2. Check Vercel deployment logs
3. Verify Supabase connection
4. Check all environment variables
5. Review error messages carefully

---

Ready to test? Start with Test 1 and work your way down! 🚀
