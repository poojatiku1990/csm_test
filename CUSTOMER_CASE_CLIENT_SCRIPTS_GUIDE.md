# Customer Case - Client Scripts & UI Policies Documentation

**Scope**: x_20261805_csm  
**Table**: Customer Case (x_20261805_csm_customer_case)  
**Total Client Scripts**: 5  
**Total UI Policies**: 5  
**Created**: May 25, 2026

---

## Overview

Client Scripts and UI Policies control the form behavior and user experience on the client side (in the browser). They run without server communication for instant feedback.

### Capabilities

| Feature | Purpose |
|---------|---------|
| **Client Scripts** | Run JavaScript on form events (load, change, submit) |
| **UI Policies** | Control field visibility, mandatory status, read-only state |
| **Field Validation** | Real-time validation and error messages |
| **Dynamic Forms** | Progressive field reveal based on workflow |
| **User Guidance** | Warnings, tooltips, and contextual help |

---

## CLIENT SCRIPTS

### CLIENT SCRIPT 1: Form onLoad - Initialize Fields

**Name**: Form Load - Initialize and Display Case Information  
**Table**: x_20261805_csm_customer_case  
**Type**: onLoad  
**Active**: Yes

#### Purpose
Initializes the form when it loads with proper field visibility, messages, and state setup.

#### Triggers
- Runs automatically when form loads (insert or edit)
- Before user can interact with form

#### Actions Performed

1. **Get Current State**
   - Retrieves current case state
   - Retrieves current priority

2. **Update Field Visibility**
   - Shows/hides fields based on state
   - Sets mandatory status for relevant fields

3. **Display Priority Warning**
   - Shows warning for Priority 1 (Critical)
   - Shows warning for Priority 2 (High)

4. **Display Account Information**
   - Retrieves account details if account is set
   - Shows account name and type

5. **Update Resolution Notes Mandatory**
   - Sets resolution_notes as mandatory if state is resolved/closed
   - Shows field if needed

#### Code Section
```javascript
// Key functions:
- updateFieldVisibility(state) - Controls field visibility
- displayPriorityWarning(priority) - Shows priority alerts
- displayCustomerContactDetails() - Shows account info
- updateResolutionNotesMandatory(state) - Sets mandatory fields
```

#### Example Flow
```
Form loads
  ↓
onLoad script runs
  ↓
├─ Check state (e.g., "in_progress")
├─ Show relevant fields for that state
├─ Check priority (e.g., "1" = Critical)
├─ Show warning: "🚨 CRITICAL PRIORITY"
├─ Get account details
├─ Show: "Account: Acme Corp (Enterprise)"
└─ Form ready for user
```

---

### CLIENT SCRIPT 2: On State Change - Update Fields Based on State

**Name**: On State Change - Update Field Visibility and Validation  
**Table**: x_20261805_csm_customer_case  
**Type**: onChange  
**Field**: state  
**Active**: Yes

#### Purpose
Dynamically updates form layout and field requirements when the case state changes.

#### Triggers
- When state field value changes
- Before update is submitted

#### Field Visibility by State

```
STATE: new
├─ Hide: assigned_to, assignment_group, resolution fields, closure fields
└─ Message: (none)

STATE: open
├─ Show: assigned_to, assignment_group
├─ Hide: resolution fields, closure fields
└─ Message: "Case is open. Please review and assign if needed"

STATE: in_progress
├─ Show: assigned_to, assignment_group, resolution_code, resolution_notes
├─ Hide: closure fields
└─ Message: "Case is in progress. Please update resolution details"

STATE: waiting_on_customer
├─ Show: assigned_to, assignment_group, resolution fields
├─ Hide: closure fields
└─ Message: "Case is waiting on customer response"

STATE: resolved
├─ Show: ALL fields except closure_code
├─ Mandatory: resolution_code, resolution_notes
├─ Hide: closure_code, customer_satisfaction
└─ Message: "Case is resolved. Please fill in resolution details before closing"

STATE: closed
├─ Show: ALL fields
├─ Mandatory: resolution_code, resolution_notes, closure_code, customer_satisfaction
└─ Message: "Case is closed. Archive this case after confirmation"

STATE: cancelled
├─ Show: assigned_to, assignment_group, resolution fields
├─ Hide: closure fields
└─ Message: "Case has been cancelled"
```

#### Actions Performed

1. **Update Field Visibility**
   - Shows/hides fields based on new state
   - Different layout for each state

2. **Display State Messages**
   - Shows notification appropriate to state
   - Guides user on next actions

3. **Update Mandatory Fields**
   - Sets resolution fields mandatory when resolved/closed
   - Sets closure fields mandatory when closed

4. **Validate State Transition**
   - Checks if transition is valid
   - Prevents invalid transitions
   - Reverts if invalid

#### Valid State Transitions
```
new          → open, cancelled
open         → in_progress, waiting_on_customer, cancelled
in_progress  → waiting_on_customer, resolved, cancelled
waiting_on_customer → in_progress, resolved, cancelled
resolved     → closed, open (reopen)
closed       → open (reopen)
cancelled    → (none, final state)
```

#### Example Flow
```
User changes state: in_progress → resolved
  ↓
onChange script triggered
  ↓
├─ Check validity: in_progress → resolved ✓ Valid
├─ Update visibility:
│  ├─ Show resolution_notes (mandatory)
│  ├─ Hide closure_code
│  └─ Hide customer_satisfaction
├─ Update mandatory: resolution_notes = required
├─ Display message: "Case is resolved. Please fill in resolution details..."
└─ Form updated
```

---

### CLIENT SCRIPT 3: On Priority Change - Display Priority Warning

**Name**: On Priority Change - Display Priority Warning  
**Table**: x_20261805_csm_customer_case  
**Type**: onChange  
**Field**: priority  
**Active**: Yes

#### Purpose
Displays visual warnings and SLA information when priority level changes.

#### Triggers
- When priority field value changes
- Before user continues

#### Priority Levels & Messages

| Priority | Message | Display | SLA |
|----------|---------|---------|-----|
| **1** | 🚨 CRITICAL - Requires immediate attention & senior support | Warning (Red) | Response: 15 min, Resolution: 2 hrs |
| **2** | ⚠️ HIGH - Should be addressed urgently | Warning (Orange) | Response: 30 min, Resolution: 4 hrs |
| **3** | ℹ️ MEDIUM - Normal support handling | Info | Response: 2 hrs, Resolution: 24 hrs |
| **4** | LOW - Can be handled in standard queue | Info | Response: 4 hrs, Resolution: 48 hrs |
| **5** | MINIMAL - Handle when resources available | Info | Response: 24 hrs, Resolution: 5 days |

#### Actions Performed

1. **Clear Previous Messages**
   - Removes old priority message

2. **Display Priority Warning**
   - Shows emoji-based indicator
   - Color-coded by severity
   - Persistent message

3. **Display SLA Information**
   - Shows response time target
   - Shows resolution time target
   - Enables user to understand commitments

#### Code Section
```javascript
// Key functions:
- Switch on priority level
- Display appropriate message with emoji
- Call displaySLAInfo()
- getSLAInfo() returns SLA matrix
```

#### Example Messages
```
Priority 1 Selected:
  Icon: 🚨 (red alert)
  Message: "CRITICAL PRIORITY - This case requires immediate attention 
            and senior support!"
  SLA: "Response 15 min, Resolution 2 hours"
  Display: Warning (red background)

Priority 3 Selected:
  Icon: ℹ️ (blue info)
  Message: "MEDIUM PRIORITY - Normal support handling"
  SLA: "Response 2 hours, Resolution 24 hours"
  Display: Info (standard)
```

---

### CLIENT SCRIPT 4: On Account Selected - Display Account Details

**Name**: On Account Selected - Display Account Details and Contacts  
**Table**: x_20261805_csm_customer_case  
**Type**: onChange  
**Field**: customer_account  
**Active**: Yes

#### Purpose
When a customer account is selected, displays account details and filters available contacts.

#### Triggers
- When customer_account field changes
- Before user continues with contact selection

#### Actions Performed

1. **Get Account ID**
   - Retrieves selected account value
   - Returns if account is empty

2. **Query Account Details**
   - Gets account record from database
   - Retrieves account information

3. **Display Account Information**
   ```
   Account: [Account Name]
   Type: [Enterprise/SMB/Startup/etc]
   Support Tier: [Basic/Standard/Premium/Enterprise]
   Phone: [Phone Number]
   ```

4. **Filter Contact Lookup**
   - Configures reference qualifier
   - Shows only contacts in this account

5. **Display Available Contacts**
   - Lists all active contacts in account
   - Marks primary contact
   - Shows email addresses
   ```
   Available Contacts: 
   John Smith (Primary) - john@acme.com, 
   Jane Doe - jane@acme.com,
   Bob Johnson - bob@acme.com
   ```

#### Example Flow
```
User selects account: "Acme Corporation"
  ↓
onChange script runs
  ↓
├─ Query account details from database
├─ Display account information:
│  Account: Acme Corporation
│  Type: Enterprise
│  Support Tier: Premium
│  Phone: 555-0100
├─ Filter customer_contact field for Acme contacts
├─ Query available contacts:
│  - John Smith (Primary) - john@acme.com
│  - Jane Doe - jane@acme.com
│  - Bob Johnson - bob@acme.com
├─ Display available contacts message
└─ User can now select from filtered contacts
```

#### Database Query Used
```javascript
GlideRecord('x_20261805_csm_customer_account')
  ↓ get(accountId)
  ↓
GlideRecord('x_20261805_csm_customer_contact')
  ↓ query: customer_account = accountId AND active = true
```

---

### CLIENT SCRIPT 5: On Resolution Notes Change - Validate Content

**Name**: On Resolution Notes Change - Validate Content  
**Table**: x_20261805_csm_customer_case  
**Type**: onChange  
**Field**: resolution_notes  
**Active**: Yes

#### Purpose
Validates resolution notes content and provides real-time feedback.

#### Triggers
- When resolution_notes field changes
- Only when state is resolved or closed

#### Validations Performed

1. **Check if Notes Required**
   - Only validate if state = resolved OR closed
   - Skip validation for other states

2. **Check if Empty**
   - Displays error: "Resolution notes are required"
   - Sets field as mandatory

3. **Check Minimum Length**
   - Minimum: 10 characters
   - Displays warning if less than 10 chars
   - Helps ensure meaningful documentation

4. **Display Character Count**
   - Shows current character count
   - Provides feedback: "✓ Resolution notes provided (245 characters)"

#### Validation Messages

| Condition | Message | Type |
|-----------|---------|------|
| State resolved/closed, empty | "Resolution notes are required" | Error |
| < 10 characters | "Resolution notes must be at least 10 characters" | Warning |
| Valid (≥10 chars) | "✓ Resolution notes provided (X characters)" | OK |

#### Example Flow
```
State: resolved
User enters resolution notes:
  "Unable to resolve"
  ↓
onChange script runs
  ↓
├─ Check state: resolved ✓
├─ Check empty: not empty ✓
├─ Check length: 19 characters (>= 10) ✓
├─ Display: "✓ Resolution notes provided (19 characters)"
└─ Valid ✓

User edits to:
  "Cannot"
  ↓
onChange script runs
  ↓
├─ Check state: resolved ✓
├─ Check empty: not empty ✓
├─ Check length: 6 characters (< 10) ✗
├─ Display warning: "Resolution notes must be at least 10 characters"
└─ Invalid ⚠️
```

---

## UI POLICIES

### UI POLICY 1: Show/Hide Resolution Fields Based on State

**Name**: Show/Hide Resolution Fields  
**Table**: x_20261805_csm_customer_case  
**Type**: UI Policy  
**Active**: Yes

#### Purpose
Controls visibility of resolution and closure fields based on case state.

#### Policy Rules

##### Rule 1: Show Resolution Fields When Resolved
```
Condition: state = "resolved"
Actions:
  ├─ resolution_code: Visible = true, Mandatory = true
  ├─ resolution_notes: Visible = true, Mandatory = true
  ├─ closure_code: Visible = false, Mandatory = false
  └─ customer_satisfaction: Visible = false, Mandatory = false
```

##### Rule 2: Show All Closure Fields When Closed
```
Condition: state = "closed"
Actions:
  ├─ resolution_code: Visible = true, Mandatory = true
  ├─ resolution_notes: Visible = true, Mandatory = true
  ├─ closure_code: Visible = true, Mandatory = true
  └─ customer_satisfaction: Visible = true, Mandatory = true
```

##### Rule 3: Hide Resolution Fields in Other States
```
Condition: state != "resolved" AND state != "closed"
Actions:
  ├─ resolution_code: Visible = false, Mandatory = false
  ├─ resolution_notes: Visible = false, Mandatory = false
  ├─ closure_code: Visible = false, Mandatory = false
  └─ customer_satisfaction: Visible = false, Mandatory = false
```

#### Field Behavior by State

| State | resolution_code | resolution_notes | closure_code | customer_satisfaction |
|-------|----------------|-----------------|--------------|----------------------|
| new | ✗ | ✗ | ✗ | ✗ |
| open | ✗ | ✗ | ✗ | ✗ |
| in_progress | ✓ | ✓ | ✗ | ✗ |
| waiting_on_customer | ✓ | ✓ | ✗ | ✗ |
| resolved | ✓✓ | ✓✓ | ✗ | ✗ |
| closed | ✓✓ | ✓✓ | ✓✓ | ✓✓ |
| cancelled | ✓ | ✓ | ✗ | ✗ |

(✓ = visible, optional | ✓✓ = visible, mandatory | ✗ = hidden)

---

### UI POLICY 2: Make Resolution Notes Mandatory

**Name**: Make Resolution Notes Mandatory  
**Table**: x_20261805_csm_customer_case  
**Type**: UI Policy  
**Active**: Yes

#### Purpose
Ensures resolution notes are filled in when case is resolved or closed.

#### Condition
```
state = "resolved" OR state = "closed"
```

#### Actions
```
resolution_notes:
  ├─ Mandatory: true (red asterisk shows in form)
  ├─ Visible: true
  └─ Cannot submit until filled

resolution_code:
  ├─ Mandatory: true
  ├─ Visible: true
  └─ Cannot submit until filled
```

#### User Experience
```
User tries to close case without resolution notes:
  ↓
Form prevents submission
  ↓
Red asterisk appears on resolution_notes field
  ↓
Error message: "This field is required"
  ↓
User must fill field before proceeding
```

---

### UI POLICY 3: Hide Closure Code Until Closing

**Name**: Hide Closure Code Until Closing  
**Table**: x_20261805_csm_customer_case  
**Type**: UI Policy  
**Active**: Yes

#### Purpose
Progressively reveals fields as workflow progresses, hiding closure code until case is actually being closed.

#### Condition
```
state != "closed"
```

#### Actions
```
closure_code:
  ├─ Visible: false (field not shown)
  ├─ Mandatory: false
  ├─ Disabled: true (grayed out if visible)
  └─ Cannot interact until state = "closed"
```

#### Workflow Example
```
Case Lifecycle:

new → open → in_progress → resolved → closed
      ✗        ✗          ✗         ✓
   closure_code remains hidden until...

When state → closed:
closure_code field appears
```

#### Benefit
```
Reduces form clutter
- User only sees relevant fields
- Focuses attention on current step
- Guides through workflow naturally
```

---

### UI POLICY 4: Display Customer Account Information

**Name**: Display Customer Account Information  
**Table**: x_20261805_csm_customer_case  
**Type**: UI Policy  
**Active**: Yes

#### Purpose
Highlights and displays customer account information, emphasizing importance.

#### Condition
```
customer_account IS NOT EMPTY
```

#### Actions
```
customer_account:
  ├─ Visible: true
  ├─ Highlighted: true (colored background)
  └─ Tooltip: "Customer Account - Click to view account details"

customer_contact:
  ├─ Visible: true
  └─ Mandatory: true
```

#### Visual Effects
```
When account is selected:
┌─────────────────────────────┐
│ Customer Account: Acme Corp │  ← Highlighted with background
│ (Click to view details)      │     color for visibility
└─────────────────────────────┘
```

#### Purpose
```
- Ensures account always visible
- Highlights customer relationship
- Reminds user of account context
- Makes contact selection obvious
```

---

### UI POLICY 5: Validate Priority Selection

**Name**: Validate Priority Selection  
**Table**: x_20261805_csm_customer_case  
**Type**: UI Policy  
**Active**: Yes

#### Purpose
Provides visual indicators for priority levels to quickly identify critical/high-priority cases.

#### Policy Rules

##### Rule 1: Highlight Critical Priority
```
Condition: priority = "1"
Actions:
  priority field:
    ├─ Visible: true
    ├─ Highlighted: true
    └─ Background: #ff6666 (red)
```

##### Rule 2: Highlight High Priority
```
Condition: priority = "2"
Actions:
  priority field:
    ├─ Visible: true
    ├─ Highlighted: true
    └─ Background: #ffcc66 (orange)
```

##### Rule 3: Normal Priority Display
```
Condition: priority = "3" OR priority = "4" OR priority = "5"
Actions:
  priority field:
    ├─ Visible: true
    └─ Highlighted: false (normal display)
```

#### Color Scheme
```
Priority 1 (Critical):     #ff6666  ← Red background
Priority 2 (High):         #ffcc66  ← Orange background
Priority 3 (Medium):       default
Priority 4 (Low):          default
Priority 5 (Minimal):      default
```

#### Visual Example
```
┌─────────────────────────────────────┐
│ Priority: 1 - Critical   |           │  ← Red background
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Priority: 2 - High       |           │  ← Orange background
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Priority: 3 - Medium     |           │  ← Default colors
└─────────────────────────────────────┘
```

---

## Implementation Summary

### Client Scripts to Create (5 Total)

| # | Script Name | Type | Field | Order |
|---|-------------|------|-------|-------|
| 1 | Form Load - Initialize Fields | onLoad | - | 1 |
| 2 | State Change - Update Fields | onChange | state | 2 |
| 3 | Priority Change - Display Warning | onChange | priority | 3 |
| 4 | Account Selected - Show Details | onChange | customer_account | 4 |
| 5 | Resolution Notes - Validate | onChange | resolution_notes | 5 |

### UI Policies to Create (5 Total)

| # | Policy Name | Purpose | Condition |
|---|-------------|---------|-----------|
| 1 | Show/Hide Resolution Fields | Control field visibility | state varies |
| 2 | Make Resolution Notes Mandatory | Enforce documentation | state = resolved/closed |
| 3 | Hide Closure Code | Progressive reveal | state != closed |
| 4 | Display Account Information | Highlight customer | account != empty |
| 5 | Validate Priority Selection | Visual indicators | priority level |

---

## Field Coverage

### Fields Affected by Client Scripts

```
state
  ├─ Script 1 (onLoad): Read state
  ├─ Script 2 (onChange): React to changes
  └─ UI Policy 1, 2, 3: Control visibility

priority
  ├─ Script 1 (onLoad): Display warning
  ├─ Script 3 (onChange): Display warning & SLA
  └─ UI Policy 5: Color coding

customer_account
  ├─ Script 1 (onLoad): Display details
  ├─ Script 4 (onChange): Display details & filter contacts
  └─ UI Policy 4: Highlight field

customer_contact
  ├─ Script 4 (onChange): Filter by account
  └─ UI Policy 4: Set mandatory

resolution_notes
  ├─ Script 1 (onLoad): Set mandatory if needed
  ├─ Script 2 (onChange): Set mandatory if resolved
  ├─ Script 5 (onChange): Validate content
  └─ UI Policy 1, 2: Control visibility & mandatory

resolution_code
  └─ UI Policy 1, 2: Control visibility & mandatory

closure_code
  ├─ Script 2 (onChange): Show when closed
  └─ UI Policy 1, 3: Control visibility

customer_satisfaction
  └─ UI Policy 1: Control visibility & mandatory
```

---

## Testing Checklist

### Script 1 - onLoad
- [ ] Create new case → form loads with default values
- [ ] Edit existing case → form loads with current values
- [ ] Priority warning displays if Priority 1 or 2
- [ ] Account info displays if account set
- [ ] Resolution notes field correct state

### Script 2 - State Change
- [ ] Change state from new → open → Shows/hides correct fields
- [ ] Change state from open → in_progress → Shows resolution fields
- [ ] Change state to resolved → Makes resolution_notes mandatory
- [ ] Change state to closed → Shows closure fields
- [ ] Invalid transition blocked (e.g., new → closed)
- [ ] State messages display appropriately

### Script 3 - Priority Change
- [ ] Set priority to 1 → Shows critical warning (red)
- [ ] Set priority to 2 → Shows high warning (orange)
- [ ] Set priority to 3 → Shows medium info (default)
- [ ] Set priority to 4, 5 → No special styling
- [ ] SLA info displays for each priority

### Script 4 - Account Change
- [ ] Select account → Account details display
- [ ] Select account → Contact list filtered
- [ ] Contact dropdown shows only contacts from selected account
- [ ] Primary contact marked in list
- [ ] Clear account → Contact list resets

### Script 5 - Resolution Notes Change
- [ ] State = resolved, enter notes → Validates
- [ ] < 10 characters → Warning displayed
- [ ] >= 10 characters → Success message with count
- [ ] Other states → No validation

### UI Policies
- [ ] Policy 1: Fields visible/hidden by state
- [ ] Policy 2: Resolution notes mandatory when resolved
- [ ] Policy 3: Closure code hidden until closed
- [ ] Policy 4: Account info highlighted
- [ ] Policy 5: Priority colors display correctly

---

## Performance Considerations

- **Client Scripts**: Run in browser, no server calls except data lookup
- **UI Policies**: Applied instantly, no delay
- **GlideRecord Queries**: Minimized in scripts for performance
- **Form Load Time**: Optimized with efficient queries

---

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers supported

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Created**: May 25, 2026
