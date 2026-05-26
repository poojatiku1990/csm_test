# Roles & ACLs Implementation Checklist

**Scope**: x_20261805_csm  
**Total Roles**: 4 (Agent, Manager, Admin, Customer)  
**Total ACLs to Create**: 30+  
**Estimated Time**: 4-6 hours  
**Created**: May 25, 2026

---

## Pre-Implementation Requirements

- [ ] ServiceNow instance access (Paris or later)
- [ ] x_20261805_csm scope created
- [ ] All CSM tables exist
- [ ] Administrative role access
- [ ] List of users to assign to roles
- [ ] Organizational structure defined
- [ ] Manager-to-agent mapping ready
- [ ] Account/team groupings defined

---

## STEP 1: CREATE BASE ROLES

### Step 1.1: Create CSM_AGENT Role

**Navigate To**: System Security → Roles → New

**Fill Fields**:
```
Name: CSM Agent
ID: csm_agent  (or let system auto-generate)
Scope: Custom CSM Support App (x_20261805_csm)
Description: Front-line support staff who work on customer cases
```

**Permissions to Grant**:
- [ ] Can create records
- [ ] Can read records
- [ ] Can update records

**Do NOT Grant**:
- [ ] Cannot delete
- [ ] Cannot manage users
- [ ] Cannot modify roles

**Save Role**: 
- [ ] Click "Save"

---

### Step 1.2: Create CSM_MANAGER Role

**Navigate To**: System Security → Roles → New

**Fill Fields**:
```
Name: CSM Manager
ID: csm_manager
Scope: Custom CSM Support App (x_20261805_csm)
Description: Team leads who oversee CSM agents and manage case escalations
```

**Role Inheritance**:
- [ ] Add Role: CSM Agent (inherits all CSM Agent permissions)

**Additional Permissions**:
- [ ] Can delete records
- [ ] Can manage reports
- [ ] Can manage team assignments

**Save Role**:
- [ ] Click "Save"

---

### Step 1.3: Create CSM_ADMIN Role

**Navigate To**: System Security → Roles → New

**Fill Fields**:
```
Name: CSM Administrator
ID: csm_admin
Scope: Custom CSM Support App (x_20261805_csm)
Description: System administrators who configure and maintain the CSM application
```

**Role Inheritance**:
- [ ] Add Role: CSM Manager (inherits CSM Manager permissions)

**Super Admin Features**:
- [ ] Can manage all records
- [ ] Can manage users
- [ ] Can manage roles
- [ ] Can bypass business rules
- [ ] Can access audit logs

**Save Role**:
- [ ] Click "Save"

---

### Step 1.4: Create CUSTOMER_USER Role

**Navigate To**: System Security → Roles → New

**Fill Fields**:
```
Name: Customer User
ID: customer_user
Scope: Custom CSM Support App (x_20261805_csm)
Description: External customer users who can view and create their own cases via service portal
```

**Mark as External**:
- [ ] Set: External User = Yes (if option exists)
- [ ] Note: Does NOT inherit from CSM Agent

**Limited Permissions**:
- [ ] Can create records
- [ ] Can read own records
- [ ] Cannot delete
- [ ] Cannot modify
- [ ] Cannot access admin functions

**Save Role**:
- [ ] Click "Save"

---

## STEP 2: CREATE TABLE-LEVEL ACLs

### Step 2.1: Create ACL Rules for Customer Case

**Navigate To**: System Security → Access Control (ACL) → New

**ACL Rule 1: CSM Agent Read Access**

```
Operation: read
Table: Customer Case (x_20261805_csm_customer_case)
Role: CSM Agent (x_20261805_csm.csm_agent)
Condition (Advanced):
  assignment_group IN (javascript: current.getAssignmentGroup())
  OR assigned_to.sys_id = gs.getUserID()
  OR created_by.sys_id = gs.getUserID()
Can delegate: false
Status: Active
```

**Test Before Saving**:
- [ ] Condition SQL is valid
- [ ] Agent can read own cases

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 2: CSM Agent Create Access**

```
Operation: create
Table: Customer Case
Role: CSM Agent
Condition: (leave blank - allow creation)
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 3: CSM Agent Write Access**

```
Operation: write
Table: Customer Case
Role: CSM Agent
Condition (Advanced):
  assigned_to.sys_id = gs.getUserID()
  OR created_by.sys_id = gs.getUserID()
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 4: CSM Manager Read Access**

```
Operation: read
Table: Customer Case
Role: CSM Manager
Condition (Advanced):
  assignment_group.manager.sys_id = gs.getUserID()
  OR created_by.sys_id = gs.getUserID()
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 5: CSM Manager Write Access**

```
Operation: write
Table: Customer Case
Role: CSM Manager
Condition (Advanced):
  assignment_group.manager.sys_id = gs.getUserID()
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 6: CSM Manager Delete Access**

```
Operation: delete
Table: Customer Case
Role: CSM Manager
Condition (Advanced):
  state = 'closed' OR state = 'cancelled'
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 7: CSM Admin - All Access**

```
Operation: all
Table: Customer Case
Role: CSM Admin
Condition: (leave blank)
Can delegate: true
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 8: Customer User Create Access**

```
Operation: create
Table: Customer Case
Role: Customer User
Condition (Advanced):
  source = 'service_portal'
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 9: Customer User Read Access**

```
Operation: read
Table: Customer Case
Role: Customer User
Condition (Advanced):
  created_by.sys_id = gs.getUserID()
  OR customer_account IN (javascript: 
      var customerAccounts = [];
      // Get user's linked customer accounts
      return customerAccounts;
    )
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

### Step 2.2: Create ACL Rules for Customer Account

**Navigate To**: System Security → Access Control (ACL) → New

**ACL Rule 1: CSM Agent - Read Only**

```
Operation: read
Table: Customer Account (x_20261805_csm_customer_account)
Role: CSM Agent
Condition: (leave blank)
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 2: CSM Manager - Read/Write**

```
Operation: write
Table: Customer Account
Role: CSM Manager
Condition: (leave blank - can edit all)
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 3: CSM Admin - All Access**

```
Operation: all
Table: Customer Account
Role: CSM Admin
Condition: (leave blank)
Can delegate: true
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

**ACL Rule 4: Customer User - Read Own Account**

```
Operation: read
Table: Customer Account
Role: Customer User
Condition (Advanced):
  sys_id IN (javascript: 
    // User's linked customer accounts
    return getUserAccounts();
  )
Can delegate: false
Status: Active
```

**Save Rule**:
- [ ] Click "Save"

---

### Step 2.3: Create ACL Rules for Customer Contact

**Repeat same pattern as Customer Account**:

- [ ] CSM Agent - Read Only
- [ ] CSM Manager - Read/Write
- [ ] CSM Admin - All Access
- [ ] Customer User - Read Own Contacts

---

### Step 2.4: Create ACL Rules for Communication

**ACL Rules**:

- [ ] CSM Agent - Read own cases only
- [ ] CSM Agent - Create own cases only
- [ ] CSM Manager - Read team communications
- [ ] CSM Manager - Write/Delete own
- [ ] CSM Admin - All access
- [ ] Customer User - Read external only

---

### Step 2.5: Create ACL Rules for SLA Policy

**ACL Rules**:

- [ ] CSM Agent - Read only
- [ ] CSM Manager - Read only
- [ ] CSM Admin - All access

---

### Step 2.6: Create ACL Rules for Knowledge Articles

**ACL Rules**:

- [ ] CSM Agent - Read published only
- [ ] CSM Manager - Read/Write own
- [ ] CSM Admin - All access
- [ ] Customer User - Read published portal articles

---

## STEP 3: CREATE FIELD-LEVEL ACLs

### Step 3.1: Protect Case Number Field

**Navigate To**: System Security → Access Control (ACL) → New

**Create Field ACL**:

```
Operation: write
Table: Customer Case
Field: number
Role: (leave blank - applies to all)
Condition: (leave blank)
Can delegate: false
Status: Active

Effect: Case number is READ-ONLY for everyone
```

**Save**:
- [ ] Click "Save"

---

### Step 3.2: Protect Created Date Field

**Create Field ACL**:

```
Operation: write
Table: Customer Case
Field: created_at
Role: (leave blank)
Condition: (leave blank)
Can delegate: false
Status: Active

Effect: Created date is READ-ONLY
```

**Save**:
- [ ] Click "Save"

---

### Step 3.3: Restrict Closure Code to Managers

**Create Field ACL**:

```
Operation: write
Table: Customer Case
Field: closure_code
Role: CSM Agent
Condition: (leave blank)
Require: false
Status: Active

Effect: CSM Agent cannot write to this field
```

**Create Separate ACL**:

```
Operation: write
Table: Customer Case
Field: closure_code
Role: CSM Manager
Condition: (leave blank)
Require: false
Status: Active

Effect: CSM Manager CAN write to this field
```

---

### Step 3.4: Hide Internal Notes from Customers

**Create Field ACL**:

```
Operation: read
Table: Communication
Field: internal_notes
Role: Customer User
Condition: (leave blank)
Require: false
Status: Active

Effect: Customer cannot read internal notes
```

---

### Step 3.5: Restrict Financial Data

**Create Field ACL**:

```
Operation: read
Table: Customer Account
Field: financial_data
Role: CSM Agent
Condition: (leave blank)
Require: false
Status: Active

Effect: Agent cannot see financial data
```

**Create Separate ACL for Manager**:

```
Operation: write
Table: Customer Account
Field: financial_data
Role: CSM Manager
Condition: (leave blank)
Require: false
Status: Active

Effect: Manager cannot modify financial data
```

---

## STEP 4: TEST PERMISSIONS

### Test 4.1: Agent Permissions

**Create test agent user**:
- [ ] User: test_agent@company.com
- [ ] Assign role: CSM Agent

**Test Read Access**:
- [ ] Log in as agent
- [ ] Open case assigned to test_agent
  - [ ] Can read? ✓ Expected: Yes
- [ ] Open case assigned to different agent
  - [ ] Can read? ✓ Expected: No (blocked)
- [ ] View Customer Accounts
  - [ ] Can read? ✓ Expected: Yes (read-only)

**Test Create Access**:
- [ ] Click "New Case"
- [ ] Create new case
  - [ ] Can create? ✓ Expected: Yes
- [ ] Case number auto-generated?
  - [ ] Auto-number? ✓ Expected: Yes

**Test Write Access**:
- [ ] Open own case
- [ ] Edit short_description
  - [ ] Can edit? ✓ Expected: Yes
- [ ] Try to edit assigned_to
  - [ ] Can edit? ✓ Expected: No (blocked)
- [ ] Try to edit case number
  - [ ] Can edit? ✓ Expected: No (read-only)

**Test Delete Access**:
- [ ] Try to delete own case
  - [ ] Can delete? ✓ Expected: No (blocked)

---

### Test 4.2: Manager Permissions

**Create test manager user**:
- [ ] User: test_manager@company.com
- [ ] Assign role: CSM Manager
- [ ] Assign to: Support Team group

**Test Team Access**:
- [ ] Log in as manager
- [ ] View all cases in team
  - [ ] Can see all team cases? ✓ Expected: Yes
  - [ ] Can see cases from other teams? ✓ Expected: No

**Test Assignment**:
- [ ] Open case in team
- [ ] Edit assigned_to field
  - [ ] Can assign to team member? ✓ Expected: Yes
  - [ ] Can assign to outside team? ✓ Expected: No

**Test Closure**:
- [ ] Open case with state = "closed"
- [ ] Try to delete
  - [ ] Can delete? ✓ Expected: Yes
- [ ] Open case with state = "in_progress"
- [ ] Try to delete
  - [ ] Can delete? ✓ Expected: No (blocked)

**Test Reports**:
- [ ] Navigate to Reports
- [ ] "SLA Compliance Report"
  - [ ] Can access? ✓ Expected: Yes
- [ ] "Agent Workload"
  - [ ] Can access? ✓ Expected: Yes

---

### Test 4.3: Admin Permissions

**Create test admin user**:
- [ ] User: test_admin@company.com
- [ ] Assign role: CSM Administrator

**Test Full Access**:
- [ ] Log in as admin
- [ ] View any case
  - [ ] Can read? ✓ Expected: Yes
- [ ] Edit any case
  - [ ] Can write? ✓ Expected: Yes
- [ ] Delete any closed case
  - [ ] Can delete? ✓ Expected: Yes

**Test Configuration**:
- [ ] Navigate to Business Rules
  - [ ] Can access? ✓ Expected: Yes
- [ ] Navigate to UI Policies
  - [ ] Can access? ✓ Expected: Yes
- [ ] Navigate to Users
  - [ ] Can access? ✓ Expected: Yes

**Test Bypass**:
- [ ] Disable a business rule
  - [ ] Can disable? ✓ Expected: Yes
- [ ] Modify auto-assignment logic
  - [ ] Can modify? ✓ Expected: Yes

---

### Test 4.4: Customer User Permissions

**Create test customer user**:
- [ ] User: john.customer@acme.com
- [ ] Assign role: Customer User
- [ ] Link to: Customer Account "Acme Corp"

**Test Portal Access**:
- [ ] Log in as customer user
- [ ] Check workspace
  - [ ] See Agent workspace? ✓ Expected: No
  - [ ] See Service Portal? ✓ Expected: Yes

**Test Read Access**:
- [ ] View cases
  - [ ] See own cases? ✓ Expected: Yes
  - [ ] See other cases? ✓ Expected: No
- [ ] View Customer Account
  - [ ] See own account? ✓ Expected: Yes
  - [ ] See other accounts? ✓ Expected: No

**Test Internal Data Hidden**:
- [ ] Open own case
- [ ] Check for internal notes
  - [ ] Can see internal_notes? ✓ Expected: No
- [ ] Check for resolution_notes
  - [ ] Can see resolution_notes? ✓ Expected: No
- [ ] Check for assigned_to
  - [ ] Can see assigned agent? ✓ Expected: No

**Test Create Access**:
- [ ] Click "New Case"
- [ ] Try to create case
  - [ ] Can create? ✓ Expected: Yes (via portal)

**Test Data Modification**:
- [ ] Open own case
- [ ] Try to change state
  - [ ] Can change? ✓ Expected: No
- [ ] Try to add communication
  - [ ] Can add? ✓ Expected: Yes

---

## STEP 5: ASSIGN USERS TO ROLES

### Step 5.1: Assign Support Staff

**For Each Agent**:

1. **Navigate To**: System Administration → Users
2. **Find User**: Search for agent name
3. **Open User Record**
4. **Assign Role**:
   - [ ] Click "Roles" section
   - [ ] Click "Edit"
   - [ ] Add role: CSM Agent (x_20261805_csm.csm_agent)
   - [ ] Save

5. **Document**:
   - [ ] Record user assignment
   - [ ] Note start date

---

### Step 5.2: Assign Team Leads

**For Each Manager**:

1. **Navigate To**: System Administration → Users
2. **Find User**: Search for manager name
3. **Open User Record**
4. **Assign Role**:
   - [ ] Add role: CSM Manager (x_20261805_csm.csm_manager)
   - [ ] Inherits: CSM Agent automatically
   - [ ] Save

5. **Configure Team**:
   - [ ] Assign manager to groups
   - [ ] Set as group manager

---

### Step 5.3: Assign System Admins

**For Each Admin**:

1. **Navigate To**: System Administration → Users
2. **Find User**: Search for admin name
3. **Open User Record**
4. **Assign Role**:
   - [ ] Add role: CSM Administrator (x_20261805_csm.csm_admin)
   - [ ] Inherits: CSM Manager automatically
   - [ ] Save

5. **Verify Access**:
   - [ ] Can access admin functions?

---

### Step 5.4: Provision Customer Users

**For Each Customer**:

1. **Create External User**:
   - [ ] Navigate To: System Administration → Users → New
   - [ ] Fill fields:
     - User name: customer@company.com
     - First name: [Customer name]
     - Last name: [Last name]
     - External: true
   - [ ] Save

2. **Assign Role**:
   - [ ] Add role: Customer User (x_20261805_csm.customer_user)
   - [ ] Save

3. **Link to Account**:
   - [ ] Navigate to Customer Account
   - [ ] Add this user as contact
   - [ ] Save

---

## STEP 6: CONFIGURE AUDIT LOGGING

### Step 6.1: Enable Audit for Customer Case

**Navigate To**: System Audit → Audit Table

**Create Audit Rule**:

```
Table: Customer Case
Audit all operations: true
Log level: All (read, write, delete)
Retention: 90 days
```

**Save**:
- [ ] Click "Save"

---

### Step 6.2: Enable Audit for Sensitive Tables

**Repeat for**:
- [ ] Customer Account
- [ ] Customer Contact
- [ ] SLA Policy
- [ ] Business Rules

---

### Step 6.3: Configure Audit Review

**Create scheduled task**:
- [ ] Monthly audit review
- [ ] Generated by: CSM Admin
- [ ] Send to: Manager & Security team

---

## STEP 7: DOCUMENT AND TRAIN

### Step 7.1: Create Permission Matrix

**Create spreadsheet**:

```
User | Role | Tables | Can Read | Can Write | Can Delete
-----|------|--------|----------|-----------|----------
John | Agent | Cases | Team | Own only | No
Mary | Manager | Cases | All | All | Closed only
Bob | Admin | All | All | All | Yes
```

---

### Step 7.2: Create User Guide

**Document for each role**:

- [ ] What you can do
- [ ] What you cannot do
- [ ] Example workflows
- [ ] Troubleshooting common issues

---

### Step 7.3: Train Users

**Training by role**:

- [ ] CSM Agent: 1 hour training
- [ ] CSM Manager: 2 hours training
- [ ] CSM Admin: 4 hours training
- [ ] Customer User: 30 minutes training

---

## STEP 8: MONITOR AND MAINTAIN

### Step 8.1: Post-Deployment (First Week)

- [ ] Monitor for permission errors
- [ ] Check audit logs daily
- [ ] Respond to access issues
- [ ] Document problems

---

### Step 8.2: Ongoing Maintenance

**Monthly**:
- [ ] Review audit logs
- [ ] Check role assignments
- [ ] Verify no orphaned users

**Quarterly**:
- [ ] Review ACL rules effectiveness
- [ ] Update permissions as needed
- [ ] Document changes

---

## STEP 9: SIGN-OFF

### Implementation Tracking

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Create Roles (4) | ⬜ | | |
| Create Table ACLs | ⬜ | | |
| Create Field ACLs | ⬜ | | |
| Test Agent Access | ⬜ | | |
| Test Manager Access | ⬜ | | |
| Test Admin Access | ⬜ | | |
| Test Customer Access | ⬜ | | |
| Assign Users | ⬜ | | |
| Configure Audit | ⬜ | | |
| Train Users | ⬜ | | |
| Monitor (1 week) | ⬜ | | |

### Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| Security Officer | | | |
| Manager | | | |
| System Admin | | | |

---

**Version**: 1.0.0  
**Status**: ✅ Ready for Implementation  
**Created**: May 25, 2026
