# Long Roll Registration - User Guide

## Quick Start Guide for Facility Users

### Accessing the System

1. **Login** to the PLP Portal with your facility credentials
2. Navigate to **"Long Roll"** from the sidebar menu
3. You'll see the Long Roll Registration dashboard

---

## Understanding the Hierarchy

The Long Roll system follows a 4-level hierarchy:

```
Village → Section → Family → Family Members
```

**Example:**
```
Durtlang Village
  └─ Section A
      └─ House V12
          ├─ John Doe (Head of Family)
          ├─ Jane Doe (Wife)
          ├─ Tom Doe (Son)
          └─ Mary Doe (Daughter)
```

---

## Step-by-Step Instructions

### 1. Adding a Village

1. Click on the **"Villages"** tab
2. Click **"Add Village"** button
3. Enter the village name
4. Click **"Create"**

**Example:** "Durtlang Village", "Sairang Village"

---

### 2. Adding a Section

1. Click on the **"Sections"** tab
2. Select a **village** from the dropdown
3. Click **"Add Section"** button
4. Enter the section name
5. Click **"Create"**

**Example:** "Section A", "Section B", "North Block"

---

### 3. Adding a Family

1. Click on the **"Families"** tab
2. Select a **section** from the dropdown
3. Click **"Add Family"** button
4. Fill in the family details:
   - **House No** (required): e.g., "V12", "A-101"
   - **Floor No** (optional): e.g., "1", "Ground"
   - **No. of Couples**: e.g., 1, 2, 3
   - **Type of Habitation**: PERMANENT or TEMPORARY
5. Click **"Create"**

---

### 4. Adding Family Members

1. Click on the **"Members"** tab
2. Select a **family** from the dropdown
3. Click **"Add Member"** button
4. Fill in the member details:

#### Required Fields:
- **Name**: Full name of the person
- **Relationship with HOF**: Select from dropdown (SELF for head of family)
- **Sex**: MALE, FEMALE, or OTHER

#### Optional Fields:
- **Date of Birth**: Select from calendar
- **Phone Number**: 10-digit mobile number
- **Voter ID**: Voter ID card number
- **Occupation**: Job/profession
- **ABHA ID**: 14-digit ABHA number
- **ABHA Address**: ABHA address (e.g., name@abdm)

5. Click **"Create"**

---

## Relationship Types

When adding family members, select the appropriate relationship:

### Primary Relationships:
- **SELF** - Head of Family (HOF)
- **HUSBAND** - Husband of HOF
- **WIFE** - Wife of HOF
- **SON** - Son of HOF
- **DAUGHTER** - Daughter of HOF

### Extended Family:
- **FATHER** - Father of HOF
- **MOTHER** - Mother of HOF
- **BROTHER** - Brother of HOF
- **SISTER** - Sister of HOF
- **GRANDFATHER** - Grandfather of HOF
- **GRANDMOTHER** - Grandmother of HOF

### In-Laws:
- **FATHER_IN_LAW**
- **MOTHER_IN_LAW**
- **SON_IN_LAW**
- **DAUGHTER_IN_LAW**
- **BROTHER_IN_LAW**
- **SISTER_IN_LAW**

### Other Relationships:
- **GRANDSON**, **GRANDDAUGHTER**
- **UNCLE**, **AUNT**
- **NEPHEW**, **NIECE**
- **COUSIN**
- **OTHER** - For any other relationship

---

## Editing Records

### To Edit Any Record:
1. Find the record in the table
2. Click the **Edit** icon (pencil)
3. Update the information
4. Click **"Update"**

---

## Deleting Records

### Important: Soft Delete System
When you delete a record, it's not permanently removed. You must provide a reason:

### Deletion Reasons:
- **DEATH** - Person has passed away
- **MIGRATION** - Family/person moved to another place
- **DUPLICATE** - Duplicate entry
- **OTHER** - Any other reason

### To Delete a Record:
1. Find the record in the table
2. Click the **Delete** icon (trash)
3. Select a **reason** from dropdown
4. Add **remarks** (optional but recommended)
5. Click **"Delete"**

**Example Remarks:**
- "Migrated to Aizawl on 2025-09-15"
- "Passed away on 2025-08-20"
- "Duplicate entry - already exists in Section B"

---

## Searching Records

### Search Features:
- **Villages**: Search by village name
- **Sections**: Search by section name
- **Families**: Search by house number
- **Members**: Search by name, voter ID, or ABHA ID

### How to Search:
1. Type in the search box at the top
2. Results filter automatically as you type
3. Clear the search box to see all records

---

## Navigation Tips

### Moving Through Levels:
1. **Forward Navigation**: Click the arrow (→) icon to drill down
2. **Back Navigation**: Click "Back to..." button at the top
3. **Tab Navigation**: Click tabs to jump between levels

### Quick Navigation:
- Use the **dropdown selectors** to quickly jump to a specific village/section/family
- The system remembers your last selection

---

## Best Practices

### 1. Start with Villages
Always create villages first, then sections, then families, then members.

### 2. Use Clear Names
- Villages: Use official village names
- Sections: Use descriptive names (e.g., "North Block", "Section A")
- House Numbers: Use consistent format (e.g., "V12", "A-101")

### 3. Complete Information
Try to fill in as many fields as possible, especially:
- Phone numbers (for contact)
- Voter IDs (for identification)
- ABHA IDs (for health records)
- Date of Birth (for age-based programs)

### 4. Regular Updates
- Update records when people move
- Mark deceased persons with proper reason
- Remove duplicate entries

### 5. Verify Before Deleting
Always double-check before deleting records. While data is not permanently deleted, it's marked as inactive.

---

## Common Scenarios

### Scenario 1: Adding a New Family
```
1. Go to Villages → Add "Durtlang Village"
2. Go to Sections → Select village → Add "Section A"
3. Go to Families → Select section → Add family with House No "V12"
4. Go to Members → Select family → Add all family members
```

### Scenario 2: Person Moved Away
```
1. Go to Members tab
2. Find the person
3. Click Delete icon
4. Select reason: "MIGRATION"
5. Add remarks: "Moved to Aizawl on 2025-09-15"
6. Confirm deletion
```

### Scenario 3: Updating Phone Number
```
1. Go to Members tab
2. Find the person
3. Click Edit icon
4. Update phone number
5. Click "Update"
```

### Scenario 4: Adding ABHA ID Later
```
1. Go to Members tab
2. Find the person
3. Click Edit icon
4. Enter ABHA ID and ABHA Address
5. Click "Update"
```

---

## Statistics Dashboard

At the top of the page, you'll see 4 cards showing:

1. **Total Villages** - Number of villages under your facility
2. **Total Sections** - Number of sections across all villages
3. **Total Families** - Number of registered families
4. **Total Members** - Number of registered individuals

These update automatically as you add/remove records.

---

## Troubleshooting

### Problem: Can't add a section
**Solution**: Make sure you've selected a village first

### Problem: Can't add a family
**Solution**: Make sure you've selected a section first

### Problem: Can't add a member
**Solution**: Make sure you've selected a family first

### Problem: Duplicate error
**Solution**: Check if the record already exists. Each house number must be unique within a section.

### Problem: Data not loading
**Solution**: Refresh the page or check your internet connection

---

## Data Privacy & Security

- ✅ Only your facility's data is visible to you
- ✅ All data is encrypted and secure
- ✅ Deleted records are soft-deleted (not permanently removed)
- ✅ All actions are logged for audit purposes

---

## Support

If you encounter any issues or need help:

1. Contact your system administrator
2. Refer to this user guide
3. Check the FAQ section (if available)

---

## Keyboard Shortcuts (Optional)

- **Tab**: Move between form fields
- **Enter**: Submit forms
- **Esc**: Close dialogs
- **Ctrl+F**: Focus search box (browser default)

---

## Mobile Usage

The system is fully responsive and works on mobile devices:

- ✅ All features available on mobile
- ✅ Touch-friendly buttons and inputs
- ✅ Optimized for small screens
- ✅ Works on all modern mobile browsers

---

## Summary Checklist

Before you start, make sure you understand:

- [ ] The 4-level hierarchy (Village → Section → Family → Member)
- [ ] How to add records at each level
- [ ] How to edit existing records
- [ ] How to delete records with proper reasons
- [ ] How to search for records
- [ ] How to navigate between levels

---

**Happy Data Entry!** 🎉

If you have any questions, don't hesitate to ask your supervisor or system administrator.
