# Customer Case - Client Scripts & UI Policies Quick Reference

**Scope**: x_20261805_csm  
**Table**: Customer Case (x_20261805_csm_customer_case)  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

---

## Quick Script Directory

| Script | Type | Field | Purpose |
|--------|------|-------|---------|
| **1. Form Load** | onLoad | - | Initialize form with proper state |
| **2. State Change** | onChange | state | Dynamic field visibility by state |
| **3. Priority Change** | onChange | priority | Show priority warnings & SLA |
| **4. Account Selected** | onChange | customer_account | Display account info & filter contacts |
| **5. Resolution Notes** | onChange | resolution_notes | Validate notes content & length |

---

## Quick Policy Directory

| Policy | Purpose | Condition |
|--------|---------|-----------|
| **1. Resolution Fields** | Show/hide fields by state | state varies |
| **2. Mandatory Notes** | Make notes required | state = resolved/closed |
| **3. Hide Closure Code** | Progressive reveal | state != closed |
| **4. Account Info** | Highlight customer account | account selected |
| **5. Priority Validation** | Color-code by priority | priority level |

---

## Script 1: Form Load - At a Glance

```
WHEN: Form loads (insert or edit)

DOES:
  ✓ Checks current state
  ✓ Checks current priority
  ✓ Shows/hides fields based on state
  ✓ Displays priority warning if 1 or 2
  ✓ Shows account details if set
  ✓ Sets resolution notes mandatory if needed

RESULT: Form ready with correct initial state
```

---

## Script 2: State Change - At a Glance

```
WHEN: State field changes

DOES:
  ✓ Updates field visibility by state
  ✓ Displays state-specific message
  ✓ Sets mandatory fields
  ✓ Validates state transition
  ✓ Blocks invalid transitions

RESULT: Form layout matches workflow state
```

**State Flow**:
```
new → open → in_progress → resolved → closed
       ↑_________________↑__________|
              (can reopen)
```

---

## Script 3: Priority Change - At a Glance

```
WHEN: Priority field changes

DOES:
  ✓ Clears previous message
  ✓ Displays priority-specific message
  ✓ Shows SLA for priority level
  ✓ Color codes message (warning/info)

RESULT: User sees priority warning & SLA
```

**Priority Matrix**:
```
Priority 1: 🚨 CRITICAL      → Response: 15 min  | Resolution: 2 hours
Priority 2: ⚠️ HIGH          → Response: 30 min  | Resolution: 4 hours
Priority 3: ℹ️ MEDIUM        → Response: 2 hrs   | Resolution: 24 hours
Priority 4: LOW              → Response: 4 hrs   | Resolution: 48 hours
Priority 5: MINIMAL          → Response: 24 hrs  | Resolution: 5 days
```

---

## Script 4: Account Selected - At a Glance

```
WHEN: Customer account field changes

DOES:
  ✓ Queries account details from database
  ✓ Displays account name, type, tier, phone
  ✓ Filters contact dropdown to this account
  ✓ Lists available contacts with email
  ✓ Marks primary contact

RESULT: Account context visible, contacts filtered
```

**Example Output**:
```
Account: Acme Corporation
Type: Enterprise
Support Tier: Premium
Phone: 555-0100

Available Contacts:
  John Smith (Primary) - john@acme.com
  Jane Doe - jane@acme.com
  Bob Johnson - bob@acme.com
```

---

## Script 5: Resolution Notes - At a Glance

```
WHEN: Resolution notes field changes (if state = resolved/closed)

DOES:
  ✓ Checks if notes required (by state)
  ✓ Validates not empty
  ✓ Validates minimum 10 characters
  ✓ Displays character count
  ✓ Shows validation message

RESULT: Ensures meaningful documentation
```

**Validation Levels**:
```
State = resolved/closed:
  Empty               → ERROR: "Resolution notes are required"
  < 10 chars          → WARNING: "must be at least 10 characters"
  >= 10 chars         → OK: "✓ Resolution notes provided (45 characters)"

Other states:
  Any content         → No validation, optional
```

---

## Policy 1: Resolution Fields - At a Glance

```
Controls visibility of resolution/closure fields by state:

state = new/open
  └─ Hide: resolution_code, resolution_notes, closure_code, satisfaction
    
state = in_progress/waiting_on_customer
  ├─ Show: resolution_code, resolution_notes (optional)
  └─ Hide: closure_code, satisfaction

state = resolved
  ├─ Show: resolution_code, resolution_notes (MANDATORY)
  └─ Hide: closure_code, satisfaction

state = closed
  ├─ Show: ALL fields (MANDATORY)
  └─ Fields: resolution_code, resolution_notes, closure_code, satisfaction
```

---

## Policy 2: Mandatory Notes - At a Glance

```
WHEN: state = "resolved" OR state = "closed"

ACTION: Make mandatory
  ├─ resolution_code (red asterisk)
  ├─ resolution_notes (red asterisk)
  └─ Cannot save without values

PREVENTS: Incomplete documentation
```

---

## Policy 3: Hide Closure Code - At a Glance

```
WHEN: state != "closed"

ACTION: Hide & disable
  └─ closure_code: not visible, not editable

WHEN: state = "closed"

ACTION: Show & enable
  └─ closure_code: visible, MANDATORY, editable

BENEFIT: Progressive field reveal, less clutter
```

---

## Policy 4: Account Info - At a Glance

```
WHEN: customer_account is selected

ACTION: Highlight & require contact
  ├─ customer_account: add background color
  ├─ customer_account: show tooltip
  └─ customer_contact: set MANDATORY

BENEFIT: Emphasizes customer relationship
```

---

## Policy 5: Priority Validation - At a Glance

```
VISUAL INDICATORS:

priority = "1": 🎯 RED background (#ff6666)
priority = "2": 🎯 ORANGE background (#ffcc66)
priority = "3": ○ Default colors
priority = "4": ○ Default colors
priority = "5": ○ Default colors

BENEFIT: Quickly spot high-priority cases
```

---

## Execution Order

### Form Load
```
User opens form
  ↓
Script 1 (onLoad) runs
  ├─ Reads current state
  ├─ Reads current priority
  ├─ Reads current account
  ├─ Updates field visibility
  ├─ Shows warnings/info
  └─ Form ready
```

### User Changes State
```
User changes state field
  ↓
Script 2 (onChange - state) runs
  ├─ Validates transition
  ├─ Updates visibility
  ├─ Sets mandatory
  ├─ Shows message
  └─ Form updated
  ↓
UI Policy 1 runs (resolution fields)
UI Policy 2 runs (mandatory notes)
UI Policy 3 runs (hide closure code)
  ↓
Form reflects new state
```

### User Changes Priority
```
User changes priority field
  ↓
Script 3 (onChange - priority) runs
  ├─ Clears previous message
  ├─ Shows priority warning
  ├─ Shows SLA info
  └─ Form updated
  ↓
UI Policy 5 runs (color coding)
  ↓
Form shows colored priority field
```

### User Selects Account
```
User selects customer_account
  ↓
Script 4 (onChange - account) runs
  ├─ Queries account details
  ├─ Shows account info
  ├─ Filters contacts
  ├─ Shows contact list
  └─ Form updated
  ↓
UI Policy 4 runs (highlight account)
  ├─ Adds background color
  ├─ Sets contact mandatory
  └─ Form updated
```

### User Enters Notes
```
User types in resolution_notes field (state = resolved)
  ↓
Script 5 (onChange - notes) runs
  ├─ Validates length
  ├─ Shows validation message
  ├─ Displays character count
  └─ Form updated
```

---

## Common Scenarios

### Scenario 1: New Case from Critical Priority Account

```
1. Click: New Case
   → Script 1 onLoad runs
   → Form ready

2. Enter: short_description = "System down - Enterprise customer"
3. Select: priority = "1"
   → Script 3 onChange runs
   → Shows: "🚨 CRITICAL - Response: 15 min, Resolution: 2 hrs"
   → UI Policy 5 runs
   → Priority field shows RED background

4. Select: customer_account = "Fortune 500 Corp"
   → Script 4 onChange runs
   → Shows: Account details, Support Tier: Enterprise
   → Shows: Available contacts list (3 primary, 2 secondary)
   → UI Policy 4 runs
   → Account highlighted, Contact marked mandatory

5. Select: customer_contact = "Executive Support Team"

6. Fill: short_description, impact, urgency

7. Click: Save
   → Business Rule 1: Generates CSE-XXXXXXX
   → Business Rule 2: Sets state = "new"
   → Business Rule 3: Calculates priority = 1
   → Business Rule 4: Auto-assigns to Senior Support
   → Case saved

RESULT: High-priority case routed to senior team with full context
```

### Scenario 2: Resolve Case with Documentation

```
1. Open: Case in "in_progress" state
   → Script 1 onLoad runs
   → resolution_code visible (optional)
   → resolution_notes visible (optional)
   → closure_code HIDDEN

2. Fill: resolution_code = "User Error - Reconfigured"

3. Fill: resolution_notes = "Customer was using outdated browser version. Recommended update to current version. Issue resolved after update."
   → Script 5 onChange runs
   → Shows: "✓ Resolution notes provided (145 characters)"

4. Change: state = "in_progress" → "resolved"
   → Script 2 onChange runs
   → Updates: resolution fields now MANDATORY (red asterisks)
   → Shows message: "Case is resolved. Fill in details before closing."
   → UI Policy 1 & 2 run
   → Closure fields still HIDDEN

5. Click: Save
   → Business Rule 6: Sets resolved_at timestamp
   → Case moves to resolved

RESULT: Case documented and ready for closure
```

### Scenario 3: Close Case with Customer Satisfaction

```
1. Open: Case in "resolved" state
   → closure_code still hidden

2. Try to change: state = "resolved" → "closed"
   → Script 2 onChange validates transition ✓ Valid
   → closure_code becomes visible and MANDATORY
   → customer_satisfaction becomes visible and MANDATORY
   → Shows message: "Case is closed. Archive after confirmation."

3. But first, must fill closure fields:
   Select: closure_code = "Resolved"
   Select: customer_satisfaction = "5"

4. Enter: resolution_notes if not already filled
   → Script 5 onChange validates (< 10 chars = warning)

5. Click: Save
   → Business Rule 7: Validates all 11 mandatory fields ✓
   → Case closes

RESULT: Case documented, customer rated, closure complete
```

### Scenario 4: Reopen Closed Case

```
1. Open: Case in "closed" state

2. Try to change: state = "closed" → "open"
   → Script 2 onChange validates transition ✓ Valid
   → Updates: Hide closure fields
   → Updates: Show assignment fields
   → Shows message: "Case is open. Please review and assign if needed."

3. Change reason in: short_description = "Customer reports issue not resolved"

4. Click: Save
   → Case reopened
   → Returns to "open" state for further work

RESULT: Reopened case back in workflow
```

---

## Field-by-Field Behavior

```
state
  ├─ Script 1: Reads on load
  ├─ Script 2: Reacts to change
  ├─ UI Policy 1,2,3: Controls other fields
  └─ Business Rule: Enforces transitions

priority
  ├─ Script 1: Displays warning on load
  ├─ Script 3: Displays warning on change
  └─ UI Policy 5: Color codes

customer_account
  ├─ Script 1: Shows info on load
  ├─ Script 4: Shows info & filters on change
  └─ UI Policy 4: Highlights when set

customer_contact
  ├─ Script 4: Filtered by account
  └─ UI Policy 4: Mandatory when account set

resolution_code
  ├─ UI Policy 1: Shows/hides by state
  └─ UI Policy 2: Mandatory when resolved/closed

resolution_notes
  ├─ Script 1: Sets mandatory if needed
  ├─ Script 2: Sets mandatory if needed
  ├─ Script 5: Validates on change
  ├─ UI Policy 1: Shows/hides by state
  └─ UI Policy 2: Mandatory when resolved/closed

closure_code
  ├─ UI Policy 1: Shows when closed
  └─ UI Policy 3: Hidden until closed

customer_satisfaction
  └─ UI Policy 1: Shows/mandatory when closed
```

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| Warning not showing | Priority = 1 or 2? State = resolved/closed? |
| Fields not hiding | State changed? Policy active? |
| Account info missing | Account selected? Account exists in DB? |
| Contacts not filtering | Account set? Contacts exist for account? |
| Validation not working | State correct? Script active? |
| State change blocked | Valid transition? All mandatory fields filled? |

---

## Testing Checklist (Quick)

- [ ] Script 1: Form loads with correct initial state
- [ ] Script 2: State changes update field visibility
- [ ] Script 3: Priority warning displays correctly
- [ ] Script 4: Account info displays & filters contacts
- [ ] Script 5: Resolution notes validate length
- [ ] Policy 1: Fields visible/hidden by state
- [ ] Policy 2: Notes mandatory when resolved
- [ ] Policy 3: Closure code hidden until closed
- [ ] Policy 4: Account highlighted when selected
- [ ] Policy 5: Priority colors display

---

**Production Ready**: ✅ Yes  
**Last Updated**: May 25, 2026  
**Support**: See CLIENT_SCRIPTS_GUIDE.md for full documentation
