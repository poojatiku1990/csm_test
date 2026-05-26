# Customer Case Business Rules - Implementation Checklist

**Scope**: x_20261805_csm  
**Table**: Customer Case (x_20261805_csm_customer_case)  
**Total Rules**: 7  
**Date**: May 25, 2026

---

## Quick Summary

| # | Rule Name | Trigger | Purpose | Status |
|----|-----------|---------|---------|--------|
| 1 | Auto-generate Case Number | BEFORE INSERT | Generate CSE-XXXXXXX | ⬜ |
| 2 | Set Default State | BEFORE INSERT | Initialize state = "new" | ⬜ |
| 3 | Calculate Priority | BEFORE INSERT/UPDATE | Auto-calc from impact/urgency | ⬜ |
| 4 | Auto-assign Case | BEFORE INSERT/UPDATE | Route to team and agent | ⬜ |
| 5 | Require Resolution Notes | BEFORE UPDATE | Validate closure fields | ⬜ |
| 6 | Set Resolved Date | BEFORE UPDATE | Capture resolution time | ⬜ |
| 7 | Prevent Closure | BEFORE UPDATE | Comprehensive validation | ⬜ |

---

## PRE-IMPLEMENTATION CHECKLIST

### Prerequisites
- [ ] ServiceNow instance (Paris or later)
- [ ] Application scope: x_20261805_csm created
- [ ] Customer Case table created
- [ ] Customer Case Category table created
- [ ] Assignment groups created
- [ ] Users/agents created
- [ ] SLA policies configured

### Dependency Check
- [ ] Table x_20261805_csm_customer_case exists
- [ ] Table x_20261805_csm_case_category exists
- [ ] sys_number table available
- [ ] sys_user_group table accessible
- [ ] sys_user table accessible
- [ ] sys_user_grmember table accessible

---

## STEP-BY-STEP IMPLEMENTATION

### STEP 1: Create Business Rule #1
#### Rule: Auto-generate Case Number

- [ ] Navigate to: System Policy → Business Rules
- [ ] Click: New
- [ ] Fill in:
  - [ ] Name: `Auto-generate Case Number`
  - [ ] Table: `Customer Case [x_20261805_csm_customer_case]`
  - [ ] Active: `checked`
  
- [ ] Set When to Run:
  - [ ] Timing: `Before`
  - [ ] Trigger: `insert`
  - [ ] When: `--choose--, do not restrict`
  - [ ] Order: `100`

- [ ] Advanced Options:
  - [ ] Run script type: `async`

- [ ] Copy Script:
  ```
  [Copy full script from customer_case_business_rules.ts - RULE_AUTO_GENERATE_CASE_NUMBER]
  ```

- [ ] Click: Submit
- [ ] Verify: Rule appears in list

#### Test Rule 1
- [ ] Create new case via form
- [ ] Verify: Case number auto-generates (CSE-1000001)
- [ ] Check: Case number is read-only
- [ ] Check: Next case gets CSE-1000002

---

### STEP 2: Create Business Rule #2
#### Rule: Set Default State to New

- [ ] Navigate to: System Policy → Business Rules
- [ ] Click: New
- [ ] Fill in:
  - [ ] Name: `Set Default State to New`
  - [ ] Table: `Customer Case [x_20261805_csm_customer_case]`
  - [ ] Active: `checked`
  
- [ ] Set When to Run:
  - [ ] Timing: `Before`
  - [ ] Trigger: `insert`
  - [ ] Condition: `state IS EMPTY`
  - [ ] Order: `110`

- [ ] Advanced Options:
  - [ ] Run script type: `async`

- [ ] Copy Script:
  ```
  [Copy full script from customer_case_business_rules.ts - RULE_SET_DEFAULT_STATE]
  ```

- [ ] Click: Submit

#### Test Rule 2
- [ ] Create new case, leave state empty
- [ ] Verify: State defaults to "new"
- [ ] Verify: opened_at timestamp set
- [ ] Check: Created on timestamp differs from opened_at

---

### STEP 3: Create Business Rule #3
#### Rule: Calculate Priority from Impact and Urgency

- [ ] Navigate to: System Policy → Business Rules
- [ ] Click: New
- [ ] Fill in:
  - [ ] Name: `Calculate Priority from Impact and Urgency`
  - [ ] Table: `Customer Case [x_20261805_csm_customer_case]`
  - [ ] Active: `checked`
  
- [ ] Set When to Run:
  - [ ] Timing: `Before`
  - [ ] Trigger: `insert, update` (select both)
  - [ ] Condition: `impact CHANGED OR urgency CHANGED`
  - [ ] Order: `120`

- [ ] Advanced Options:
  - [ ] Advanced: `checked`
  - [ ] Run script type: `async`

- [ ] Copy Script:
  ```
  [Copy full script from customer_case_business_rules.ts - RULE_SET_PRIORITY_FROM_IMPACT_URGENCY]
  ```

- [ ] Click: Submit

#### Test Rule 3
- [ ] Create case with Impact=1, Urgency=1
- [ ] Verify: Priority automatically set to 1
- [ ] Update case: Change Impact to 3
- [ ] Verify: Priority recalculates
- [ ] Test different combinations (see matrix in docs)

---

### STEP 4: Create Business Rule #4
#### Rule: Auto-assign Case Based on Category

- [ ] Navigate to: System Policy → Business Rules
- [ ] Click: New
- [ ] Fill in:
  - [ ] Name: `Auto-assign Case Based on Category`
  - [ ] Table: `Customer Case [x_20261805_csm_customer_case]`
  - [ ] Active: `checked`
  
- [ ] Set When to Run:
  - [ ] Timing: `Before`
  - [ ] Trigger: `insert, update` (select both)
  - [ ] Condition: `category IS NOT EMPTY AND assigned_to IS EMPTY AND state = "new"`
  - [ ] Order: `130`

- [ ] Advanced Options:
  - [ ] Advanced: `checked`
  - [ ] Run script type: `async`

- [ ] Copy Script:
  ```
  [Copy full script from customer_case_business_rules.ts - RULE_AUTO_ASSIGN_BY_CATEGORY]
  ```

- [ ] Click: Submit

#### Prerequisite Setup
- [ ] Create Case Categories with assignment groups
- [ ] Create Senior Support groups for critical cases:
  - [ ] `[Category Name] - Senior Support` for Priority 1-2

#### Test Rule 4
- [ ] Create case with category set
- [ ] Verify: assignment_group auto-set
- [ ] Verify: assigned_to populated with agent
- [ ] Verify: assigned_to_date set
- [ ] Create multiple cases: verify load balancing
- [ ] Create Priority 1 case: verify senior team assignment

---

### STEP 5: Create Business Rule #5
#### Rule: Require Resolution Notes Before Closure

- [ ] Navigate to: System Policy → Business Rules
- [ ] Click: New
- [ ] Fill in:
  - [ ] Name: `Require Resolution Notes Before Closure`
  - [ ] Table: `Customer Case [x_20261805_csm_customer_case]`
  - [ ] Active: `checked`
  
- [ ] Set When to Run:
  - [ ] Timing: `Before`
  - [ ] Trigger: `update`
  - [ ] Condition: `state CHANGED AND state = "closed"`
  - [ ] Order: `140`

- [ ] Advanced Options:
  - [ ] Run script type: `sync` (must be synchronous to block)

- [ ] Copy Script:
  ```
  [Copy full script from customer_case_business_rules.ts - RULE_REQUIRE_RESOLUTION_NOTES]
  ```

- [ ] Click: Submit

#### Test Rule 5
- [ ] Open existing case (state: in_progress)
- [ ] Try to change state to "closed" WITHOUT filling fields
- [ ] Verify: Error message appears
- [ ] Verify: State reverts to previous value
- [ ] Verify: Update not applied
- [ ] Fill all required fields
- [ ] Verify: Closure now allowed

---

### STEP 6: Create Business Rule #6
#### Rule: Set Resolved Date on State Change

- [ ] Navigate to: System Policy → Business Rules
- [ ] Click: New
- [ ] Fill in:
  - [ ] Name: `Set Resolved Date on State Change`
  - [ ] Table: `Customer Case [x_20261805_csm_customer_case]`
  - [ ] Active: `checked`
  
- [ ] Set When to Run:
  - [ ] Timing: `Before`
  - [ ] Trigger: `update`
  - [ ] Condition: `state CHANGED AND state = "resolved"`
  - [ ] Order: `150`

- [ ] Advanced Options:
  - [ ] Run script type: `async`

- [ ] Copy Script:
  ```
  [Copy full script from customer_case_business_rules.ts - RULE_SET_RESOLVED_DATE]
  ```

- [ ] Click: Submit

#### Test Rule 6
- [ ] Open case (state: in_progress)
- [ ] Note opened_at timestamp
- [ ] Change state to "resolved"
- [ ] Save case
- [ ] Verify: resolved_at timestamp set
- [ ] Verify: resolved_at is AFTER opened_at
- [ ] Check: Resolution time calculation works

---

### STEP 7: Create Business Rule #7
#### Rule: Prevent Closure - Mandatory Fields Validation

- [ ] Navigate to: System Policy → Business Rules
- [ ] Click: New
- [ ] Fill in:
  - [ ] Name: `Prevent Closure - Mandatory Fields Validation`
  - [ ] Table: `Customer Case [x_20261805_csm_customer_case]`
  - [ ] Active: `checked`
  
- [ ] Set When to Run:
  - [ ] Timing: `Before`
  - [ ] Trigger: `update`
  - [ ] Condition: `state CHANGED AND state = "closed"`
  - [ ] Order: `160`

- [ ] Advanced Options:
  - [ ] Advanced: `checked`
  - [ ] Run script type: `sync` (must block immediately)

- [ ] Copy Script:
  ```
  [Copy full script from customer_case_business_rules.ts - RULE_PREVENT_CLOSURE_MISSING_FIELDS]
  ```

- [ ] Click: Submit

#### Test Rule 7
- [ ] Open case in "resolved" state
- [ ] Try to close WITHOUT filling any required fields
- [ ] Verify: Comprehensive error message
- [ ] Verify: Lists all missing fields
- [ ] Verify: State reverts
- [ ] Fill all required fields:
  - [ ] short_description (existing)
  - [ ] customer_account (existing)
  - [ ] customer_contact (existing)
  - [ ] customer_email (existing)
  - [ ] priority (existing)
  - [ ] category (existing)
  - [ ] resolution_code (new)
  - [ ] resolution_notes (new, >10 chars)
  - [ ] closure_code (new)
  - [ ] customer_satisfaction (new, 1-5)
- [ ] Try closure again
- [ ] Verify: Closure succeeds

---

## POST-IMPLEMENTATION VERIFICATION

### Verify All Rules Exist
- [ ] Navigate to: System Policy → Business Rules
- [ ] Filter Table: x_20261805_csm_customer_case
- [ ] Count: Should show 7 rules
- [ ] Check: All have Active = True

### Verify Rule Order
- [ ] Rule #1: Order 100 ✓
- [ ] Rule #2: Order 110 ✓
- [ ] Rule #3: Order 120 ✓
- [ ] Rule #4: Order 130 ✓
- [ ] Rule #5: Order 140 ✓
- [ ] Rule #6: Order 150 ✓
- [ ] Rule #7: Order 160 ✓

### Check Execution Logs
- [ ] Navigate to: System Logs → Application Logs
- [ ] Create test case
- [ ] Search for: "x_20261805_csm_customer_case"
- [ ] Verify: Business rule logs appear
- [ ] Check: No error messages

### Performance Check
- [ ] Monitor: System Health
- [ ] Check: Rule execution times
- [ ] Look for: Any timeouts or slow rules
- [ ] Optimize: If needed (see troubleshooting)

---

## FUNCTIONAL TESTING

### Test Scenario 1: Create New Case (All INSERT rules)
```
Action: Create new case
├─ Rule 1: ✓ Case number generates
├─ Rule 2: ✓ State = "new"
├─ Rule 3: ✓ Priority calculated
├─ Rule 4: ✓ Auto-assigned
└─ Result: ✓ Case successfully created with all automated fields
```

- [ ] Execute test scenario 1
- [ ] Verify all checks pass

### Test Scenario 2: Update Priority (UPDATE rule)
```
Action: Update Impact/Urgency
├─ Rule 3: ✓ Priority recalculated
├─ Rule 4: ✓ May reassign to senior team
└─ Result: ✓ Case updated with new priority and assignment
```

- [ ] Execute test scenario 2
- [ ] Verify priority changes
- [ ] Check if reassignment happens

### Test Scenario 3: Attempt Invalid Closure (VALIDATION rules)
```
Action: Try to close without required fields
├─ Rule 5: ✓ Detects missing fields
├─ Rule 7: ✓ Comprehensive validation
├─ Result: ✗ Closure blocked
└─ State: Reverted to previous
```

- [ ] Execute test scenario 3
- [ ] Verify error message
- [ ] Check state reverted

### Test Scenario 4: Complete Case Closure (VALIDATION + ACTION rules)
```
Action: Close case with all required fields
├─ Rule 5: ✓ Fields validated
├─ Rule 6: ✓ resolved_at already set
├─ Rule 7: ✓ All validations pass
├─ Result: ✓ Case successfully closed
└─ Audit: ✓ Events logged
```

- [ ] Execute test scenario 4
- [ ] Verify closure succeeds
- [ ] Check all timestamps set

### Test Scenario 5: Load Balancing (AUTO-ASSIGN rule)
```
Create 5 cases same category:
├─ Case 1: Agent A (8 open cases) → Assigned to Agent B (3 open)
├─ Case 2: Assigned to Agent C (1 open case) ← Least busy
├─ Case 3: Assigned to Agent A (6 open cases) → After B gets case 1
├─ Case 4: Assigned to ...
└─ Result: ✓ Load balancing working
```

- [ ] Create 5+ test cases
- [ ] Verify distribution
- [ ] Confirm least-busy logic

---

## COMMON ISSUES & SOLUTIONS

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Case number not generating** | Manual number required | - Check sequence created<br>- Verify sys_number table exists<br>- Check rule script has no errors |
| **Auto-assign not working** | assigned_to always empty | - Check category has assignment_group<br>- Verify users in group<br>- Check rule condition filter |
| **Priority not calculating** | Priority stays at default | - Set Impact/Urgency on insert<br>- Verify rule 3 runs<br>- Check formula in script |
| **Rules not executing** | All manual operations | - Check rule Active = true<br>- Verify table name correct<br>- Check filters correct |
| **Closure always blocked** | Can't close any case | - Verify rules 5 & 7 order<br>- Check all required fields exist<br>- Test with complete data |
| **Performance slow** | Updates take 10+ seconds | - Check agent query optimization<br>- Add indexes on assigned_to<br>- Reduce query results |

---

## ROLLBACK PLAN

If issues occur, rollback in reverse order:

1. [ ] Disable Rule 7 (Prevent Closure)
2. [ ] Disable Rule 6 (Set Resolved Date)
3. [ ] Disable Rule 5 (Require Notes)
4. [ ] Disable Rule 4 (Auto-assign)
5. [ ] Disable Rule 3 (Calculate Priority)
6. [ ] Disable Rule 2 (Set State)
7. [ ] Disable Rule 1 (Case Number)

To rollback: Set Active = false on each rule

---

## SIGN-OFF CHECKLIST

### Development Team
- [ ] All 7 rules created
- [ ] All scripts reviewed
- [ ] No syntax errors
- [ ] Performance acceptable

### QA Team
- [ ] All test scenarios passed
- [ ] Edge cases tested
- [ ] Error messages appropriate
- [ ] Load tested

### Business Owner
- [ ] Requirements met
- [ ] Workflow as expected
- [ ] Data quality good
- [ ] Ready for production

---

## MONITORING POST-DEPLOYMENT

### Daily Monitoring
- [ ] Check system logs for errors
- [ ] Verify cases auto-assigning
- [ ] Check case closures completing
- [ ] Monitor performance

### Weekly Reporting
- [ ] Case creation count
- [ ] Auto-assignment success rate
- [ ] Rule execution times
- [ ] Any failed validations

### Monthly Review
- [ ] MTTR (Mean Time To Resolution)
- [ ] Load balancing effectiveness
- [ ] Rule performance trends
- [ ] User satisfaction

---

## DOCUMENTATION REFERENCES

- Full Rule Documentation: [CUSTOMER_CASE_BUSINESS_RULES_GUIDE.md](CUSTOMER_CASE_BUSINESS_RULES_GUIDE.md)
- TypeScript Implementation: [customer_case_business_rules.ts](src/servicenow/businessRules/customer_case_business_rules.ts)
- Field Specifications: [CUSTOMER_CASE_FIELD_SPECIFICATIONS.md](CUSTOMER_CASE_FIELD_SPECIFICATIONS.md)
- Table Definitions: [TABLE_DEFINITIONS_GUIDE.md](TABLE_DEFINITIONS_GUIDE.md)

---

**Status**: ✅ Ready for Implementation  
**Version**: 1.0.0  
**Created**: May 25, 2026  
**Last Updated**: May 25, 2026

---

## IMPLEMENTATION TRACKING

| Phase | Item | Status | Owner | Date |
|-------|------|--------|-------|------|
| Setup | Prerequisites check | ⬜ | | |
| Rule 1 | Auto-generate number | ⬜ | | |
| Rule 2 | Set default state | ⬜ | | |
| Rule 3 | Calculate priority | ⬜ | | |
| Rule 4 | Auto-assign case | ⬜ | | |
| Rule 5 | Require notes | ⬜ | | |
| Rule 6 | Set resolved date | ⬜ | | |
| Rule 7 | Prevent closure | ⬜ | | |
| Testing | All scenarios | ⬜ | | |
| Deploy | Production | ⬜ | | |
| Monitor | Go-live check | ⬜ | | |

---

**Mark items with:**
- ⬜ = Not started
- 🔄 = In progress
- ✅ = Complete
