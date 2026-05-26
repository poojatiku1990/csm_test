# Customer Case Table - Complete Documentation

## Table Overview
- **Table Name:** x_20261805_customer_case
- **Display Label:** Customer Case
- **Extends:** task
- **Scope:** x_20261805_csm
- **Package:** csm_test
- **Purpose:** Central data model for the Customer Service Management (CSM) application

## Table Structure

### Primary Fields

#### 1. **number** - Case Number
- **Type:** String (auto-increment)
- **Length:** 40 characters
- **Unique:** Yes
- **Mandatory:** Yes
- **Read-Only:** Yes (after creation)
- **Default:** Auto-generated
- **Description:** Unique auto-incrementing case identifier (e.g., CSE001, CSE002)
- **Usage:** Primary identifier for customer cases, displayed in case lists and references

#### 2. **short_description** - Short Description
- **Type:** String
- **Length:** 255 characters
- **Mandatory:** Yes
- **Read-Only:** No
- **Default:** None
- **Description:** Brief summary/headline of the customer case
- **Usage:** Quick overview visible in lists, forms, and reports
- **Example:** "Customer unable to login to portal"

#### 3. **description** - Full Description
- **Type:** Text (large)
- **Length:** 8000 characters
- **Mandatory:** No
- **Read-Only:** No
- **Default:** None
- **Description:** Detailed information about the customer case
- **Usage:** Complete details, troubleshooting steps, customer background
- **Example:** Multi-paragraph detailed case information

#### 4. **priority** - Priority Level
- **Type:** Choice
- **Mandatory:** Yes
- **Read-Only:** No
- **Default:** High (value: 2)
- **Description:** Priority/urgency level for case resolution
- **Choices:**
  - 1 = Critical (highest priority)
  - 2 = High (default)
  - 3 = Medium
  - 4 = Low (lowest priority)
- **Usage:** Determines routing, SLA times, and case priority in queues

#### 5. **state** - Case State
- **Type:** Choice
- **Mandatory:** Yes
- **Read-Only:** No
- **Default:** New
- **Description:** Current lifecycle state of the case
- **Choices:**
  - new = New (initial state)
  - in_progress = In Progress (case being worked on)
  - resolved = Resolved (solution provided)
  - closed = Closed (case complete, no further action)
- **Usage:** Tracks case progression through workflow

#### 6. **assigned_to** - Assigned To
- **Type:** Reference
- **References:** sys_user
- **Mandatory:** No
- **Read-Only:** No
- **Default:** None
- **Description:** ServiceNow user assigned to handle the case
- **Usage:** Tracks case ownership and responsibility
- **Note:** Can be null for unassigned cases

#### 7. **resolution_notes** - Resolution Notes
- **Type:** Text (large)
- **Length:** 4000 characters
- **Mandatory:** No
- **Read-Only:** No
- **Default:** None
- **Description:** Documentation of case resolution or workaround applied
- **Usage:** Record how the case was resolved for future reference
- **Example:** "Updated password policy, user can now login"

## Inherited Fields (from task table)

The table extends the `task` table, so it inherits:
- `sys_id` - System ID (primary key)
- `sys_created_on` - Created date/time
- `sys_created_by` - Created by user
- `sys_updated_on` - Last updated date/time
- `sys_updated_by` - Last updated by user
- `sys_mod_count` - Modification count
- `active` - Active/inactive flag

## File Structure

```
src/servicenow/tables/customer_case/
├── table.xml                    # Table schema definition
├── CustomerCaseTable.ts         # TypeScript SDK definition
```

```
src/servicenow/dictionaries/
├── customer_case_dictionary.xml # Field dictionary entries
```

```
src/servicenow/forms/
├── customer_case_form.xml       # Form layout configuration
```

## Form Layout

### Tab 1: Case Information
- **number** - Case identifier (read-only)
- **short_description** - Case summary
- **state** - Case state
- **priority** - Priority level

### Tab 2: Assignment
- **assigned_to** - User assigned to case

### Tab 3: Details
- **description** - Full case description
- **resolution_notes** - How case was resolved

## SDK Usage

### TypeScript Definitions
```typescript
import { CustomerCaseTable, ICustomerCase } from './CustomerCaseTable';

interface ICustomerCase {
  sys_id?: string;
  number?: string;
  short_description: string;
  description?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  state: 'new' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  resolution_notes?: string;
}
```

### API Endpoints

#### Create a Case
```
POST /api/now/table/x_20261805_customer_case
Content-Type: application/json

{
  "short_description": "Customer login issue",
  "description": "User cannot access portal",
  "priority": "high",
  "state": "new",
  "assigned_to": "6816f79cc0a8016401c5a33be04be441"
}
```

#### Query Cases
```
GET /api/now/table/x_20261805_customer_case?sysparm_limit=10&sysparm_query=state=new
```

#### Update a Case
```
PATCH /api/now/table/x_20261805_customer_case/{sys_id}
Content-Type: application/json

{
  "state": "in_progress",
  "assigned_to": "user_id"
}
```

#### Get Specific Case
```
GET /api/now/table/x_20261805_customer_case/{sys_id}
```

## Query Examples

### Find All New Cases
```
GET /api/now/table/x_20261805_customer_case?sysparm_query=state=new
```

### Find Critical Priority Cases
```
GET /api/now/table/x_20261805_customer_case?sysparm_query=priority=1
```

### Find Cases Assigned to User
```
GET /api/now/table/x_20261805_customer_case?sysparm_query=assigned_to={user_id}
```

### Find Unresolved Cases
```
GET /api/now/table/x_20261805_customer_case?sysparm_query=state!=closed^state!=resolved
```

## Default Values

| Field | Default Value | Description |
|-------|---------------|-------------|
| priority | 2 (High) | Cases default to High priority |
| state | new | Cases start in New state |
| number | Auto-generated | Automatically created on insert |
| assigned_to | (empty) | Initially unassigned |
| description | (empty) | Optional field |
| resolution_notes | (empty) | Optional field |

## Field Validation

### number
- Must be unique across all cases
- Auto-incremented (cannot be manually set)
- Read-only after creation

### short_description
- Required field (cannot be empty)
- Maximum 255 characters
- Displayed in case lists

### priority
- Must be one of: critical, high, medium, low
- Defaults to high if not specified

### state
- Must be one of: new, in_progress, resolved, closed
- Defaults to new if not specified
- Controls case workflow

### assigned_to
- Must be valid sys_user reference if provided
- Optional field
- Can be set to null to unassign

## Record Lifecycle

```
1. NEW CASE CREATED
   ├─ state = "new" (default)
   ├─ priority = "high" (default)
   ├─ number = auto-generated
   └─ assigned_to = (empty)

2. CASE IN PROGRESS
   ├─ state → "in_progress"
   ├─ assigned_to → populated with user
   └─ description → updated with findings

3. CASE RESOLVED
   ├─ state → "resolved"
   ├─ resolution_notes → populated
   └─ time-tracked

4. CASE CLOSED
   ├─ state → "closed"
   └─ case complete
```

## Access Control

- **Scope:** x_20261805_csm (isolated scope)
- **Requires ACL:** Yes
- **Visibility:** Only to authorized users within CSM scope
- **Ownership:** Tracked via assigned_to field

## Integration Points

### With sys_user Table
- `assigned_to` field references sys_user
- Allows user-case relationships
- Enables user-based reporting

### With Task Table
- Inherits task functionality
- Inherits task auditing
- Can use task-based workflows

## Performance Considerations

- **Primary Sort:** number (default listing order)
- **Key Indexes:** 
  - state (frequently queried)
  - assigned_to (user filtering)
  - priority (urgent cases)
- **Full-text Search:** Supports search across description fields

## Deployment Notes

1. **Table Creation:** Automatically created when package installed
2. **ACL Required:** Access control lists must be configured for users
3. **Forms:** Default form automatically generated; custom form available
4. **Reports:** Can be reported on via standard ServiceNow reporting
5. **Notifications:** Can trigger notifications on state changes

## Troubleshooting

### Issue: Cannot insert records
**Solution:** Verify user has INSERT permission on x_20261805_customer_case

### Issue: Fields appearing as empty
**Solution:** Check that dictionary entries are properly deployed

### Issue: Choices not displaying
**Solution:** Verify dictionary entries include choice definitions

### Issue: Reference field not working
**Solution:** Verify sys_user table is accessible and reference is valid

---

**Last Updated:** 2026-05-26
**Version:** 0.0.1
**Scope:** x_20261805_csm
