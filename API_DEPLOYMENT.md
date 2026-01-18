# API Deployment Guide

## Overview

The Job Tracker has two API endpoints that enable the browser extension to save job applications:

1. `POST /api/applications/from-extension` - Saves job applications
2. `GET /api/test-connection` - Tests authentication

## Deployment on Vercel

These API endpoints are set up as **Vercel Serverless Functions** and will automatically deploy when you push to Vercel.

### File Structure
```
/api
  /applications
    from-extension.js     # Handles job saves from extension
  test-connection.js      # Tests API token validity
```

### How It Works

1. **User Authentication**: 
   - User logs into the web app normally
   - User's session token is stored by Supabase
   - Token is displayed in Settings page

2. **Extension Communication**:
   - Extension sends Bearer token with each request
   - API validates token using `supabase.auth.getUser(token)`
   - API automatically identifies which user owns the data

3. **Data Flow**:
   ```
   Browser Extension → Vercel API → Supabase → User's Applications
   ```

### Configuration Required

#### Environment Variables
Make sure these are set in your Vercel project:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These should already be set if your main app is working.

#### CORS Configuration
The API endpoints include CORS headers to allow requests from browser extensions:

```javascript
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
```

### Testing the API

#### Test Connection Endpoint
```bash
curl -X GET \
  https://your-app.vercel.app/api/test-connection \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

Expected response:
```json
{
  "success": true,
  "message": "Connection successful",
  "email": "user@example.com",
  "user_id": "uuid-here"
}
```

#### Save Application Endpoint
```bash
curl -X POST \
  https://your-app.vercel.app/api/applications/from-extension \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json' \
  -d '{
    "company": "Test Company",
    "position": "Software Engineer",
    "location": "San Francisco, CA",
    "salary": "$100k - $120k",
    "job_url": "https://example.com/job"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company": "Test Company",
    "position": "Software Engineer",
    ...
  },
  "message": "Application saved successfully"
}
```

### Troubleshooting

#### 401 Unauthorized
- Token is invalid or expired
- User needs to refresh token in Settings
- Check if `VITE_SUPABASE_ANON_KEY` is set correctly

#### 500 Internal Server Error
- Check Vercel function logs
- Verify Supabase connection
- Ensure `applications` table exists with correct schema

#### CORS Errors
- Verify CORS headers are being set
- Check browser console for specific error
- Ensure extension has proper host permissions

### Monitoring

View API logs in Vercel:
1. Go to your Vercel project dashboard
2. Click on "Functions" tab
3. Select the function to view logs
4. Monitor for errors or unusual activity

### Security Notes

1. **Token Security**:
   - Tokens are JWT tokens from Supabase
   - They expire automatically (configurable in Supabase)
   - Users can refresh tokens from Settings page

2. **Rate Limiting**:
   - Consider adding rate limiting in production
   - Vercel automatically provides some DDoS protection

3. **Data Validation**:
   - API validates that company OR position is provided
   - User ID is extracted from token, not from request body
   - All other fields are optional

### Local Development

To test the API locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run in dev mode
vercel dev
```

The API will be available at `http://localhost:3000/api/*`

### Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase `applications` table exists
- [ ] Row Level Security (RLS) policies are enabled
- [ ] Test both API endpoints with real tokens
- [ ] Extension configured with production URL
- [ ] CORS headers allow extension requests
- [ ] Error logging is working
- [ ] Monitor API usage in Vercel dashboard
