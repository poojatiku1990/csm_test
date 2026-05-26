# Customer Case Fields - Quick Implementation Checklist

**Scope**: x_20261805_csm  
**Table**: Customer Case (x_20261805_csm_customer_case)  
**Total Fields**: 34  
**Mandatory Fields**: 8  
**Date**: May 25, 2026

---

## Quick Reference - Field Types & Defaults

| Field | Type | Required | Default | Max Length | Notes |
|-------|------|----------|---------|-----------|-------|
| **IDENTITY** |||||
| number | String (auto) | ✅ | CSE-nnnnnnn | 40 | Read-only |
| short_description | String | ✅ | None | 160 | Min 5 chars |
| description | Text | ❌ | None | ∞ | HTML editor |
| **CUSTOMER** |||||
| customer_account | Reference | ✅ | None | — | Links to account |
| customer_contact | Reference | ✅ | None | — | Filtered by account |
| customer_email | Email | ✅ | None | 100 | Format validation |
| customer_phone | Phone | ❌ | None | 20 | Optional |
| **CLASSIFICATION** |||||
| priority | Choice | ✅ | 3 | — | 1-5 scale |
| category | Reference | ✅ | None | — | Links to category |
| subcategory | String | ❌ | None | 100 | Filtered by category |
| **LIFECYCLE** |||||
| state | Choice | ✅ | new | — | 7 states |
| opened_at | DateTime | ❌ | now() | — | Auto on open |
| updated_on | DateTime | ❌ | now() | — | Auto on change |
| resolved_at | DateTime | ❌ | None | — | Manual or auto |
| closed_at | DateTime | ❌ | None | — | Manual or auto |
| created_on | DateTime | ❌ | now() | — | System, immutable |
| **ASSIGNMENT** |||||
| assignment_group | Reference | ❌ | None | — | Links to group |
| assigned_to | Reference | ❌ | None | — | Links to user |
| assigned_to_date | DateTime | ❌ | Auto | — | Read-only |
| **SLA** |||||
| sla_policy | Reference | ❌ | Auto | — | Auto from category |
| sla_due_date | DateTime | ❌ | Auto | — | Read-only |
| response_sla | Reference | ❌ | None | — | Read-only |
| resolution_sla | Reference | ❌ | None | — | Read-only |
| sla_status | Choice | ❌ | active | — | Read-only |
| **RESOLUTION** |||||
| resolution_code | Choice | ❌ | None | — | Required if closed |
| resolution_notes | Text | ❌ | None | ∞ | Required if closed |
| closure_code | Choice | ❌ | None | — | Required if closed |
| reopened_count | Integer | ❌ | 0 | — | Read-only auto-inc |
| **COMMUNICATION** |||||
| work_notes | Text | ❌ | None | ∞ | Internal only |
| comments | Text | ❌ | None | ∞ | Customer visible |
| **ESCALATION** |||||
| is_escalated | Boolean | ❌ | false | — | Flag |
| escalation_reason | Text | ❌ | None | ∞ | Required if escalated |
| **SATISFACTION** |||||
| customer_satisfaction | Choice | ❌ | None | — | Required if closed |
| feedback_provided | Boolean | ❌ | false | — | Read-only auto-set |

---

## Implementation Checklist

### STEP 1: Create Base Fields
- [ ] **number** - String, auto-numbered (CSE-nnnnnnn)
- [ ] **short_description** - String, 160 max, required
- [ ] **description** - Text, HTML editor enabled

### STEP 2: Create Customer References
- [ ] **customer_account** - Reference to x_20261805_csm_customer_account, required
- [ ] **customer_contact** - Reference to x_20261805_csm_customer_contact, required
  - Filter: customer_account = {customer_account}
- [ ] **customer_email** - Email field, required
- [ ] **customer_phone** - Phone field, optional

### STEP 3: Create Classification Fields
- [ ] **priority** - Choice (1-Critical, 2-High, 3-Medium, 4-Low, 5-Minimal), default: 3
- [ ] **category** - Reference to x_20261805_csm_case_category, required
- [ ] **subcategory** - String, optional
  - Filter: depends on category

### STEP 4: Create Lifecycle Fields
- [ ] **state** - Choice with 7 values, default: new
  - Values: new, open, in_progress, waiting_on_customer, resolved, closed, cancelled
- [ ] **opened_at** - DateTime, read-only, auto-set
- [ ] **updated_on** - DateTime, read-only, auto-update
- [ ] **resolved_at** - DateTime, optional
- [ ] **closed_at** - DateTime, optional
- [ ] **created_on** - DateTime, read-only, system

### STEP 5: Create Assignment Fields
- [ ] **assignment_group** - Reference to sys_user_group, optional
- [ ] **assigned_to** - Reference to sys_user, optional
  - Filter: groups = {assignment_group}
- [ ] **assigned_to_date** - DateTime, read-only, auto-populate

### STEP 6: Create SLA Fields
- [ ] **sla_policy** - Reference to sla, optional
  - Auto-populate from category
- [ ] **sla_due_date** - DateTime, read-only, auto-calculate
- [ ] **response_sla** - Reference to sla_instance, read-only
- [ ] **resolution_sla** - Reference to sla_instance, read-only
- [ ] **sla_status** - Choice (active, success, breach, paused), read-only, default: active

### STEP 7: Create Resolution Fields
- [ ] **resolution_code** - Choice (6 values), optional
  - Values: resolved, unable_to_resolve, duplicate, no_action_needed, customer_request, workaround
- [ ] **resolution_notes** - Text, HTML editor, optional
  - Required when: state = resolved OR closed
- [ ] **closure_code** - Choice (6 values), optional
  - Values: issue_resolved, workaround_applied, customer_not_responding, customer_cancelled, duplicate_case, no_longer_needed
  - Required when: state = closed
- [ ] **reopened_count** - Integer, read-only, default: 0

### STEP 8: Create Communication Fields
- [ ] **work_notes** - Text, HTML editor, internal only
- [ ] **comments** - Text, HTML editor, customer visible

### STEP 9: Create Escalation Fields
- [ ] **is_escalated** - Boolean, default: false
- [ ] **escalation_reason** - Text, optional
  - Required when: is_escalated = true

### STEP 10: Create Satisfaction Fields
- [ ] **customer_satisfaction** - Choice (1-5 scale), optional
  - Values: 1=Very Dissatisfied, 2=Dissatisfied, 3=Neutral, 4=Satisfied, 5=Very Satisfied
  - Required when: state = closed
- [ ] **feedback_provided** - Boolean, read-only, default: false

---

## Mandatory Fields (Required at Creation)

These 8 fields MUST have values when creating a case:
1. ✅ **short_description** (user provides)
2. ✅ **customer_account** (user selects)
3. ✅ **customer_contact** (user selects)
4. ✅ **customer_email** (user provides or auto-fill from contact)
5. ✅ **priority** (default: 3 - Medium)
6. ✅ **category** (user selects)
7. ✅ **state** (default: new)
8. ✅ **number** (auto-generated, read-only)

---

## Auto-Generated/Calculated Fields (System Manages)

- **number** - Auto-increment with prefix CSE
- **created_on** - Current date/time
- **opened_at** - When state → open
- **updated_on** - Always current on any change
- **assigned_to_date** - When assigned_to is set
- **sla_due_date** - Calculated from opened_at + SLA duration
- **reopened_count** - Increments when state: closed → open
- **feedback_provided** - Set when customer_satisfaction is filled

---

## Field Dependencies

```
customer_account (select) 
    ↓ filters
customer_contact (shows only contacts from selected account)

category (select)
    ↓ filters
subcategory (shows subcategories of selected category)
    ↓ auto-populates
sla_policy (uses category's default SLA)

priority (select)
    ↓ triggers
SLA Calculation

assignment_group (select)
    ↓ filters
assigned_to (shows only users in selected group)
```

---

## Choice Field Options

### Priority (5 options)
```
1 - Critical (highest severity)
2 - High
3 - Medium (default)
4 - Low
5 - Minimal (lowest severity)
```

### State (7 options)
```
new          (initial state)
open         (acknowledged)
in_progress  (being worked on)
waiting_on_customer (awaiting customer response)
resolved     (fixed, awaiting closure)
closed       (final state)
cancelled    (abandoned)
```

### Resolution Code (6 options)
```
resolved           (issue solved)
unable_to_resolve  (couldn't fix)
duplicate          (duplicate of another case)
no_action_needed   (no action required)
customer_request   (per customer request)
workaround         (workaround provided)
```

### Closure Code (6 options)
```
issue_resolved            (problem fixed)
workaround_applied        (workaround in place)
customer_not_responding   (timeout)
customer_cancelled        (customer cancelled)
duplicate_case            (merged with another)
no_longer_needed          (no longer needed)
```

### SLA Status (4 options)
```
active   (SLA running)
success  (SLA met)
breach   (SLA violated)
paused   (SLA paused)
```

### Satisfaction (5 options)
```
1 - Very Dissatisfied
2 - Dissatisfied
3 - Neutral
4 - Satisfied
5 - Very Satisfied
```

---

## Validation Rules

| Field | Validation | Error Message |
|-------|-----------|---|
| short_description | Min 5 chars, Max 160 | "Brief description must be 5-160 characters" |
| customer_email | Valid email format | "Please enter valid email address" |
| priority | Value in 1-5 | "Priority must be 1-5" |
| category | Not null | "Category is required" |
| state | Valid state value | "Invalid state selected" |
| resolution_notes | Min 10 chars if set | "Resolution notes required when resolving" |
| closure_code | Not null if closed | "Closure code required when closing" |
| customer_satisfaction | Value in 1-5 if closed | "Rating required to close case" |

---

## Visibility & Access Rules

### Internal Only (Work Notes)
- Visible to: csm_admin, csm_manager, csm_agent
- Hidden from: csm_viewer, customer

### Customer Visible (Comments)
- Visible to: All users + customer
- Readable by: Everyone
- Writable by: csm_admin, csm_manager, csm_agent

### Read-Only (System Fields)
- Cannot be edited by users: number, created_on, opened_at, updated_on, assigned_to_date, sla_due_date, response_sla, resolution_sla, sla_status, reopened_count, feedback_provided

---

## Default Values Summary

```javascript
{
  number: "Auto-generated",
  short_description: null,
  description: null,
  customer_account: null,
  customer_contact: null,
  customer_email: null,
  customer_phone: null,
  priority: "3",  // Medium
  category: null,
  subcategory: null,
  state: "new",
  opened_at: null,  // Auto when opened
  updated_on: "now()",
  resolved_at: null,
  closed_at: null,
  created_on: "now()",
  assignment_group: null,
  assigned_to: null,
  assigned_to_date: null,  // Auto when assigned
  sla_policy: null,  // Auto from category
  sla_due_date: null,  // Auto calculated
  response_sla: null,
  resolution_sla: null,
  sla_status: "active",
  resolution_code: null,
  resolution_notes: null,
  closure_code: null,
  reopened_count: 0,
  work_notes: null,
  comments: null,
  is_escalated: false,
  escalation_reason: null,
  customer_satisfaction: null,
  feedback_provided: false
}
```

---

## Reference to Other Tables

| Field | References | Display | Type |
|-------|----------|---------|------|
| customer_account | x_20261805_csm_customer_account | name | Many-to-One |
| customer_contact | x_20261805_csm_customer_contact | name | Many-to-One |
| category | x_20261805_csm_case_category | name | Many-to-One |
| assignment_group | sys_user_group | name | Many-to-One |
| assigned_to | sys_user | name | Many-to-One |
| sla_policy | sla | name | Many-to-One |
| response_sla | sla_instance | name | Many-to-One |
| resolution_sla | sla_instance | name | Many-to-One |

---

## Field Groups (For Form Organization)

### Basic Information (3 fields)
- number
- short_description
- description

### Customer (4 fields)
- customer_account
- customer_contact
- customer_email
- customer_phone

### Classification (3 fields)
- priority
- category
- subcategory

### Lifecycle (6 fields)
- state
- opened_at
- updated_on
- resolved_at
- closed_at
- created_on

### Assignment (3 fields)
- assignment_group
- assigned_to
- assigned_to_date

### SLA (5 fields)
- sla_policy
- sla_due_date
- response_sla
- resolution_sla
- sla_status

### Resolution (4 fields)
- resolution_code
- resolution_notes
- closure_code
- reopened_count

### Communication (2 fields)
- work_notes
- comments

### Escalation (2 fields)
- is_escalated
- escalation_reason

### Satisfaction (2 fields)
- customer_satisfaction
- feedback_provided

---

## API Integration

### Required Fields for API POST (Create Case)
```json
{
  "short_description": "string (required, 5-160 chars)",
  "customer_account": "sys_id (required)",
  "customer_contact": "sys_id (required)",
  "customer_email": "email (required)",
  "priority": "string (required, default: 3)",
  "category": "sys_id (required)",
  "state": "string (defaults to: new)"
}
```

### Response Fields (GET Case)
```json
{
  "sys_id": "unique identifier",
  "number": "CSE-xxxxxxx",
  "short_description": "...",
  "description": "...",
  "priority": "...",
  "state": "...",
  "customer_account": {...},
  "customer_contact": {...},
  "assigned_to": {...},
  "sla_status": "...",
  "opened_at": "ISO datetime",
  "updated_on": "ISO datetime",
  "resolved_at": "ISO datetime",
  "closed_at": "ISO datetime",
  ...
}
```

---

## Sorting & Filtering

### Sortable Fields (15 total)
- number
- short_description
- customer_account
- customer_contact
- customer_email
- customer_phone
- priority
- category
- subcategory
- state
- assignment_group
- assigned_to
- sla_policy
- opened_at
- updated_on
- resolved_at
- closed_at
- created_on
- reopened_count
- sla_status
- is_escalated
- customer_satisfaction

### Filterable Fields (20 total)
All sortable fields plus:
- resolution_code
- closure_code
- feedback_provided

---

## Status: READY FOR IMPLEMENTATION

✅ All 34 fields specified  
✅ Field types defined  
✅ Default values set  
✅ Validation rules included  
✅ Dependencies mapped  
✅ Form layout organized  
✅ Documentation complete  

---

**Reference Files:**
- Full Specs: [CUSTOMER_CASE_FIELD_SPECIFICATIONS.md](CUSTOMER_CASE_FIELD_SPECIFICATIONS.md)
- TypeScript Config: [src/servicenow/tables/customer_case_fields.ts](src/servicenow/tables/customer_case_fields.ts)
- Table Overview: [TABLE_DEFINITIONS_GUIDE.md](TABLE_DEFINITIONS_GUIDE.md)

---

**Version**: 1.0.0  
**Created**: May 25, 2026
