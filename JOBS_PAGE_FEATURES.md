# Jobs Page - Feature Overview

## What is the Jobs Page?

The Jobs page is a comprehensive management interface for viewing and managing ALL your job applications. It complements the Dashboard by providing detailed list management capabilities.

## Key Features Implemented

### 1. Advanced Search & Filtering
- **Search Bar**: Search by company name, position, or location in real-time
- **Status Filter**: Filter applications by status (Applied, Shortlisted, Interview Scheduled, etc.)
  - Shows count for each status in dropdown
- **Sort Options**: 
  - Sort by: Date Added, Applied Date, Company, Position, or Status
  - Sort order: Newest First or Oldest First

### 2. Dual View Modes
- **Table View**: Traditional spreadsheet-style view with all details visible
  - Company logo (first letter avatar)
  - Position with clickable job posting link
  - Quick status dropdown update
  - Location and applied date
  - Edit and delete actions
- **Grid View**: Card-based layout for a more visual experience
  - Large company avatar
  - All key details in a compact card
  - Quick status updates
  - Edit and delete buttons

### 3. Quick Actions
- **Quick Status Update**: Change application status directly from the list (dropdown in table view)
- **Add Application**: Quick access button in header
- **Edit Application**: Opens modal form with all current data
- **Delete Application**: With confirmation dialog

### 4. User Experience Features
- **Results Counter**: Shows "X of Y applications" after filtering
- **Empty States**: 
  - No applications yet → Call-to-action to add first application
  - No matching filters → Helpful message to adjust search
- **Loading States**: Spinner animation while fetching data
- **Responsive Design**: Works on all screen sizes
- **Hover Effects**: Visual feedback on interactive elements

### 5. Data Display
- Company initial as avatar/logo
- Salary information (when provided)
- Location with icon
- Applied date formatted nicely
- Job posting links open in new tab
- Notes preview in grid view (truncated with line-clamp)

## Difference from Dashboard

| Feature | Dashboard | Jobs Page |
|---------|-----------|-----------|
| Purpose | Overview & stats | Full list management |
| View | Recent applications only | ALL applications |
| Filtering | None | Advanced search & filters |
| Sorting | Fixed (newest first) | Customizable sorting |
| View Modes | Single view | Table & Grid views |
| Focus | Quick insights | Detailed management |

## How to Use

1. **Navigate**: Click "Jobs" in the sidebar
2. **Search**: Type in search bar to find specific applications
3. **Filter**: Use status dropdown to see only certain statuses
4. **Sort**: Change sorting method and order
5. **Switch Views**: Toggle between table and grid view
6. **Quick Update**: Change status directly from dropdown in list
7. **Manage**: Edit or delete applications with action buttons
8. **Add New**: Click "Add Application" button in header

## Technical Details

- **File**: `/src/pages/Jobs.jsx`
- **Route**: `/jobs`
- **Components Used**: 
  - Sidebar (navigation)
  - ApplicationForm (modal for add/edit)
- **Database**: Fetches from `applications` table in Supabase
- **Real-time Updates**: Refetches data after any changes

## Status Options

The page supports all 8 application statuses:
1. Applied
2. Shortlisted
3. Interview Scheduled
4. Interview Completed
5. Offer Received
6. Rejected
7. Accepted
8. Withdrawn

Each status has its own color coding for easy visual identification.
