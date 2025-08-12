# Facility Edit/Delete Submission Feature

## Overview

This feature allows facilities to edit and delete their health data submissions if they haven't passed the admin-configured deadline date. The system automatically enforces deadline restrictions and provides a user-friendly interface for managing submissions.

## Features

### 1. Deadline-Based Editability

- Facilities can only edit/delete submissions that haven't passed the monthly deadline
- The deadline is configurable by administrators (default: 15th of each month)
- Real-time deadline checking with clear user feedback

### 2. Edit Functionality

- **Field Value Editing**: Edit numeric, string, boolean, and JSON field values
- **Remarks Management**: Add or modify remarks for each field
- **Category Grouping**: Fields are organized by category for better UX
- **Validation**: Input validation based on field type

### 3. Delete Functionality

- **Complete Deletion**: Removes all associated data including:
  - Field values
  - Remuneration calculations
  - Worker remuneration records
  - Facility remuneration records
  - Facility targets
- **Transaction Safety**: All deletions are performed within database transactions
- **Confirmation Dialog**: Clear warning about the permanent nature of deletion

### 4. User Interface

- **Edit Button**: Only visible for editable submissions
- **Status Indicators**: Clear visual feedback about editability
- **Modal Interface**: Comprehensive editing interface with field grouping
- **Responsive Design**: Works on all device sizes

## Technical Implementation

### API Endpoints

#### `GET /api/health-data/facility-submissions/[id]`

- Retrieves submission data for editing
- Checks deadline-based editability
- Returns formatted field values with metadata

#### `PUT /api/health-data/facility-submissions/[id]`

- Updates submission field values
- Validates deadline restrictions
- Handles different field types appropriately

#### `DELETE /api/health-data/facility-submissions/[id]`

- Deletes entire submission and related data
- Uses database transactions for data consistency
- Returns detailed deletion breakdown

### Core Functions

#### `canFacilityEditSubmission(reportMonth: string)`

- Checks if a submission can be edited based on deadline
- Returns editability status with reason and deadline information
- Handles date parsing and validation

### Components

#### `EditSubmissionModal`

- Main editing interface component
- Handles field value updates and deletion
- Provides comprehensive field management

#### Updated `FacilityHealthDataPage`

- Shows edit/delete buttons for eligible submissions
- Displays deadline information and editability status
- Integrates with the edit modal

## Security Features

### Access Control

- Only facility users can access their own submissions
- Session-based authentication required
- Facility ownership verification

### Deadline Enforcement

- Server-side deadline validation
- No client-side bypass possible
- Automatic deadline calculation based on admin settings

### Data Integrity

- Transaction-based operations
- Comprehensive cleanup of related data
- Audit trail through logging

## User Experience

### Visual Feedback

- **Green indicators** for editable submissions
- **Gray indicators** for non-editable submissions
- **Clear deadline information** displayed prominently
- **Status messages** explaining current state

### Error Handling

- Graceful error messages for failed operations
- Clear explanations for deadline restrictions
- User-friendly validation feedback

### Responsiveness

- Modal interface adapts to screen size
- Touch-friendly controls on mobile devices
- Keyboard navigation support

## Configuration

### Admin Settings

- **Deadline Day**: Configurable day of month (1-31)
- **Default Value**: 15th of each month
- **Real-time Updates**: Changes take effect immediately

### Deadline Logic

- Submissions are editable until the deadline day of the report month
- After deadline, editing is permanently disabled
- New month resets the editing window

## Usage Examples

### Editing a Submission

1. Navigate to facility health data page
2. Click "Edit" button on eligible submission
3. Modify field values as needed
4. Add or update remarks
5. Click "Save Changes"

### Deleting a Submission

1. Open edit modal for eligible submission
2. Click "Delete Submission" button
3. Confirm deletion in warning dialog
4. System removes all associated data

### Viewing Deadline Information

- Deadline status is displayed below each submission
- Green calendar icon indicates editability
- Gray info icon shows why editing is disabled

## Future Enhancements

### Potential Improvements

- **Bulk Operations**: Edit multiple submissions at once
- **Version History**: Track changes to submissions
- **Approval Workflow**: Require admin approval for major changes
- **Audit Logging**: Detailed change tracking
- **Email Notifications**: Alert users about approaching deadlines

### Performance Optimizations

- **Caching**: Cache deadline calculations
- **Batch Processing**: Handle multiple field updates efficiently
- **Lazy Loading**: Load field data on demand

## Troubleshooting

### Common Issues

#### "Submission cannot be edited" Error

- Check if the deadline has passed
- Verify admin deadline configuration
- Ensure report month format is correct

#### Missing Edit Button

- Verify user has facility role
- Check submission ownership
- Confirm deadline hasn't passed

#### Field Values Not Saving

- Validate field type compatibility
- Check for required field constraints
- Verify database connection

### Debug Information

- Enable console logging for detailed error information
- Check API response status codes
- Verify session and authentication state

## Testing

### Test Scenarios

1. **Before Deadline**: Verify editing is allowed
2. **On Deadline**: Verify editing is allowed
3. **After Deadline**: Verify editing is blocked
4. **Month Transition**: Verify status updates correctly
5. **Permission Checks**: Verify access control works
6. **Data Integrity**: Verify deletion removes all related data

### Test Data

- Use different report months to test deadline logic
- Test with various field types and values
- Verify error handling with invalid data

## Conclusion

This feature provides facilities with comprehensive control over their submissions while maintaining data integrity and security. The deadline-based approach ensures compliance with administrative requirements while offering flexibility for necessary corrections.
