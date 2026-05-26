# Customer Case - Business Rules Documentation

**Scope**: x_20261805_csm  
**Table**: Customer Case (x_20261805_csm_customer_case)  
**Total Rules**: 7  
**Created**: May 25, 2026

---

## Business Rules Overview

| # | Rule Name | Timing | Event | Order | Purpose |
|---|-----------|--------|-------|-------|---------|
| 1 | Auto-generate Case Number | Before | Insert | 100 | Generate unique CSE-XXXXXXX identifier |
| 2 | Set Default State | Before | Insert | 110 | Initialize state to "new" |
| 3 | Calculate Priority | Before | Insert/Update | 120 | Auto-calculate from impact/urgency |
| 4 | Auto-assign Case | Before | Insert/Update | 130 | Route to appropriate team/agent |
| 5 | Require Resolution Notes | Before | Update | 140 | Validate closure prerequisites |
| 6 | Set Resolved Date | Before | Update | 150 | Capture resolution timestamp |
| 7 | Prevent Closure | Before | Update | 160 | Comprehensive closure validation |

---

## RULE 1: Auto-generate Case Number

### Overview
Automatically generates a unique case identifier with CSE prefix before inserting new case records.

### Specifications

| Property | Value |
|----------|-------|
| **Name** | Auto-generate Case Number |
| **Table** | x_20261805_csm_customer_case |
| **Timing** | BEFORE |
| **Event** | insert |
| **Order** | 100 (first to run) |
| **Active** | Yes |
| **Async** | Yes |

### Trigger
- **Condition**: New record being inserted
- **Filter**: None (runs on all inserts)
- **Order**: 100 (highest priority)

### Logic

1. **Check if number exists**: Skip if number already provided
2. **Query sys_number table**: Look for case sequence
3. **Increment sequence**: Get next sequence value
4. **Format number**: `CSE-` + 7-digit padded number
5. **Assign to record**: Set current.number
6. **Create sequence if needed**: Initialize on first case

### Implementation Details

```javascript
// Sequence lookup
var sequenceGr = new GlideRecord('sys_number');
sequenceGr.addQuery('name', 'x_20261805_csm_customer_case_number');
sequenceGr.query();

// Increment and format
sequenceGr.increment_value = parseInt(sequenceGr.increment_value) + 1;
var paddedNumber = nextNumber.padStart(7, '0');
current.number = 'CSE-' + paddedNumber;
```

### Example Output
```
CSE-1000001 (first case)
CSE-1000002 (second case)
CSE-1000003 (third case)
...
CSE-9999999 (millionth case)
```

### Notes
- Runs BEFORE insert, so number is set before record created
- Ensures no duplicate case numbers
- Sequence table created automatically on first case
- Format: CSE + 7 digits (can support ~9 million cases)

---

## RULE 2: Set Default State to New

### Overview
Initializes the state field to "new" for all newly created cases when not explicitly provided.

### Specifications

| Property | Value |
|----------|-------|
| **Name** | Set Default State to New |
| **Table** | x_20261805_csm_customer_case |
| **Timing** | BEFORE |
| **Event** | insert |
| **Order** | 110 |
| **Active** | Yes |
| **Filter** | state IS EMPTY |
| **Async** | Yes |

### Trigger
- **Condition**: New record and state is empty
- **Filter**: `state IS EMPTY`
- **Order**: 110 (runs after case number generation)

### Logic

1. **Check if state is empty**: Validate state field
2. **Set state to "new"**: Initialize default state
3. **Initialize opened_at**: Set timestamp when opened
4. **Log initialization**: Record action in logs

### Implementation Details

```javascript
// Check and set default state
if (!current.state || current.state === '') {
  current.state = 'new';
}

// Initialize timestamp
if (!current.opened_at) {
  current.opened_at = new GlideDateTime().getDisplayValue();
}
```

### State Transitions
```
┌─────────────────────────────────────────────┐
│ START: new (Default Initial State)          │
└─────────────────────────────────────────────┘
        ↓
    Can transition to:
    ├─ open (acknowledged)
    ├─ in_progress (being worked)
    └─ cancelled (abandoned)
```

### Notes
- Ensures consistent workflow initiation
- All cases start in "new" state
- Timestamp captured for SLA tracking
- State transitions controlled by other rules

---

## RULE 3: Calculate Priority from Impact and Urgency

### Overview
Automatically calculates priority based on impact and urgency values when either field changes.

### Specifications

| Property | Value |
|----------|-------|
| **Name** | Calculate Priority from Impact and Urgency |
| **Table** | x_20261805_csm_customer_case |
| **Timing** | BEFORE |
| **Event** | insert, update |
| **Order** | 120 |
| **Filter** | impact CHANGED OR urgency CHANGED |
| **Active** | Yes |
| **Advanced** | Yes |

### Trigger
- **Condition**: Impact or urgency values have changed
- **Filter**: `(impact CHANGED OR urgency CHANGED)`
- **Runs**: On insert and update

### Priority Matrix

| Impact | Urgency 1 | Urgency 2 | Urgency 3 | Urgency 4 | Urgency 5 |
|--------|-----------|-----------|-----------|-----------|-----------|
| **1** | Priority 1 | Priority 1 | Priority 1 | Priority 2 | Priority 3 |
| **2** | Priority 1 | Priority 2 | Priority 2 | Priority 3 | Priority 3 |
| **3** | Priority 1 | Priority 2 | Priority 3 | Priority 3 | Priority 4 |
| **4** | Priority 2 | Priority 3 | Priority 3 | Priority 4 | Priority 4 |
| **5** | Priority 3 | Priority 3 | Priority 4 | Priority 4 | Priority 5 |

### Calculation Formula
```
Priority = Average(Impact, Urgency)
Clamped to range: 1-5

Example:
- Impact: 1, Urgency: 1 → Avg = 1 → Priority = 1 (Critical)
- Impact: 2, Urgency: 3 → Avg = 2.5 → Priority = 2 (High)
- Impact: 3, Urgency: 3 → Avg = 3 → Priority = 3 (Medium)
- Impact: 4, Urgency: 4 → Avg = 4 → Priority = 4 (Low)
- Impact: 5, Urgency: 5 → Avg = 5 → Priority = 5 (Minimal)
```

### Implementation Details

```javascript
// Get values
var impact = current.impact ? parseInt(current.impact) : 3;
var urgency = current.urgency ? parseInt(current.urgency) : 3;

// Calculate average
var calculatedPriority = Math.round((impact + urgency) / 2);

// Clamp to 1-5
calculatedPriority = Math.max(1, Math.min(5, calculatedPriority));

// Set priority
current.priority = calculatedPriority.toString();
```

### Affects Other Rules
- **Rule 4**: Priority affects team assignment (Priority 1-2 → Senior Support)
- **Rule 5**: Priority affects SLA determination

### Notes
- Runs on both insert and update
- Automatic recalculation if impact/urgency changes
- Provides consistent priority assignment
- Can be overridden manually if needed

---

## RULE 4: Auto-assign Case Based on Category

### Overview
Automatically routes cases to the appropriate support group and assigns to the least-busy agent based on category and priority.

### Specifications

| Property | Value |
|----------|-------|
| **Name** | Auto-assign Case Based on Category |
| **Table** | x_20261805_csm_customer_case |
| **Timing** | BEFORE |
| **Event** | insert, update |
| **Order** | 130 |
| **Filter** | category IS NOT EMPTY AND assigned_to IS EMPTY AND state = "new" |
| **Active** | Yes |
| **Advanced** | Yes |

### Trigger
- **Condition**: Category set, case unassigned, state is new
- **Filter**: `category IS NOT EMPTY AND assigned_to IS EMPTY AND state = "new"`
- **Runs**: Only on new cases, only once

### Routing Logic

```
START
  ↓
Get Category Details
  ├─ Get assignment_group from category
  ├─ Get SLA policy from category
  └─ Check if category exists
  ↓
Priority Check (Priority ≤ 2?)
  ├─ YES: Look for Senior Support team
  │        (e.g., "Technical Support - Senior Support")
  └─ NO: Use regular team
  ↓
Find Available Agents
  ├─ Query group members
  ├─ Filter for active users only
  └─ Build agent list
  ↓
Count Open Cases Per Agent
  ├─ Query for open cases (state: new, open, in_progress)
  ├─ Count per agent
  └─ Find minimum
  ↓
Assign to Least Busy Agent
  ├─ Select agent with fewest open cases
  ├─ Set assigned_to = agent
  ├─ Set assignment_group = group
  └─ Set assigned_to_date = now
  ↓
END
```

### Implementation Details

```javascript
// Get category
var categoryGr = new GlideRecord('x_20261805_csm_case_category');
categoryGr.get(categoryId);
var assignmentGroupId = categoryGr.assignment_group.toString();

// Priority-based routing
if (priority <= 2) {
  // Route to senior team for critical/high priority
  var seniorGroup = findSeniorTeam(categoryGr.name);
  assignmentGroupId = seniorGroup ? seniorGroup : assignmentGroupId;
}

// Find least busy agent
var leastBusyAgent = findLeastBusyAgent(assignmentGroupId);
current.assigned_to = leastBusyAgent;
current.assignment_group = assignmentGroupId;
current.assigned_to_date = new GlideDateTime();
```

### Load Balancing Example

```
Technical Support Team:
├─ Agent A: 8 open cases
├─ Agent B: 5 open cases  ← Least busy
├─ Agent C: 6 open cases
└─ New Case: Assigned to Agent B
```

### Team Assignment Examples

| Category | Default Group | Senior Group | Min Priority |
|----------|---------------|--------------|--------------|
| Technical Support | tech_support | tech_support_senior | 1-2 |
| Billing Support | billing_support | billing_support_lead | 1 |
| Account Mgmt | account_support | account_support_mgmt | 1-2 |
| General Inquiry | general_support | (none) | N/A |

### Notes
- Implements intelligent load balancing
- Prevents uneven workload distribution
- Only runs on new cases (state = "new")
- Can be manually overridden after assignment
- Respects priority for senior team routing

---

## RULE 5: Require Resolution Notes Before Closure

### Overview
Validates that resolution notes and closure code are provided before allowing case closure.

### Specifications

| Property | Value |
|----------|-------|
| **Name** | Require Resolution Notes Before Closure |
| **Table** | x_20261805_csm_customer_case |
| **Timing** | BEFORE |
| **Event** | update |
| **Order** | 140 |
| **Filter** | state CHANGED AND state = "closed" |
| **Active** | Yes |
| **Sync** | Yes (must block immediately) |

### Trigger
- **Condition**: State changing to "closed"
- **Filter**: `state CHANGED AND state = "closed"`
- **Timing**: BEFORE (must validate before update)

### Validation Checks

1. **Resolution Notes**
   - Status: Required
   - Must not be empty
   - Visible in error if missing

2. **Closure Code**
   - Status: Required
   - Must be selected from list
   - Visible in error if missing

3. **Resolution Code**
   - Status: Required
   - Must be selected from list
   - Visible in error if missing

4. **Customer Satisfaction**
   - Status: Required
   - Must be rated 1-5
   - Visible in error if missing

### Blocked Actions Example

```
User attempts to close case:
  state: open → closed

Missing fields detected:
  • Resolution Notes (empty)
  • Closure Code (not set)

Action blocked ❌
Message shown: "Cannot close case. Missing required fields:
               Resolution Notes, Closure Code.
               Please provide all required information before closing."

State reverted: open ← back to previous

Update prevented: Record NOT updated
```

### Implementation Details

```javascript
// Check if state changed to closed
if (previous.state !== 'closed' && current.state === 'closed') {
  var missingFields = [];
  
  // Validate each field
  if (!current.resolution_notes || current.resolution_notes.trim() === '') {
    missingFields.push('Resolution Notes');
  }
  if (!current.closure_code) {
    missingFields.push('Closure Code');
  }
  
  // Block if missing
  if (missingFields.length > 0) {
    gs.addErrorMessage('Cannot close case. Missing: ' + missingFields.join(', '));
    current.state = previous.state;  // Revert
    return false;
  }
}
```

### Notes
- Prevents incomplete case closures
- All blocked cases retain previous state
- User gets clear error message
- Runs synchronously to block immediately

---

## RULE 6: Set Resolved Date on State Change

### Overview
Automatically captures the timestamp when a case transitions to the "resolved" state.

### Specifications

| Property | Value |
|----------|-------|
| **Name** | Set Resolved Date on State Change |
| **Table** | x_20261805_csm_customer_case |
| **Timing** | BEFORE |
| **Event** | update |
| **Order** | 150 |
| **Filter** | state CHANGED AND state = "resolved" |
| **Active** | Yes |
| **Async** | Yes |

### Trigger
- **Condition**: State changing to "resolved"
- **Filter**: `state CHANGED AND state = "resolved"`

### Actions Performed

1. **Capture Timestamp**
   - Current date/time recorded as `resolved_at`
   - Only set if not already set

2. **Calculate Resolution Time**
   - Resolution time = resolved_at - opened_at
   - Expressed in hours (with 2 decimals)

3. **Log Event**
   - Records resolution event in case log
   - Includes timestamp and user

### Resolution Time Calculation

```javascript
var openedTime = new GlideDateTime(current.opened_at);
var resolvedTime = new GlideDateTime();
var diffMs = resolvedTime.getNumericValue() - openedTime.getNumericValue();
var diffHours = diffMs / (1000 * 60 * 60);

// Example: 2.5 hours, 8.75 hours, 24.33 hours
```

### Example Timeline

```
Opened:    2026-05-25 10:00 AM
Working:   2026-05-25 10:00 AM - 02:45 PM (4 hours 45 minutes)
Resolved:  2026-05-25 02:45 PM
           → resolved_at = 2026-05-25 14:45
           → Resolution time = 4.75 hours
```

### Metrics Enabled

- **MTTR** (Mean Time To Resolution): Average case resolution time
- **SLA Reporting**: Track resolution time vs SLA target
- **Performance Dashboards**: Resolution time metrics
- **Audit Trail**: Complete timestamp history

### Notes
- Critical for performance tracking
- Only records when transitioning to resolved
- Enables SLA compliance reporting
- Creates audit trail for compliance

---

## RULE 7: Prevent Closure - Mandatory Fields Validation

### Overview
Comprehensive validation ensuring all required fields are completed before allowing case closure.

### Specifications

| Property | Value |
|----------|-------|
| **Name** | Prevent Closure - Mandatory Fields Validation |
| **Table** | x_20261805_csm_customer_case |
| **Timing** | BEFORE |
| **Event** | update |
| **Order** | 160 (last to run) |
| **Filter** | state CHANGED AND state = "closed" |
| **Active** | Yes |
| **Advanced** | Yes |
| **Sync** | Yes |

### Trigger
- **Condition**: State changing to "closed"
- **Filter**: `state CHANGED AND state = "closed"`
- **Timing**: BEFORE (must block immediately)

### Comprehensive Validation Checklist

#### Basic Mandatory Fields (7 checks)
- [ ] **short_description**: Not empty, required
- [ ] **customer_account**: Selected, required
- [ ] **customer_contact**: Selected, required
- [ ] **customer_email**: Valid format, required
- [ ] **priority**: Value 1-5, required
- [ ] **category**: Selected, required
- [ ] **state**: Not empty, required

#### Closure-Specific Fields (4 checks)
- [ ] **resolution_code**: Selected from list, required
- [ ] **resolution_notes**: Minimum 10 characters, required
- [ ] **closure_code**: Selected from list, required
- [ ] **customer_satisfaction**: Rating 1-5, required

#### State-Based Validation (1 check)
- [ ] **resolved_at**: Must be set (case must be in Resolved state first)

### Validation Logic Flow

```
User attempts to close case (state → "closed")
  ↓
Is this actually changing to closed?
  NO → Skip validation
  YES ↓
  ├─ Check basic mandatory fields
  ├─ Check closure-specific fields
  └─ Check state prerequisites
  ↓
Any errors found?
  NO → Proceed with closure ✓
  YES ↓
    ├─ Collect all error messages
    ├─ Display to user
    ├─ Revert state to previous
    ├─ Log failure for audit
    └─ Block update ✗
```

### Error Message Display

```
Cannot close case due to missing or invalid fields:
• Short Description is required
• Resolution Code is required for closure
• Resolution Notes are required for closure (minimum 10 characters)
• Closure Code is required for closure
• Customer Satisfaction rating is required for closure
• Case must be in "Resolved" state before closing
```

### Implementation Details

```javascript
// Collect validation errors
var validationErrors = [];

// Basic field checks
if (!current.short_description || current.short_description.trim() === '') {
  validationErrors.push('• Short Description is required');
}

// Closure checks
if (!current.resolution_notes || current.resolution_notes.trim().length < 10) {
  validationErrors.push('• Resolution Notes minimum 10 characters required');
}

// Block if errors
if (validationErrors.length > 0) {
  gs.addErrorMessage('Cannot close case due to...\n' + validationErrors.join('\n'));
  current.state = previous.state;  // Revert
  logValidationFailure(current, validationErrors);
  return false;
}
```

### Validation Pass/Fail Examples

#### Example 1: FAIL - Incomplete Resolution
```
Attempt: state new → closed
Missing:
  • resolution_code not set
  • resolution_notes empty
  • closure_code not set

Result: ❌ BLOCKED
State: Reverts to previous
Message: Lists all 3 missing fields
```

#### Example 2: PASS - Complete Resolution
```
Before closure check:
  • short_description: "Unable to login" ✓
  • customer_account: Acme Corp ✓
  • customer_email: john@acme.com ✓
  • priority: 2 ✓
  • category: Technical ✓
  • resolution_code: "resolved" ✓
  • resolution_notes: "Reissued credentials and confirmed access" ✓
  • closure_code: "issue_resolved" ✓
  • customer_satisfaction: 4 ✓

Result: ✅ ALLOWED
Case closes successfully
```

### Notes
- Prevents incomplete case records
- Ensures documentation completeness
- Enables compliance and auditing
- Provides clear user feedback
- All checks must pass for closure

---

## Business Rule Execution Order

### On INSERT Event

```
Order 100: Auto-generate Case Number
  → Generates CSE-XXXXXXX
  ↓
Order 110: Set Default State
  → Sets state = "new"
  → Sets opened_at = now
  ↓
Order 120: Calculate Priority
  → Calculates from impact/urgency
  ↓
Order 130: Auto-assign Case
  → Routes to group
  → Assigns to agent
  → Sets assignment_group & assigned_to
  ↓
Record inserted to database
```

### On UPDATE Event (state → closed)

```
Order 120: Calculate Priority (if changed)
  → Recalculates if needed
  ↓
Order 140: Require Resolution Notes
  → Validates closure prerequisites
  ↓
Order 150: Set Resolved Date
  → Sets resolved_at if changing to resolved
  ↓
Order 160: Prevent Closure
  → Comprehensive validation
  → Blocks if missing fields
  ↓
If all pass: Record updated
If any fail: Update blocked, state reverted
```

---

## Field Dependencies

```
┌──────────────────────────────────────────────────┐
│ Business Rule Dependencies                       │
└──────────────────────────────────────────────────┘

Impact Field
  ↓ triggers
Rule 3 (Calculate Priority)
  ↓ affects
Rule 4 (Auto-assign)
  ↓ sets
assigned_to → affects workload

Category Field
  ↓ triggers
Rule 4 (Auto-assign)
  ↓ reads
assignment_group
  ↓ effects
Team routing

State Field
  ↓ triggers
Rule 6 (Set Resolved Date)
  ↓ triggers
Rule 7 (Prevent Closure)
  ↓ validates
All mandatory fields
```

---

## Testing Scenarios

### Test 1: Case Creation (All Rules)
```
Create new case:
✓ Case number auto-generates (CSE-1000001)
✓ State defaults to "new"
✓ Priority calculated from impact/urgency
✓ Auto-assigned to least busy agent
✓ Record inserted successfully
```

### Test 2: Priority Recalculation
```
Update Impact to 1, Urgency to 1:
✓ Rule 3 triggers
✓ Priority recalculated to 1
✓ May trigger reassignment to senior team
✓ Rule 4 reassigns if needed
✓ Update completes
```

### Test 3: Incomplete Closure (Expected FAIL)
```
Attempt closure without required fields:
✓ Rule 7 catches validation errors
✓ Error message lists missing fields
✓ State reverts to previous
✓ Case not closed
✓ No update applied
```

### Test 4: Complete Closure (Expected PASS)
```
Complete all required fields, then close:
✓ All validations pass (Rule 5, 7)
✓ resolved_at timestamp set (Rule 6)
✓ Case state changes to closed
✓ Audit logged
✓ Record successfully updated
```

### Test 5: Load Balancing
```
Create multiple cases for same category:
✓ Each case assigned to different agent
✓ Cases distributed by workload
✓ Least busy agent gets next case
✓ Round-robin load balancing
```

---

## Implementation Steps

1. **Create Business Rules in ServiceNow**
   - Navigate to Business Rules
   - Create each rule in order
   - Copy script from rule definitions
   - Set active = true

2. **Configure Sequences**
   - Create sys_number sequence for case numbering
   - Test auto-increment

3. **Test Each Rule**
   - Follow testing scenarios
   - Verify expected behavior
   - Check error messages

4. **Monitor Execution**
   - Check System Logs
   - Monitor performance
   - Verify no conflicts

5. **Enable Audit Logging**
   - Enable record audit
   - Track all changes
   - Monitor rule execution logs

---

## Performance Considerations

- **Order**: Rules execute in numbered order (100-160)
- **Timing**: Use "before" for validation, prevents unnecessary updates
- **Async**: Use async for non-blocking operations
- **Filters**: Always use specific filters to reduce execution
- **Queries**: Minimize database queries in rules
- **Load Balancing**: Query optimization for agent lookup

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Case number not generating | Sequence not created | Create sys_number entry manually |
| Auto-assign not working | Category has no group | Configure assignment_group on category |
| Priority not calculating | Impact/Urgency empty | Default to 3 if not provided |
| Closure blocked unexpectedly | Missing field not obvious | Check all 11 validation checks |
| Performance slow on update | Too many queries | Optimize agent lookup, use indexes |

---

**Reference Files:**
- TypeScript Implementation: [customer_case_business_rules.ts](src/servicenow/businessRules/customer_case_business_rules.ts)
- Field Definitions: [customer_case_fields.ts](src/servicenow/tables/customer_case_fields.ts)
- Table Specifications: [TABLE_DEFINITIONS_GUIDE.md](TABLE_DEFINITIONS_GUIDE.md)

---

**Version**: 1.0.0  
**Status**: ✅ Ready for Implementation  
**Created**: May 25, 2026
