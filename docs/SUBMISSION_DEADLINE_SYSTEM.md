# Monthly Submission Deadline System

This system allows administrators to set a monthly deadline for facility data submissions. After the deadline passes, facilities cannot submit new data until the next month begins.

## Overview

The submission deadline system works as follows:

1. **Configurable Deadline**: Admins can set a specific day of each month (1-31) as the submission deadline
2. **Monthly Reset**: Submissions reopen on the 1st of each month
3. **Automatic Enforcement**: The system automatically prevents submissions after the deadline
4. **Real-time Status**: Users can see current submission status and days remaining

## Components

### 1. Database Schema

```sql
-- SystemSetting table stores admin-configurable settings
CREATE TABLE "system_setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "system_setting_pkey" PRIMARY KEY ("id")
);

-- Unique index on the key field
CREATE UNIQUE INDEX "system_setting_key_key" ON "system_setting"("key");
```

### 2. Core Functions

#### `checkSubmissionAllowed()`
Returns the current submission status including:
- Whether submissions are currently allowed
- Days remaining until deadline
- Next deadline date
- Reason for current status

#### `getSubmissionDeadlineDay()`
Retrieves the configured deadline day from system settings.

#### `isDatePastDeadline(date, deadlineDay)`
Utility function to check if a specific date is past the deadline.

### 3. API Endpoints

#### `GET /api/admin/settings`
Retrieves all system settings (admin only).

#### `POST /api/admin/settings`
Updates system settings (admin only).

#### `GET /api/submission-status`
Returns current submission status for all users.

### 4. React Components

#### `SubmissionDeadlineBanner`
Displays current submission status as a banner. Can be used on any page to inform users about the deadline.

```tsx
import SubmissionDeadlineBanner from "@/components/SubmissionDeadlineBanner";

// Show banner on dashboard
<SubmissionDeadlineBanner showCloseButton={true} />
```

#### `SubmissionDeadlineGuard`
Wraps forms or submission components to prevent data entry when submissions are closed.

```tsx
import SubmissionDeadlineGuard from "@/components/SubmissionDeadlineGuard";

// Wrap data submission form
<SubmissionDeadlineGuard>
  <DataSubmissionForm />
</SubmissionDeadlineGuard>
```

## Implementation Examples

### 1. Adding Deadline Check to Data Upload

```tsx
import { SubmissionDeadlineGuard } from "@/components/SubmissionDeadlineGuard";

function DataUploadPage() {
  return (
    <div>
      <h1>Upload Monthly Data</h1>
      
      <SubmissionDeadlineGuard>
        <DataUploadForm />
      </SubmissionDeadlineGuard>
    </div>
  );
}
```

### 2. Showing Deadline Status on Dashboard

```tsx
import SubmissionDeadlineBanner from "@/components/SubmissionDeadlineBanner";

function DashboardPage() {
  return (
    <div>
      <SubmissionDeadlineBanner className="mb-6" />
      {/* Dashboard content */}
    </div>
  );
}
```

### 3. Custom Fallback UI

```tsx
<SubmissionDeadlineGuard
  fallback={
    <div className="custom-closed-message">
      <h2>Submissions Closed</h2>
      <p>Please wait until next month to submit data.</p>
    </div>
  }
>
  <DataForm />
</SubmissionDeadlineGuard>
```

## Configuration

### Setting the Deadline

1. Navigate to `/admin/settings`
2. Set the "Monthly Submission Deadline" to a day between 1-31
3. Click "Save Deadline Setting"

### Default Values

- **Default Deadline**: 15th of each month
- **Fallback Behavior**: If settings cannot be loaded, defaults to allowing submissions

## Status Messages

The system provides user-friendly status messages:

- **Open**: "✅ Submissions are open until [date] (X days remaining)"
- **Warning**: "⚠️ Only X days remaining until the submission deadline"
- **Deadline Day**: "⚠️ Today is the deadline for submissions!"
- **Closed**: "❌ Submissions are currently closed. Next deadline: [date]"

## Error Handling

- **Database Errors**: System falls back to default deadline (15th)
- **API Failures**: Components gracefully handle errors and show appropriate messages
- **Invalid Settings**: Validation ensures deadline is between 1-31

## Security Considerations

- **Admin Only**: Settings can only be modified by administrators
- **Validation**: All input is validated before saving
- **Audit Trail**: Settings changes are tracked with timestamps

## Testing

### Test Scenarios

1. **Before Deadline**: Submissions should be allowed
2. **On Deadline**: Submissions should be allowed with warning
3. **After Deadline**: Submissions should be blocked
4. **Month Transition**: Status should update correctly at month boundaries

### Test Data

```typescript
// Test with different dates
const testDate = new Date(2024, 0, 20); // January 20th
const deadlineDay = 15;
const isPast = isDatePastDeadline(testDate, deadlineDay); // true
```

## Troubleshooting

### Common Issues

1. **Settings Not Saving**: Check admin permissions and database connection
2. **Status Not Updating**: Verify API endpoints are working correctly
3. **Wrong Deadline**: Ensure the setting value is a valid number 1-31

### Debug Information

Enable console logging to see:
- Current submission status
- Deadline calculations
- API response data

## Future Enhancements

- **Multiple Deadlines**: Support for different deadlines per facility type
- **Grace Period**: Configurable grace period after deadline
- **Notifications**: Email/SMS reminders before deadline
- **Reporting**: Analytics on submission patterns and compliance
