# Customer Case - Client Scripts & UI Policies Implementation Checklist

**Scope**: x_20261805_csm  
**Table**: Customer Case (x_20261805_csm_customer_case)  
**Components**: 5 Client Scripts + 5 UI Policies  
**Estimated Implementation Time**: 2-3 hours  
**Created**: May 25, 2026

---

## Pre-Implementation Checklist

- [ ] ServiceNow instance access (Paris or later)
- [ ] x_20261805_csm scope created
- [ ] Customer Case table exists with all 34 fields
- [ ] Customer Account table exists
- [ ] Customer Contact table exists
- [ ] All tables have proper relationships defined
- [ ] Reference fields configured with filters
- [ ] Browser compatibility verified (Chrome, Firefox, Safari, Edge)
- [ ] Test environment ready

---

## Implementation Overview

### Step 1: Create Client Scripts (5 scripts)
### Step 2: Create UI Policies (5 policies)
### Step 3: Testing
### Step 4: Deployment

---

## STEP 1: CREATE CLIENT SCRIPTS

### CLIENT SCRIPT 1: Form onLoad

**Navigate To**: System UI → Client Scripts → New

**Fill Dialog Fields**:
```
Name: Form Load - Initialize and Display Case Information
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Type: onLoad
```

**Copy Script From**: [customer_case_client_scripts.ts](src/servicenow/clientScripts/customer_case_client_scripts.ts)
- Copy the script content from CLIENT_SCRIPT_ON_LOAD.script

**Paste Into**: Script field

**Test Scenario 1.1: New Case**
1. Navigate to Customer Case → New
2. Form loads
3. **Verify**:
   - [ ] State shows empty/default
   - [ ] Resolution fields hidden
   - [ ] No priority warning (if priority empty)

**Test Scenario 1.2: Edit with Priority 1**
1. Create case with Priority = 1
2. Open case record to edit
3. Form loads
4. **Verify**:
   - [ ] Warning displays: "🚨 CRITICAL PRIORITY"
   - [ ] Warning appears on priority field

**Test Scenario 1.3: Account Set**
1. Create case with customer_account selected
2. Open case record
3. Form loads
4. **Verify**:
   - [ ] Account name displays
   - [ ] Account type displays
   - [ ] Info message shows on account field

**Test Scenario 1.4: Resolved State**
1. Create case with state = "resolved"
2. Open case record
3. Form loads
4. **Verify**:
   - [ ] resolution_notes field is visible
   - [ ] resolution_notes field shows as mandatory (red asterisk)

**Status**: ✅ Complete
- [ ] Script created
- [ ] All scenarios passed

---

### CLIENT SCRIPT 2: On State Change

**Navigate To**: System UI → Client Scripts → New

**Fill Dialog Fields**:
```
Name: On State Change - Update Field Visibility and Validation
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Type: onChange
Field name: state
```

**Copy Script From**: [customer_case_client_scripts.ts](src/servicenow/clientScripts/customer_case_client_scripts.ts)
- Copy the script content from CLIENT_SCRIPT_ON_STATE_CHANGE.script

**Paste Into**: Script field

**Test Scenario 2.1: New → Open**
1. Create new case (state = "new")
2. Change state from "new" to "open"
3. **Verify**:
   - [ ] assigned_to field becomes visible
   - [ ] assignment_group field becomes visible
   - [ ] resolution fields remain hidden
   - [ ] Message displays: "Case is open..."
   - [ ] Update successful

**Test Scenario 2.2: Open → In Progress**
1. Open case with state = "open"
2. Change state to "in_progress"
3. **Verify**:
   - [ ] resolution_code becomes visible
   - [ ] resolution_notes becomes visible
   - [ ] closure fields remain hidden
   - [ ] Message displays: "Case is in progress..."
   - [ ] Resolution fields NOT mandatory yet

**Test Scenario 2.3: In Progress → Resolved**
1. Open case with state = "in_progress"
2. Change state to "resolved"
3. **Verify**:
   - [ ] resolution_code remains visible, becomes MANDATORY
   - [ ] resolution_notes remains visible, becomes MANDATORY
   - [ ] closure_code becomes hidden
   - [ ] customer_satisfaction becomes hidden
   - [ ] Message displays: "Case is resolved..."
   - [ ] Red asterisks appear on mandatory fields

**Test Scenario 2.4: Resolved → Closed**
1. Open case with state = "resolved"
2. Change state to "closed"
3. **Verify**:
   - [ ] All resolution fields visible and mandatory
   - [ ] closure_code becomes visible and MANDATORY
   - [ ] customer_satisfaction becomes visible and MANDATORY
   - [ ] Message displays: "Case is closed..."

**Test Scenario 2.5: Invalid Transition (Blocked)**
1. Open case with state = "new"
2. Try to change state to "closed" (invalid)
3. **Verify**:
   - [ ] Alert displays: "Invalid state transition"
   - [ ] State reverts to "new"
   - [ ] Update blocked

**Test Scenario 2.6: Valid Reopen (Closed → Open)**
1. Open case with state = "closed"
2. Change state to "open"
3. **Verify**:
   - [ ] Transition allowed
   - [ ] Transition is valid
   - [ ] Update successful

**Status**: ✅ Complete
- [ ] Script created
- [ ] All scenarios passed

---

### CLIENT SCRIPT 3: On Priority Change

**Navigate To**: System UI → Client Scripts → New

**Fill Dialog Fields**:
```
Name: On Priority Change - Display Priority Warning
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Type: onChange
Field name: priority
```

**Copy Script From**: [customer_case_client_scripts.ts](src/servicenow/clientScripts/customer_case_client_scripts.ts)
- Copy the script content from CLIENT_SCRIPT_ON_PRIORITY_CHANGE.script

**Paste Into**: Script field

**Test Scenario 3.1: Priority 1 (Critical)**
1. Create new case
2. Set priority to "1"
3. **Verify**:
   - [ ] Warning message displays: "🚨 CRITICAL PRIORITY"
   - [ ] Shows "immediate attention and senior support"
   - [ ] SLA displays: "Response: 15 min, Resolution: 2 hours"
   - [ ] Message shows as "warning" type (red color)

**Test Scenario 3.2: Priority 2 (High)**
1. Open case
2. Change priority to "2"
3. **Verify**:
   - [ ] Warning message displays: "⚠️ HIGH PRIORITY"
   - [ ] Shows "should be addressed urgently"
   - [ ] SLA displays: "Response: 30 min, Resolution: 4 hours"
   - [ ] Message shows as "warning" type

**Test Scenario 3.3: Priority 3 (Medium)**
1. Open case
2. Change priority to "3"
3. **Verify**:
   - [ ] Message displays: "ℹ️ MEDIUM PRIORITY"
   - [ ] Shows "Normal support handling"
   - [ ] SLA displays: "Response: 2 hours, Resolution: 24 hours"
   - [ ] Message shows as "info" type

**Test Scenario 3.4: Priority 4 (Low)**
1. Open case
2. Change priority to "4"
3. **Verify**:
   - [ ] Message displays: "LOW PRIORITY"
   - [ ] Shows "standard queue"
   - [ ] SLA displays: "Response: 4 hours, Resolution: 48 hours"
   - [ ] Message shows as "info" type

**Test Scenario 3.5: Priority 5 (Minimal)**
1. Open case
2. Change priority to "5"
3. **Verify**:
   - [ ] Message displays: "MINIMAL PRIORITY"
   - [ ] Shows "when resources available"
   - [ ] SLA displays: "Response: 24 hours, Resolution: 5 days"
   - [ ] Message shows as "info" type

**Status**: ✅ Complete
- [ ] Script created
- [ ] All scenarios passed

---

### CLIENT SCRIPT 4: On Account Selected

**Navigate To**: System UI → Client Scripts → New

**Fill Dialog Fields**:
```
Name: On Account Selected - Display Account Details and Contacts
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Type: onChange
Field name: customer_account
```

**Copy Script From**: [customer_case_client_scripts.ts](src/servicenow/clientScripts/customer_case_client_scripts.ts)
- Copy the script content from CLIENT_SCRIPT_ON_ACCOUNT_CHANGE.script

**Paste Into**: Script field

**Prerequisites**:
- [ ] Create test Customer Accounts with various types and tiers
- [ ] Create test Customer Contacts linked to those accounts
- [ ] Mark one contact as "Primary" in each account

**Test Scenario 4.1: Select Account with Details**
1. Create/open case
2. Select customer_account = "Acme Corporation"
3. **Verify**:
   - [ ] Account info displays:
     - Account: Acme Corporation
     - Type: Enterprise
     - Support Tier: Premium
     - Phone: 555-0100
   - [ ] Message shows on account field

**Test Scenario 4.2: Filter Contacts**
1. Select account "Acme Corporation"
2. Click on customer_contact dropdown
3. **Verify**:
   - [ ] Only contacts from Acme Corporation appear
   - [ ] Contacts from other accounts NOT shown

**Test Scenario 4.3: Display Available Contacts**
1. Select account with 3 contacts (1 primary)
2. **Verify**:
   - [ ] Message displays all contacts:
     - "Available Contacts: John Smith (Primary) - john@acme.com, Jane Doe - jane@acme.com, Bob Johnson - bob@acme.com"
   - [ ] Primary contact marked with (Primary)
   - [ ] Emails visible

**Test Scenario 4.4: Clear Account Selection**
1. Select account (contacts appear)
2. Clear account field
3. **Verify**:
   - [ ] Contact list resets
   - [ ] Account message cleared

**Test Scenario 4.5: Account with No Contacts**
1. Create account with no active contacts
2. Select that account
3. **Verify**:
   - [ ] Account info displays
   - [ ] No error shown
   - [ ] Contact field empty

**Status**: ✅ Complete
- [ ] Script created
- [ ] All scenarios passed

---

### CLIENT SCRIPT 5: On Resolution Notes Change

**Navigate To**: System UI → Client Scripts → New

**Fill Dialog Fields**:
```
Name: On Resolution Notes Change - Validate Content
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Type: onChange
Field name: resolution_notes
```

**Copy Script From**: [customer_case_client_scripts.ts](src/servicenow/clientScripts/customer_case_client_scripts.ts)
- Copy the script content from CLIENT_SCRIPT_ON_RESOLUTION_NOTES_CHANGE.script

**Paste Into**: Script field

**Test Scenario 5.1: Enter Valid Notes (Resolved State)**
1. Open case with state = "resolved"
2. Enter in resolution_notes: "Issue was caused by incorrect configuration. Fixed settings in admin panel. User confirmed resolution working properly."
3. **Verify**:
   - [ ] Message displays: "✓ Resolution notes provided (XX characters)"
   - [ ] Message shows as "ok" type (green)
   - [ ] Character count shows
   - [ ] No error

**Test Scenario 5.2: Enter Too Short Notes**
1. Open case with state = "resolved"
2. Enter in resolution_notes: "Fixed it"
3. **Verify**:
   - [ ] Warning message displays: "Resolution notes must be at least 10 characters"
   - [ ] Message shows as "warning" type
   - [ ] Character count: "Fixed it" = 8 characters

**Test Scenario 5.3: Empty Notes (Resolved State)**
1. Open case with state = "resolved"
2. Leave resolution_notes empty
3. **Verify**:
   - [ ] Error message displays: "Resolution notes are required"
   - [ ] Message shows as "error" type
   - [ ] Field marked as mandatory

**Test Scenario 5.4: No Validation for Other States**
1. Open case with state = "open"
2. Try to enter empty resolution_notes
3. **Verify**:
   - [ ] No validation error shown
   - [ ] Field optional

**Test Scenario 5.5: Character Count Display**
1. Open case with state = "resolved"
2. Enter various lengths of notes
3. **Verify**:
   - [ ] Character count updates on each keystroke
   - [ ] Format: "(XX characters)" shown

**Status**: ✅ Complete
- [ ] Script created
- [ ] All scenarios passed

---

## STEP 2: CREATE UI POLICIES

### UI POLICY 1: Show/Hide Resolution Fields

**Navigate To**: System UI → UI Policies → New

**Fill Dialog Fields**:
```
Name: Show/Hide Resolution Fields
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Description: Controls visibility of resolution and closure fields based on case state
```

**Create Policy Rule 1**:
```
Rule Name: Show Resolution Fields When Resolved
Condition: state = "resolved"

Actions:
├─ Field: resolution_code
│  ├─ Visible: checked
│  └─ Mandatory: checked
│
├─ Field: resolution_notes
│  ├─ Visible: checked
│  └─ Mandatory: checked
│
├─ Field: closure_code
│  ├─ Visible: unchecked
│  └─ Mandatory: unchecked
│
└─ Field: customer_satisfaction
   ├─ Visible: unchecked
   └─ Mandatory: unchecked
```

**Create Policy Rule 2**:
```
Rule Name: Show All Closure Fields When Closed
Condition: state = "closed"

Actions:
├─ Field: resolution_code
│  ├─ Visible: checked
│  └─ Mandatory: checked
│
├─ Field: resolution_notes
│  ├─ Visible: checked
│  └─ Mandatory: checked
│
├─ Field: closure_code
│  ├─ Visible: checked
│  └─ Mandatory: checked
│
└─ Field: customer_satisfaction
   ├─ Visible: checked
   └─ Mandatory: checked
```

**Create Policy Rule 3**:
```
Rule Name: Hide Resolution Fields in Other States
Condition: state != "resolved" AND state != "closed"

Actions:
├─ Field: resolution_code
│  ├─ Visible: unchecked
│  └─ Mandatory: unchecked
│
├─ Field: resolution_notes
│  ├─ Visible: unchecked
│  └─ Mandatory: unchecked
│
├─ Field: closure_code
│  ├─ Visible: unchecked
│  └─ Mandatory: unchecked
│
└─ Field: customer_satisfaction
   ├─ Visible: unchecked
   └─ Mandatory: unchecked
```

**Test Scenario**:
1. Create case (state = "new")
   - [ ] Resolution fields hidden
2. Change to "open"
   - [ ] Resolution fields hidden
3. Change to "in_progress"
   - [ ] Resolution fields visible, optional
4. Change to "resolved"
   - [ ] Resolution fields visible, MANDATORY
   - [ ] Closure fields hidden
5. Change to "closed"
   - [ ] All fields visible, MANDATORY

**Status**: ✅ Complete
- [ ] UI Policy created
- [ ] All 3 rules created
- [ ] All scenarios passed

---

### UI POLICY 2: Make Resolution Notes Mandatory

**Navigate To**: System UI → UI Policies → New

**Fill Dialog Fields**:
```
Name: Make Resolution Notes Mandatory
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Description: Makes resolution notes field mandatory when case is resolved or closed

Condition: state = "resolved" OR state = "closed"
```

**Create Policy Action 1**:
```
Field: resolution_notes
├─ Visible: checked
└─ Mandatory: checked
```

**Create Policy Action 2**:
```
Field: resolution_code
├─ Visible: checked
└─ Mandatory: checked
```

**Test Scenario**:
1. Create case, set state to "resolved"
   - [ ] resolution_notes shows red asterisk (mandatory)
   - [ ] Cannot save without filling field
2. Try to save without notes
   - [ ] Error message: "This field is required"
3. Fill resolution_notes with content
   - [ ] Save succeeds

**Status**: ✅ Complete
- [ ] UI Policy created
- [ ] Both actions created
- [ ] All scenarios passed

---

### UI POLICY 3: Hide Closure Code Until Closing

**Navigate To**: System UI → UI Policies → New

**Fill Dialog Fields**:
```
Name: Hide Closure Code Until Closing
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Description: Hides closure code field until case transitions to closed state

Condition: state != "closed"
```

**Create Policy Action**:
```
Field: closure_code
├─ Visible: unchecked
├─ Mandatory: unchecked
└─ Disabled: checked
```

**Test Scenario**:
1. Create case (state = "new")
   - [ ] closure_code field not visible on form
2. Change state through workflow: new → open → in_progress → resolved
   - [ ] closure_code remains hidden in each state
3. Change state to "closed"
   - [ ] closure_code becomes visible
   - [ ] Field is enabled

**Status**: ✅ Complete
- [ ] UI Policy created
- [ ] All scenarios passed

---

### UI POLICY 4: Display Customer Account Information

**Navigate To**: System UI → UI Policies → New

**Fill Dialog Fields**:
```
Name: Display Customer Account Information
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Description: Shows account information and highlights primary account fields

Condition: customer_account IS NOT EMPTY
```

**Create Policy Action 1**:
```
Field: customer_account
├─ Visible: checked
├─ Highlighted: checked
└─ Tooltip: "Customer Account - Click to view account details"
```

**Create Policy Action 2**:
```
Field: customer_contact
├─ Visible: checked
└─ Mandatory: checked
```

**Test Scenario**:
1. Create case without account
   - [ ] customer_account not highlighted
   - [ ] customer_contact optional
2. Select customer_account
   - [ ] Account field gets highlighted (background color)
   - [ ] Tooltip shows on hover
   - [ ] customer_contact becomes mandatory
3. Clear account
   - [ ] Highlighting removed
   - [ ] customer_contact optional again

**Status**: ✅ Complete
- [ ] UI Policy created
- [ ] All scenarios passed

---

### UI POLICY 5: Validate Priority Selection

**Navigate To**: System UI → UI Policies → New

**Fill Dialog Fields**:
```
Name: Validate Priority Selection
Table: Customer Case (x_20261805_csm_customer_case)
Active: true
Description: Displays visual indicators for priority levels
```

**Create Policy Rule 1**:
```
Rule Name: Highlight Critical Priority
Condition: priority = "1"

Action:
Field: priority
├─ Visible: checked
├─ Highlighted: checked
└─ Background Color: #ff6666 (red)
```

**Create Policy Rule 2**:
```
Rule Name: Highlight High Priority
Condition: priority = "2"

Action:
Field: priority
├─ Visible: checked
├─ Highlighted: checked
└─ Background Color: #ffcc66 (orange)
```

**Create Policy Rule 3**:
```
Rule Name: Normal Priority Display
Condition: priority = "3" OR priority = "4" OR priority = "5"

Action:
Field: priority
├─ Visible: checked
└─ Highlighted: unchecked
```

**Test Scenario**:
1. Create case, set priority to "1"
   - [ ] Priority field shows RED background
2. Change priority to "2"
   - [ ] Priority field shows ORANGE background
3. Change priority to "3"
   - [ ] Priority field shows DEFAULT background
4. Change priority to "4" and "5"
   - [ ] Priority field shows DEFAULT background in both

**Status**: ✅ Complete
- [ ] UI Policy created
- [ ] All 3 rules created
- [ ] All scenarios passed

---

## STEP 3: COMPLETE FUNCTIONAL TESTING

### Functional Test 1: New Case Workflow

1. **Create New Case**
   - Navigate to Customer Case → New
   - [ ] Form loads with onLoad script
   - [ ] Priority warning shows if priority 1 or 2
   - [ ] Account info shows if account selected
   - [ ] Resolution fields hidden

2. **Fill Initial Fields**
   - Enter short_description: "System not responding"
   - Select customer_account: "Acme Corp"
   - [ ] Account details display
   - [ ] Contact dropdown filtered to Acme
   - Select customer_contact: "John Smith"
   - [ ] Field required, can select
   - Select priority: "1"
   - [ ] RED background applied
   - [ ] Warning shows: "CRITICAL PRIORITY"
   - [ ] SLA shows: "15 min response, 2 hour resolution"

3. **Save Case**
   - [ ] Case saves successfully
   - [ ] Case number generated: CSE-XXXXXXX
   - [ ] State = "new"

### Functional Test 2: State Transitions

1. **Open Case**
   - Change state: new → open
   - [ ] assigned_to, assignment_group visible
   - [ ] Message: "Case is open"
   - [ ] Resolution fields hidden

2. **Start Work**
   - Change state: open → in_progress
   - [ ] resolution_code visible (optional)
   - [ ] resolution_notes visible (optional)
   - [ ] Message: "Case is in progress"

3. **Resolve Case**
   - Fill resolution_code: "User Error"
   - Fill resolution_notes: "Instructed user on correct procedure. Issue resolved after training."
   - Change state: in_progress → resolved
   - [ ] resolution fields remain visible
   - [ ] RED asterisks appear (mandatory)
   - [ ] Message: "Case is resolved"
   - [ ] closure_code still hidden
   - [ ] Cannot save if notes < 10 chars
   - [ ] Can save with valid notes

4. **Close Case**
   - Fill closure_code: "Resolved"
   - Fill customer_satisfaction: "5"
   - Change state: resolved → closed
   - [ ] closure_code visible and MANDATORY
   - [ ] customer_satisfaction visible and MANDATORY
   - [ ] All mandatory fields highlighted
   - [ ] Cannot save without all fields
   - [ ] Can save with all fields filled

### Functional Test 3: Invalid Operations

1. **Invalid State Transition**
   - Create case (state = "new")
   - Try to change state: new → closed (invalid)
   - [ ] Alert shows: "Invalid state transition"
   - [ ] State reverts to "new"
   - [ ] Update blocked

2. **Incomplete Closure**
   - Create case, set state = "closed"
   - Leave resolution_notes empty
   - Try to save
   - [ ] Error message: "This field is required"
   - [ ] Save blocked
   - [ ] Field highlighted

### Functional Test 4: Script Interactions

1. **Priority Change Effects**
   - Create case
   - Set priority = "1"
   - [ ] Warning displays immediately (Script 3)
   - [ ] SLA info shows
   - [ ] Background turns RED (UI Policy 5)
   - Set priority = "3"
   - [ ] Warning removed
   - [ ] Background normal (UI Policy 5)

2. **Account Selection Effects**
   - Create case
   - Select account = "Acme Corp"
   - [ ] Account info displays (Script 4)
   - [ ] Contact dropdown filtered (Script 4)
   - [ ] Account field highlighted (UI Policy 4)
   - [ ] Contact field becomes mandatory (UI Policy 4)

3. **State Change Effects**
   - Change state: new → open → in_progress → resolved → closed
   - At each step:
   - [ ] Correct fields visible (Script 2 + UI Policy 1)
   - [ ] Correct messages display (Script 2)
   - [ ] Mandatory status updates (Script 2 + UI Policy 2)

### Functional Test 5: Validation

1. **Resolution Notes Validation**
   - Set state = "resolved"
   - Enter notes: "Fixed"
   - [ ] Warning: "must be at least 10 characters"
   - Enter notes: "Issue was fixed successfully"
   - [ ] Success message: "✓ Resolution notes provided (29 characters)"
   - [ ] Character count displays

2. **Form Load Persistence**
   - Create case with all details
   - Save
   - Refresh page
   - [ ] Form reloads with onLoad script
   - [ ] All data preserved
   - [ ] Scripts run with correct data
   - [ ] Warnings display appropriately

### Testing Sign-Off

- [ ] All 5 scripts working correctly
- [ ] All 5 UI policies working correctly
- [ ] No JavaScript errors in browser console
- [ ] All 5 functional tests passed
- [ ] All 3 invalid operation tests passed
- [ ] Performance acceptable (forms load < 2 seconds)

---

## STEP 4: DEPLOYMENT

### Pre-Deployment

- [ ] All testing complete and signed off
- [ ] Code reviewed
- [ ] No console errors
- [ ] No performance issues
- [ ] Documentation updated

### Deploy to Production

1. **Backup**
   - [ ] Take backup of current configuration

2. **Deploy Scripts**
   - [ ] Publish all 5 client scripts
   - [ ] Verify active status

3. **Deploy Policies**
   - [ ] Publish all 5 UI policies
   - [ ] Verify active status

4. **Clear Cache**
   - [ ] Clear browser cache
   - [ ] Clear ServiceNow cache

5. **Smoke Test**
   - [ ] Create new case
   - [ ] Test state transitions
   - [ ] Test priority warnings
   - [ ] Test account selection
   - [ ] Verify all scripts/policies working

### Post-Deployment

- [ ] Monitor for errors (first 24 hours)
- [ ] Collect user feedback
- [ ] Log any issues
- [ ] Performance acceptable
- [ ] No incidents

---

## Rollback Plan

If issues occur post-deployment:

1. **Disable Scripts**
   - [ ] Set all 5 client scripts to inactive
   - [ ] Verify forms work without scripts

2. **Disable Policies**
   - [ ] Set all 5 UI policies to inactive
   - [ ] Verify forms work without policies

3. **Monitor**
   - [ ] Check for resolution of issues
   - [ ] Collect detailed error logs

4. **Debug**
   - [ ] Review error logs
   - [ ] Identify root cause
   - [ ] Fix issue

5. **Re-deploy**
   - [ ] Reactivate fixed components
   - [ ] Test thoroughly
   - [ ] Redeploy to production

---

## Implementation Tracking

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Script 1 - onLoad | ⬜ Pending | | |
| Script 2 - State Change | ⬜ Pending | | |
| Script 3 - Priority Change | ⬜ Pending | | |
| Script 4 - Account Selected | ⬜ Pending | | |
| Script 5 - Resolution Notes | ⬜ Pending | | |
| UI Policy 1 - Resolution Fields | ⬜ Pending | | |
| UI Policy 2 - Mandatory Notes | ⬜ Pending | | |
| UI Policy 3 - Hide Closure Code | ⬜ Pending | | |
| UI Policy 4 - Account Info | ⬜ Pending | | |
| UI Policy 5 - Priority Validation | ⬜ Pending | | |
| Functional Testing | ⬜ Pending | | |
| Deployment | ⬜ Pending | | |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA Lead | | | |
| Business Owner | | | |
| IT Operations | | | |

---

**Version**: 1.0.0  
**Status**: ✅ Ready for Implementation  
**Created**: May 25, 2026
