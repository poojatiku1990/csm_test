# Customer Case Business Rules - Quick Reference

**Scope**: x_20261805_csm  
**Table**: Customer Case (x_20261805_csm_customer_case)  
**Total Rules**: 7  
**Status**: ✅ Complete & Ready to Implement

---

## Rule Directory

| # | Rule Name | Trigger | When | Order | Purpose |
|----|-----------|---------|------|-------|---------|
| **1** | **Auto-generate Case Number** | BEFORE | INSERT | 100 | Generates CSE-XXXXXXX |
| **2** | **Set Default State** | BEFORE | INSERT | 110 | Sets state = "new" |
| **3** | **Calculate Priority** | BEFORE | INSERT/UPDATE | 120 | Calculates from impact/urgency |
| **4** | **Auto-assign Case** | BEFORE | INSERT/UPDATE | 130 | Routes to team and agent |
| **5** | **Require Resolution Notes** | BEFORE | UPDATE | 140 | Validates closure prerequisites |
| **6** | **Set Resolved Date** | BEFORE | UPDATE | 150 | Captures resolution timestamp |
| **7** | **Prevent Closure** | BEFORE | UPDATE | 160 | Comprehensive field validation |

---

## Rule 1 at a Glance

**Auto-generate Case Number**

```
WHEN: New case inserted
ACTION:
  1. Query sys_number sequence
  2. Increment sequence value
  3. Format: CSE-{7-digit-padded}
  4. Assign to current.number
  5. Create sequence if needed

RESULT: Every case gets unique CSE-1000001, CSE-1000002...
EXAMPLE: CSE-1000042
```

---

## Rule 2 at a Glance

**Set Default State**

```
WHEN: New case inserted and state is empty
ACTION:
  1. Set state = "new"
  2. Set opened_at = now()
  3. Initialize timestamps

RESULT: All cases start in "new" state
```

---

## Rule 3 at a Glance

**Calculate Priority from Impact & Urgency**

```
WHEN: Impact or Urgency field changes
ACTION:
  1. Get Impact value
  2. Get Urgency value
  3. Calculate: Priority = Average(Impact, Urgency)
  4. Clamp to 1-5 range
  5. Set current.priority

RESULT: Priority auto-calculated based on matrix
EXAMPLE: Impact=1, Urgency=1 → Priority=1 (Critical)
         Impact=3, Urgency=3 → Priority=3 (Medium)
         Impact=5, Urgency=5 → Priority=5 (Minimal)
```

---

## Rule 4 at a Glance

**Auto-assign Case**

```
WHEN: New case with category set, not yet assigned
ACTION:
  1. Get category's assignment_group
  2. Check priority (1-2? → Senior Support)
  3. Find all active agents in group
  4. Count open cases per agent
  5. Assign to agent with FEWEST open cases
  6. Set assignment_group & assigned_to
  7. Set assigned_to_date = now()

RESULT: Intelligent load-balanced assignment
EXAMPLE:
  Agent A: 8 open cases
  Agent B: 5 open cases ← Gets new case
  Agent C: 6 open cases
```

---

## Rule 5 at a Glance

**Require Resolution Notes**

```
WHEN: Trying to change state to "closed"
VALIDATION:
  ✓ resolution_notes not empty?
  ✓ closure_code selected?
  ✓ resolution_code selected?
  ✓ customer_satisfaction rated?

IF MISSING:
  ✗ Block update
  ✗ Show error message
  ✗ Revert state
  ✗ List missing fields

IF OK:
  ✓ Continue
```

---

## Rule 6 at a Glance

**Set Resolved Date**

```
WHEN: State changes to "resolved"
ACTION:
  1. Capture current timestamp
  2. Set resolved_at = now()
  3. Calculate resolution time (opened_at to now)
  4. Log event with timestamp
  5. Enable MTTR tracking

RESULT: Resolution timestamp recorded for metrics
METRICS: Resolution time = resolved_at - opened_at
```

---

## Rule 7 at a Glance

**Prevent Closure - Mandatory Fields**

```
WHEN: Trying to change state to "closed"
COMPREHENSIVE VALIDATION (11 checks):

BASIC FIELDS:
  □ short_description not empty
  □ customer_account selected
  □ customer_contact selected
  □ customer_email valid format
  □ priority 1-5
  □ category selected
  □ state not empty

CLOSURE FIELDS:
  □ resolution_code selected
  □ resolution_notes >10 characters
  □ closure_code selected
  □ customer_satisfaction 1-5

IF ANY MISSING:
  ✗ Show comprehensive error list
  ✗ Block update
  ✗ Revert state
  ✗ Log failure

IF ALL OK:
  ✓ Allow closure
```

---

## Execution Order Examples

### On New Case Creation
```
Rule 1 → number = CSE-1000042
  ↓
Rule 2 → state = new
  ↓
Rule 3 → priority calculated
  ↓
Rule 4 → auto-assigned to agent
  ↓
Case Inserted ✓
```

### On State Change to Resolved
```
Rule 3 → priority recalculated (if changed)
  ↓
Rule 6 → resolved_at = now()
  ↓
Update Applied ✓
```

### On State Change to Closed
```
Rule 5 → Check: notes + code + rating
  ↓
Rule 7 → Check: ALL 11 mandatory fields
  ↓
IF ANY FAIL → Block ✗
IF ALL OK → Close ✓
```

---

## Field Impact by Rule

```
number
├─ Rule 1: SET (auto-generated)
└─ Display: Read-only

state
├─ Rule 2: SET to "new" (insert)
├─ Rule 5: VALIDATE (before close)
├─ Rule 6: TRIGGER (on resolve)
└─ Rule 7: VALIDATE (before close)

priority
├─ Rule 3: SET (calculated)
└─ Rule 4: AFFECTS (routing logic)

assignment_group
├─ Rule 4: SET (from category)
└─ Display: Set once

assigned_to
├─ Rule 4: SET (load balanced)
└─ Display: Set once

resolved_at
├─ Rule 6: SET (on resolve)
└─ Metrics: Enables MTTR

opened_at
├─ Rule 2: SET (on insert)
└─ Display: Read-only

customer_satisfaction
├─ Rule 7: VALIDATE (required)
└─ Metrics: Enables rating

resolution_notes
├─ Rule 5: VALIDATE
├─ Rule 7: VALIDATE (min 10 chars)
└─ Audit: Complete documentation
```

---

## Business Logic Decisions

### Priority Calculation
```
Average of Impact and Urgency:
1-2 = Highest priority (Critical/High)
3 = Medium priority
4-5 = Lower priority (Low/Minimal)

Why: Balances urgency (time pressure) and impact (scope)
```

### Assignment Logic
```
1. Category determines default group
2. Priority 1-2 gets Senior Support (if available)
3. Load balancing: Least busy agent gets next case
4. Prevents workload imbalance

Why: Optimal routing + fair distribution
```

### Closure Validation
```
11 field checks before allowing closure:
- Basic fields (ensure data quality)
- Closure fields (ensure documentation)
- State verification (correct state flow)

Why: Prevents incomplete records, enables compliance
```

---

## Common Use Cases

### New Case Coming In
```
Customer calls support:
  1. Portal creates case
  2. Rule 1 → number generated
  3. Rule 2 → state = new
  4. Rule 3 → priority calculated
  5. Rule 4 → auto-assigned to agent
  6. Agent receives notification
  7. Work begins ✓
```

### Escalation Needed
```
Case prioritized as Critical:
  1. User updates priority to 1
  2. Rule 3 → recalculates (already 1)
  3. Rule 4 → reassigns to senior team
  4. Senior agent receives reassignment
  5. High-touch support begins ✓
```

### Case Resolution
```
Agent resolves issue:
  1. Fills in resolution details
  2. Changes state to "resolved"
  3. Rule 6 → captures resolved_at timestamp
  4. Time to resolution calculated
  5. Case moves to resolved ✓
```

### Case Closure
```
Case ready to close:
  1. Agent fills all closure fields
  2. Attempts to change state to "closed"
  3. Rule 5 → validates prerequisites
  4. Rule 7 → validates all 11 fields
  5. All checks pass
  6. Case closes, audit trail complete ✓
```

---

## Error Scenarios

### Scenario 1: Incomplete Closure
```
User tries: state → closed
Missing: resolution_notes, closure_code

Result:
  Error: "Cannot close case. Missing: Resolution Notes, Closure Code"
  State: Reverts to previous
  Update: Blocked ✗
```

### Scenario 2: Auto-assign Fails
```
Condition: Category has no assignment_group configured

Result:
  Warning: Category not found
  Manual assignment needed
  Case created but not assigned ⚠️
```

### Scenario 3: Priority Miscalculation
```
User sets: Impact = 5, Urgency = empty

Result:
  Handled: Urgency defaults to 3
  Calculation: Priority = (5 + 3) / 2 = 4
  No error, sensible default ✓
```

---

## Performance Tips

| Optimization | Benefit | When |
|--------------|---------|------|
| Index on assigned_to | Faster workload count | If 10K+ cases |
| Index on state | Faster filtering | Query heavy |
| Batch processing | Avoid rule overhead | Bulk imports |
| Async where possible | Non-blocking | Long operations |
| Minimize queries | Reduce DB load | Heavy users |

---

## Testing Quick Checklist

- [ ] **Rule 1**: New case gets CSE-xxxxxx number
- [ ] **Rule 2**: New case state = "new"
- [ ] **Rule 3**: Impact 1 + Urgency 1 = Priority 1
- [ ] **Rule 4**: Case assigned to team and agent
- [ ] **Rule 5**: Can't close without notes
- [ ] **Rule 6**: resolved_at timestamp set
- [ ] **Rule 7**: Can't close with missing fields
- [ ] **Combined**: Full workflow from new → closed

---

## Troubleshooting Quick Guide

| Problem | Check |
|---------|-------|
| No case number | Sequence table created? |
| Auto-assign fails | Category has group? Users in group? |
| Priority not calc | Impact/Urgency fields set? |
| Closure always blocked | All required fields exist? |
| Slow performance | Too many open cases? Need indexes? |

---

## Version & Status

| Item | Value |
|------|-------|
| **Version** | 1.0.0 |
| **Status** | ✅ Production Ready |
| **Total Rules** | 7 |
| **Total Fields Affected** | 34 |
| **Dependencies** | 3 tables, 5 business objects |
| **Estimated Implementation Time** | 2-4 hours |

---

## Related Documentation

- **Full Rules Guide**: [CUSTOMER_CASE_BUSINESS_RULES_GUIDE.md](CUSTOMER_CASE_BUSINESS_RULES_GUIDE.md)
- **Implementation Checklist**: [BUSINESS_RULES_IMPLEMENTATION_CHECKLIST.md](BUSINESS_RULES_IMPLEMENTATION_CHECKLIST.md)
- **TypeScript Code**: [customer_case_business_rules.ts](src/servicenow/businessRules/customer_case_business_rules.ts)
- **Field Specs**: [CUSTOMER_CASE_FIELD_SPECIFICATIONS.md](CUSTOMER_CASE_FIELD_SPECIFICATIONS.md)
- **Table Guide**: [TABLE_DEFINITIONS_GUIDE.md](TABLE_DEFINITIONS_GUIDE.md)

---

**Ready to implement? Start with the [BUSINESS_RULES_IMPLEMENTATION_CHECKLIST.md](BUSINESS_RULES_IMPLEMENTATION_CHECKLIST.md)**

Created: May 25, 2026
