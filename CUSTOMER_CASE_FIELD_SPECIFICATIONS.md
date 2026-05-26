# Customer Case Table - Field Specifications

**Scope**: x_20261805_csm  
**Table**: Customer Case (x_20261805_csm_customer_case)  
**Extends**: task  
**Status**: Ready for Implementation

---

## Field Summary

| # | Field Name | Label | Type | Required | Default | Notes |
|----|-----------|-------|------|----------|---------|-------|
| 1 | number | Case Number | string (auto) | Yes | CSE-1000000+ | Auto-numbered, read-only |
| 2 | short_description | Short Description | string | Yes | None | Max 160 chars, searchable |
| 3 | description | Description | text | No | None | HTML editor, long form |
| 4 | customer_account | Customer Account | reference | Yes | None | Link to account |
| 5 | customer_contact | Customer Contact | reference | Yes | None | Link to contact (filtered by account) |
| 6 | customer_email | Customer Email | email | Yes | None | Email validation |
| 7 | customer_phone | Customer Phone | phone | No | None | Phone number format |
| 8 | priority | Priority | choice | Yes | 3 - Medium | 1-5 scale |
| 9 | category | Category | reference | Yes | None | Link to case category |
| 10 | subcategory | Subcategory | string | No | None | Filtered by category |
| 11 | state | State | choice | Yes | new | 7 states with transitions |
| 12 | assignment_group | Assignment Group | reference | No | None | Support team |
| 13 | assigned_to | Assigned To | reference | No | None | Individual agent |
| 14 | assigned_to_date | Assigned To Date | date_time | No | Auto | Read-only, set on assignment |
| 15 | sla_policy | SLA Policy | reference | No | Auto | Auto-set from category |
| 16 | sla_due_date | SLA Due Date | date_time | No | Auto | Read-only, calculated |
| 17 | response_sla | Response SLA | reference | No | None | Read-only SLA tracking |
| 18 | resolution_sla | Resolution SLA | reference | No | None | Read-only SLA tracking |
| 19 | sla_status | SLA Status | choice | No | active | active/success/breach/paused |
| 20 | opened_at | Opened On | date_time | No | now() | Auto-set when opened |
| 21 | updated_on | Updated On | date_time | No | now() | Auto-update on changes |
| 22 | resolved_at | Resolved On | date_time | No | None | Set when resolved |
| 23 | closed_at | Closed On | date_time | No | None | Set when closed |
| 24 | created_on | Created On | date_time | No | now() | Auto-set at creation |
| 25 | resolution_code | Resolution Code | choice | No | None | Required if closed |
| 26 | resolution_notes | Resolution Notes | text | No | None | Required if closed |
| 27 | closure_code | Closure Code | choice | No | None | Required if closed |
| 28 | reopened_count | Reopened Count | integer | No | 0 | Read-only auto-increment |
| 29 | work_notes | Work Notes | text | No | None | Internal only |
| 30 | comments | Comments | text | No | None | Customer visible |
| 31 | is_escalated | Escalated | boolean | No | false | Escalation flag |
| 32 | escalation_reason | Escalation Reason | text | No | None | Required if escalated |
| 33 | customer_satisfaction | Satisfaction | choice | No | None | 1-5 rating, required if closed |
| 34 | feedback_provided | Feedback Provided | boolean | No | false | Auto-set when rating given |

---

## Detailed Field Specifications

### GROUP 1: IDENTITY & BASIC INFORMATION

#### 1. **Case Number** (number)
```
Field Name:    number
Type:          String (auto-generated)
Label:         Case Number
Mandatory:     YES
Read-Only:     YES
Max Length:    40 characters
Auto-Number:   Enabled
  ├─ Prefix:   CSE
  ├─ Digits:   7
  ├─ Start:    1000000
  └─ Example:  CSE-1000042

Display Field: YES (shown in lists)
Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: Auto-generated
```

#### 2. **Short Description** (short_description)
```
Field Name:    short_description
Type:          String
Label:         Short Description
Mandatory:     YES
Read-Only:     NO
Max Length:    160 characters
Placeholder:   "Enter a brief summary of the issue"
HTML Editor:   NO

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None
Validation:    Min 5 chars, no pattern

Example: "Unable to reset password"
```

#### 3. **Description** (description)
```
Field Name:    description
Type:          Text (large text area)
Label:         Description
Mandatory:     NO
Read-Only:     NO
Max Length:    Unlimited
HTML Editor:   YES
Placeholder:   "Provide detailed information about the issue"

Sortable:      NO
Filterable:    NO
Searchable:    YES
Default Value: None

Example: "Customer unable to access password reset link sent via email"
```

---

### GROUP 2: CUSTOMER INFORMATION

#### 4. **Customer Account** (customer_account)
```
Field Name:    customer_account
Type:          Reference
References:    x_20261805_csm_customer_account
Label:         Customer Account
Display Field: name
Mandatory:     YES
Read-Only:     NO

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None
Cascade Delete: NO
Reverse Link:  Enabled (label: "Cases")

Dependencies:  None (primary)
```

#### 5. **Customer Contact** (customer_contact)
```
Field Name:    customer_contact
Type:          Reference
References:    x_20261805_csm_customer_contact
Label:         Customer Contact
Display Field: name
Mandatory:     YES
Read-Only:     NO

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None
Cascade Delete: NO
Reverse Link:  Enabled (label: "Cases")

Dependencies:  DEPENDS ON customer_account
Filter Query:  customer_account = {customer_account}
Note:          Only show contacts from selected account
```

#### 6. **Customer Email** (customer_email)
```
Field Name:    customer_email
Type:          Email
Label:         Customer Email
Mandatory:     YES
Read-Only:     NO
Max Length:    100 characters
Placeholder:   "customer@example.com"
Format:        Valid email required

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None
Validation:    Valid email format

Example: "john.smith@acme.com"
```

#### 7. **Customer Phone** (customer_phone)
```
Field Name:    customer_phone
Type:          Phone Number
Label:         Customer Phone
Mandatory:     NO
Read-Only:     NO
Max Length:    20 characters
Placeholder:   "(555) 123-4567"
Format:        Phone format

Sortable:      YES
Filterable:    NO
Searchable:    YES
Default Value: None

Example: "555-0123"
```

---

### GROUP 3: CASE CLASSIFICATION

#### 8. **Priority** (priority)
```
Field Name:    priority
Type:          Choice (dropdown)
Label:         Priority
Mandatory:     YES
Read-Only:     NO
Default Value: 3 - Medium

Choices:
  ├─ 1 - Critical   (highest)
  ├─ 2 - High
  ├─ 3 - Medium     [DEFAULT]
  ├─ 4 - Low
  └─ 5 - Minimal    (lowest)

Sortable:      YES
Filterable:    YES
Searchable:    YES
Affects SLA:   YES (determines response/resolution times)
Ordering:      YES (affects queue)
```

#### 9. **Category** (category)
```
Field Name:    category
Type:          Reference
References:    x_20261805_csm_case_category
Label:         Category
Display Field: name
Mandatory:     YES
Read-Only:     NO

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None
Cascade Delete: NO
Reverse Link:  Enabled (label: "Cases")

Examples:
  ├─ Technical Support
  ├─ Billing Support
  ├─ Account Management
  └─ General Inquiry
```

#### 10. **Subcategory** (subcategory)
```
Field Name:    subcategory
Type:          String
Label:         Subcategory
Mandatory:     NO
Read-Only:     NO
Max Length:    100 characters
Placeholder:   "Select or enter subcategory"

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None
Dependencies:  DEPENDS ON category

Note: Filtered by parent category
Example: "Password Reset", "Access Issues"
```

---

### GROUP 4: CASE STATE & LIFECYCLE

#### 11. **State** (state)
```
Field Name:    state
Type:          Choice (dropdown)
Label:         State
Mandatory:     YES
Read-Only:     NO
Default Value: new

States & Colors:
  ├─ new             (blue)     → Can go to: open, cancelled
  ├─ open            (orange)   → Can go to: in_progress, waiting_on_customer, cancelled
  ├─ in_progress     (gold)     → Can go to: waiting_on_customer, resolved, cancelled
  ├─ waiting_on_customer (gray) → Can go to: in_progress, cancelled
  ├─ resolved        (green)    → Can go to: closed, open (reopen)
  ├─ closed          (dark green)
  └─ cancelled       (light gray)

Sortable:      YES
Filterable:    YES
Transitions:   Enforced workflow

Lifecycle Flow:
new → open → in_progress → waiting_on_customer → resolved → closed → (can reopen)
```

---

### GROUP 5: ASSIGNMENT & ROUTING

#### 12. **Assignment Group** (assignment_group)
```
Field Name:    assignment_group
Type:          Reference
References:    sys_user_group
Label:         Assignment Group
Display Field: name
Mandatory:     NO
Read-Only:     NO

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None
Cascade Delete: NO

Example: "Technical Support Team", "Billing Team"
```

#### 13. **Assigned To** (assigned_to)
```
Field Name:    assigned_to
Type:          Reference
References:    sys_user
Label:         Assigned To
Display Field: name
Mandatory:     NO
Read-Only:     NO

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None
Cascade Delete: NO
Dependencies:  DEPENDS ON assignment_group
Filter Query:  groups = {assignment_group}

Note: Shows only users in selected assignment group
```

#### 14. **Assigned To Date** (assigned_to_date)
```
Field Name:    assigned_to_date
Type:          Date/Time
Label:         Assigned To Date
Mandatory:     NO
Read-Only:     YES (auto-populated)

Sortable:      YES
Filterable:    YES
Default Value: None
Auto-Populate: When assigned_to field is set

Set By:        System trigger
Cleared By:    When assigned_to is cleared
```

---

### GROUP 6: SLA MANAGEMENT

#### 15. **SLA Policy** (sla_policy)
```
Field Name:    sla_policy
Type:          Reference
References:    sla
Label:         SLA Policy
Display Field: name
Mandatory:     NO
Read-Only:     NO

Sortable:      YES
Filterable:    YES
Searchable:    YES
Default Value: None (auto-set from category)
Cascade Delete: NO

Auto-Population:
  ├─ Depends On:  category
  └─ Logic:       Category's default SLA is applied
```

#### 16. **SLA Due Date** (sla_due_date)
```
Field Name:    sla_due_date
Type:          Date/Time
Label:         SLA Due Date
Mandatory:     NO
Read-Only:     YES (calculated)

Sortable:      YES
Filterable:    YES
Default Value: None
Auto-Calculated: YES
Formula:       opened_at + sla_policy.response_time

Example: 2026-05-26 14:30:00
```

#### 17. **Response SLA** (response_sla)
```
Field Name:    response_sla
Type:          Reference
References:    sla_instance
Label:         Response SLA
Display Field: name
Mandatory:     NO
Read-Only:     YES

Sortable:      NO
Filterable:    NO
Default Value: None

Purpose: Tracks response time SLA instance
System Use: Managed by SLA engine
```

#### 18. **Resolution SLA** (resolution_sla)
```
Field Name:    resolution_sla
Type:          Reference
References:    sla_instance
Label:         Resolution SLA
Display Field: name
Mandatory:     NO
Read-Only:     YES

Sortable:      NO
Filterable:    NO
Default Value: None

Purpose: Tracks resolution time SLA instance
System Use: Managed by SLA engine
```

#### 19. **SLA Status** (sla_status)
```
Field Name:    sla_status
Type:          Choice
Label:         SLA Status
Mandatory:     NO
Read-Only:     YES

Choices:
  ├─ active      (SLA in progress)
  ├─ success     (SLA met)
  ├─ breach      (SLA violated)
  └─ paused      (SLA paused)

Default Value: active
Sortable:      YES
Filterable:    YES
```

---

### GROUP 7: TIMESTAMPS & LIFECYCLE DATES

#### 20. **Opened On** (opened_at)
```
Field Name:    opened_at
Type:          Date/Time
Label:         Opened On
Mandatory:     NO
Read-Only:     YES (auto-set)

Sortable:      YES
Filterable:    YES
Default Value: now() when state → open
Auto-Populate: Triggered on state_changed_to_open

Example: 2026-05-25 10:00:00
```

#### 21. **Updated On** (updated_on)
```
Field Name:    updated_on
Type:          Date/Time
Label:         Updated On
Mandatory:     NO
Read-Only:     YES (auto-set)

Sortable:      YES
Filterable:    YES
Default Value: now() when field updated
Auto-Populate: Triggered on any_field_updated

Updates on: Any field change
Example: 2026-05-25 14:30:00
```

#### 22. **Resolved On** (resolved_at)
```
Field Name:    resolved_at
Type:          Date/Time
Label:         Resolved On
Mandatory:     NO
Read-Only:     NO (manual or auto)

Sortable:      YES
Filterable:    YES
Default Value: None
Auto-Populate: Triggered on state_changed_to_resolved

Set When: state = resolved
Cleared When: state reverted
```

#### 23. **Closed On** (closed_at)
```
Field Name:    closed_at
Type:          Date/Time
Label:         Closed On
Mandatory:     NO
Read-Only:     NO (manual or auto)

Sortable:      YES
Filterable:    YES
Default Value: None
Auto-Populate: Triggered on state_changed_to_closed

Set When: state = closed
Metrics: Used to calculate resolution time
```

#### 24. **Created On** (created_on)
```
Field Name:    created_on
Type:          Date/Time
Label:         Created On
Mandatory:     NO
Read-Only:     YES (system)

Sortable:      YES
Filterable:    YES
Default Value: now() at record creation
Auto-Populate: System generated

Immutable: Cannot be changed after creation
Example: 2026-05-25 09:30:00
```

---

### GROUP 8: RESOLUTION & CLOSURE

#### 25. **Resolution Code** (resolution_code)
```
Field Name:    resolution_code
Type:          Choice
Label:         Resolution Code
Mandatory:     NO (Required if closed)
Read-Only:     NO

Choices:
  ├─ resolved            (Issue solved)
  ├─ unable_to_resolve   (Could not fix)
  ├─ duplicate           (Duplicate ticket)
  ├─ no_action_needed    (No further action)
  ├─ customer_request    (Per customer request)
  └─ workaround          (Workaround provided)

Default Value: None
Sortable:      YES
Filterable:    YES
Required When: state = closed or state = resolved
```

#### 26. **Resolution Notes** (resolution_notes)
```
Field Name:    resolution_notes
Type:          Text
Label:         Resolution Notes
Mandatory:     NO (Required if closed)
Read-Only:     NO
Max Length:    Unlimited
HTML Editor:   YES
Placeholder:   "Explain how the case was resolved"

Sortable:      NO
Filterable:    NO
Searchable:    YES
Default Value: None
Required When: resolution_code is set OR state = closed

Example: "Password reset link was resent and customer confirmed successful access"
```

#### 27. **Closure Code** (closure_code)
```
Field Name:    closure_code
Type:          Choice
Label:         Closure Code
Mandatory:     NO (Required if closed)
Read-Only:     NO

Choices:
  ├─ issue_resolved           (Problem solved)
  ├─ workaround_applied       (Workaround in place)
  ├─ customer_not_responding  (No response from customer)
  ├─ customer_cancelled       (Customer cancelled)
  ├─ duplicate_case           (Duplicate ticket)
  └─ no_longer_needed         (Not needed anymore)

Default Value: None
Sortable:      YES
Filterable:    YES
Required When: state = closed
```

#### 28. **Reopened Count** (reopened_count)
```
Field Name:    reopened_count
Type:          Integer
Label:         Reopened Count
Mandatory:     NO
Read-Only:     YES

Default Value: 0
Sortable:      YES
Filterable:    YES
Auto-Increment: Incremented when state changes from closed → open

Tracks: Number of times case has been reopened
```

---

### GROUP 9: INTERNAL NOTES & COMMUNICATION

#### 29. **Work Notes** (work_notes)
```
Field Name:    work_notes
Type:          Text (large text area)
Label:         Work Notes
Mandatory:     NO
Read-Only:     NO
Max Length:    Unlimited
HTML Editor:   YES
Placeholder:   "Add internal notes about your work on this case"
Visibility:    Internal only (NOT visible to customer)

Sortable:      NO
Filterable:    NO
Searchable:    YES
Default Value: None

Purpose: Private notes for support team
Access: csm_agent and above only
Example: "Checked email configuration - settings are correct"
```

#### 30. **Comments** (comments)
```
Field Name:    comments
Type:          Text (large text area)
Label:         Comments
Mandatory:     NO
Read-Only:     NO
Max Length:    Unlimited
HTML Editor:   YES
Placeholder:   "Add comments visible to the customer"
Visibility:    Customer visible (visible to customer)

Sortable:      NO
Filterable:    NO
Searchable:    YES
Default Value: None

Purpose: Customer-visible communication
Access: csm_agent and above can write
Example: "We have identified the issue and are working on a solution"
```

---

### GROUP 10: ESCALATION & SATISFACTION

#### 31. **Escalated** (is_escalated)
```
Field Name:    is_escalated
Type:          Boolean
Label:         Escalated
Mandatory:     NO
Read-Only:     NO
Default Value: false

Sortable:      YES
Filterable:    YES
Values:        true / false

Purpose: Flag indicating case is escalated
Triggers: Shows escalation_reason field when true
```

#### 32. **Escalation Reason** (escalation_reason)
```
Field Name:    escalation_reason
Type:          Text
Label:         Escalation Reason
Mandatory:     NO (Required if escalated)
Read-Only:     NO
Max Length:    Unlimited
Placeholder:   "Explain why this case was escalated"
HTML Editor:   NO

Sortable:      NO
Filterable:    NO
Searchable:    YES
Default Value: None
Visible When:  is_escalated = true
Required When: is_escalated = true

Example: "Customer very dissatisfied, requires immediate attention"
```

#### 33. **Satisfaction** (customer_satisfaction)
```
Field Name:    customer_satisfaction
Type:          Choice
Label:         Satisfaction
Mandatory:     NO (Required if closed)
Read-Only:     NO

Choices:
  ├─ 1 - Very Dissatisfied
  ├─ 2 - Dissatisfied
  ├─ 3 - Neutral
  ├─ 4 - Satisfied
  └─ 5 - Very Satisfied

Default Value: None
Sortable:      YES
Filterable:    YES
Required When: state = closed
Triggers:      Sets feedback_provided = true when set
```

#### 34. **Feedback Provided** (feedback_provided)
```
Field Name:    feedback_provided
Type:          Boolean
Label:         Feedback Provided
Mandatory:     NO
Read-Only:     YES (auto-set)
Default Value: false

Sortable:      YES
Filterable:    YES
Values:        true / false
Auto-Populate: When customer_satisfaction is set
Purpose:       Tracks if customer provided feedback
```

---

## Form Layout Organization

### CREATE FORM
```
├─ Customer Information
│  ├─ Customer Account *
│  ├─ Customer Contact *
│  ├─ Customer Email *
│  └─ Customer Phone
│
├─ Case Details
│  ├─ Short Description *
│  ├─ Description
│  ├─ Priority *
│  ├─ Category *
│  └─ Subcategory
│
└─ Assignment
   ├─ Assignment Group
   └─ Assigned To
```

### EDIT FORM
```
├─ Case Information
│  ├─ Case Number (display only)
│  ├─ Short Description
│  ├─ Description
│  ├─ State
│  └─ Priority
│
├─ Customer
│  ├─ Customer Account
│  ├─ Customer Contact
│  ├─ Customer Email
│  └─ Customer Phone
│
├─ Classification
│  ├─ Category
│  └─ Subcategory
│
├─ Assignment
│  ├─ Assignment Group
│  ├─ Assigned To
│  └─ Assigned To Date (display only)
│
├─ SLA
│  ├─ SLA Policy
│  ├─ SLA Due Date (display only)
│  └─ SLA Status (display only)
│
└─ Notes & Communication
   ├─ Work Notes
   └─ Comments
```

### RESOLVE FORM
```
├─ Resolution
│  ├─ State
│  ├─ Resolution Code
│  └─ Resolution Notes
│
└─ Escalation
   ├─ Escalated
   └─ Escalation Reason
```

### CLOSE FORM
```
└─ Closure Information
   ├─ State
   ├─ Closure Code
   ├─ Resolution Notes
   └─ Satisfaction
```

---

## Field Dependencies & Visibility

| Field | Depends On | Visible When | Required When |
|-------|-----------|-------------|--------------|
| customer_contact | customer_account | Always | Always |
| subcategory | category | Always | Never |
| assigned_to | assignment_group | Always | Never |
| sla_due_date | sla_policy | Always | Never |
| resolution_notes | state | state = resolved/closed | state = resolved/closed |
| closure_code | state | state = closed | state = closed |
| customer_satisfaction | state | state = closed | state = closed |
| escalation_reason | is_escalated | is_escalated = true | is_escalated = true |

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| short_description | Min 5, Max 160 | Must be 5-160 characters |
| customer_email | Valid email | Must be valid email address |
| priority | In (1,2,3,4,5) | Must select valid priority |
| category | Not null | Category is required |
| state | In (new, open, ...) | Must select valid state |
| resolution_notes | Min 10 chars if set | Resolution notes required if resolved |
| customer_satisfaction | In (1,2,3,4,5) if set | Valid rating required |

---

## API/Integration Information

### Case Number Format
- **Prefix**: CSE
- **Digits**: 7 numbers
- **Example**: CSE-1000042
- **Auto-Increment**: Enabled

### Mandatory Fields for Creation
1. short_description
2. customer_account
3. customer_contact
4. customer_email
5. priority
6. category
7. state (defaults to 'new')

### Read-Only Fields (System Managed)
- number (auto-generated)
- opened_at
- updated_on
- created_on
- assigned_to_date
- sla_due_date
- response_sla
- resolution_sla
- sla_status
- reopened_count
- feedback_provided

---

## Status

✅ **Complete** - All 34 fields specified with types, defaults, and validation  
✅ **Production Ready** - Ready for ServiceNow implementation  
✅ **Documented** - See customer_case_fields.ts for detailed configuration

---

**Version**: 1.0.0  
**Created**: May 25, 2026  
**Last Updated**: May 25, 2026
