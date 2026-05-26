# Roles & Access Control Lists (ACLs) - CSM Application

**Scope**: x_20261805_csm  
**Table**: Customer Case & Related Tables  
**Total Roles**: 4  
**Total ACLs**: 30+  
**Created**: May 25, 2026

---

## Overview

Role-Based Access Control (RBAC) defines what each user can do in ServiceNow. ACLs (Access Control Lists) enforce these permissions at the table, record, and field levels.

### Four-Tier Role Model

```
CSM_ADMIN
  ├─ Full system access
  └─ Inherits: CSM_MANAGER
  
CSM_MANAGER
  ├─ Team management
  ├─ Case management
  └─ Inherits: CSM_AGENT
  
CSM_AGENT
  ├─ Case handling
  ├─ Read-only data access
  └─ Inherits: None
  
CUSTOMER_USER
  ├─ Portal access only
  ├─ Own cases only
  └─ External, no inheritance
```

---

## ROLE 1: CSM AGENT

### Overview
**Role ID**: x_20261805_csm.csm_agent  
**Level**: 2 (Standard User)  
**Users**: Support staff, tier 1 technicians  
**Focus**: Case handling and customer support

### Capabilities Summary

| Capability | Allowed |
|------------|---------|
| Read cases | ✅ Assigned/created only |
| Create cases | ✅ Yes |
| Update cases | ✅ Assigned only |
| Delete cases | ❌ No |
| Escalate cases | ❌ No |
| Assign cases | ❌ No |
| View reports | ❌ No |
| Manage users | ❌ No |

### Table Permissions

#### Customer Case
```
READ:
  ✅ Can see cases where:
     - assigned_to = current_user
     - created_by = current_user
  ✅ Cannot see: Other users' cases

CREATE:
  ✅ Full creation allowed
  ✅ Auto-assignment applies
  
UPDATE:
  ✅ Can update own assigned cases
  ✅ Allowed fields:
     - short_description
     - description
     - state
     - priority
     - resolution_code
     - resolution_notes
     - impact, urgency
     - category
     - customer_contact
     - is_escalated, escalation_reason
  ✅ Cannot modify:
     - number (auto-generated)
     - created_at, opened_at (system)
     - customer_account (read-only)
     - assigned_to, assignment_group (manager only)

DELETE:
  ❌ No delete permission
```

#### Customer Account
```
READ:
  ✅ Can read all account info
  ✅ Allowed fields: name, type, support_tier, phone, email

CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

#### Customer Contact
```
READ:
  ✅ Can read all contact info

CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

#### Communication
```
READ:
  ✅ Can see communications for cases assigned to them

CREATE:
  ✅ Can add communications to assigned cases
  
UPDATE:
  ✅ Can update own communications only
  
DELETE:
  ❌ No delete permission
```

#### SLA Policy
```
READ: ✅ Yes (reference only)
CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

#### Knowledge Articles
```
READ: ✅ Published articles only
CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

### Example Permissions

**Scenario 1: Reading Cases**
```
Agent logs in
  ↓
Can see:
  ✅ Cases assigned to them
  ✅ Cases they created
  ❌ Cases assigned to colleagues
  ❌ Cases from other teams
```

**Scenario 2: Updating a Case**
```
Agent opens case: CSE-1000042
  ↓
Assigned to: Agent Smith
  ↓
Can edit:
  ✅ State (new → open → in_progress)
  ✅ Resolution notes
  ✅ Priority
  ❌ Cannot edit: assigned_to (manager only)
  ❌ Cannot delete case
```

**Scenario 3: Creating a Case**
```
Agent creates new case
  ↓
Allowed fields:
  ✅ short_description
  ✅ customer_account
  ✅ customer_contact
  ✅ priority
  ✅ impact, urgency
  ↓
Business rules apply:
  ✅ Number auto-generated
  ✅ State set to "new"
  ✅ Priority calculated
  ✅ Auto-assigned to team
```

---

## ROLE 2: CSM MANAGER

### Overview
**Role ID**: x_20261805_csm.csm_manager  
**Level**: 3 (Team Lead)  
**Users**: Senior support staff, team leads  
**Focus**: Team management, case oversight, escalations

### Capabilities Summary

| Capability | Allowed |
|------------|---------|
| Read cases | ✅ Team cases |
| Create cases | ✅ Yes |
| Update cases | ✅ All team cases |
| Delete cases | ✅ Closed/cancelled |
| Escalate cases | ✅ Yes |
| Assign cases | ✅ Team members |
| View reports | ✅ Yes |
| Manage users | ✅ Team only |
| Create KB articles | ✅ Yes |

### Inherits from CSM Agent
All CSM Agent permissions plus:

### Table Permissions

#### Customer Case
```
READ:
  ✅ All cases where:
     - assignment_group IN (manager_groups)
     - created_by = current_user
  ✅ Full visibility to team cases

CREATE:
  ✅ Full creation allowed

UPDATE:
  ✅ Can update all team cases
  ✅ All allowed fields from Agent, plus:
     - assigned_to (assign to team members)
     - assignment_group (reassign group)
     - closure_code
     - customer_satisfaction
     - customer_account (can update on creation only)

DELETE:
  ✅ Can delete closed or cancelled cases only
  ❌ Cannot delete open or in_progress cases
  
  Condition: state = "closed" OR state = "cancelled"
```

#### Customer Account
```
READ:
  ✅ Can read all accounts

CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No (CSM Admin only)
```

#### Communication
```
READ:
  ✅ Can read all communications for team cases

CREATE:
  ✅ Can add communications

UPDATE:
  ✅ Can update own communications

DELETE:
  ✅ Can delete own communications
```

#### Knowledge Articles
```
READ:
  ✅ All published articles
  ✅ Own draft articles

CREATE:
  ✅ Can create articles

UPDATE:
  ✅ Can update own articles

DELETE:
  ✅ Can delete own articles
```

#### SLA Policy
```
READ: ✅ Yes
CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

### Special Permissions

**Can Bypass**: Auto-assignment for escalations
```
Normally: Auto-assignment rule applies
Manager: Can manually override and assign directly
```

**Can Delegate**: Case ownership
```
Can transfer cases between team members
Can delegate permissions to trusted agents
```

**Reports Access**:
- Case Volume by Priority ✅
- Agent Workload Distribution ✅
- SLA Compliance Report ✅
- Mean Time to Resolution ✅
- My Cases ✅

### Example Permissions

**Scenario 1: Team Oversight**
```
Manager logs in
  ↓
Can see:
  ✅ All cases assigned to team
  ✅ All cases created by team
  ✅ Cases from all team members
  ✅ Real-time workload of each agent
```

**Scenario 2: Escalation Handling**
```
High-priority case escalated
  ↓
Manager can:
  ✅ Take ownership (assign to themselves)
  ✅ Reassign to senior agent
  ✅ Bypass auto-assignment
  ✅ Change priority/category
  ✅ Add internal notes
  ✅ Update closure information
```

**Scenario 3: Case Closure**
```
Manager finishes case
  ↓
Can change state: → closed
  ✅ Fill closure_code
  ✅ Update customer_satisfaction rating
  ✅ Add resolution notes
  ✅ Then delete (archive) if needed
```

---

## ROLE 3: CSM ADMIN

### Overview
**Role ID**: x_20261805_csm.csm_admin  
**Level**: 4 (System Administrator)  
**Users**: IT administrators, system owners  
**Focus**: System configuration, maintenance, security

### Capabilities Summary

| Capability | Allowed |
|------------|---------|
| Read all data | ✅ Unrestricted |
| Create all data | ✅ Unrestricted |
| Update all data | ✅ Unrestricted |
| Delete all data | ✅ With conditions |
| Manage business rules | ✅ Yes |
| Configure SLA policies | ✅ Yes |
| Manage users & roles | ✅ Yes |
| View audit logs | ✅ Yes |
| System administration | ✅ Full access |

### Inherits from CSM Manager
All CSM Manager permissions plus system-level access

### Table Permissions

#### All Tables
```
Operation: ALL (read, create, update, delete)
Condition: Full unrestricted access
Exceptions: See below
```

#### Customer Case - Exceptions
```
DELETE: ✅ Yes, but:
  - Cannot delete if active cases exist for deletion
  - Soft delete recommended (set to inactive)
```

#### Customer Account - Exceptions
```
DELETE: ✅ Yes, but:
  - Cannot delete if active cases linked
  - Archive instead of delete
```

#### Customer Contact - Exceptions
```
DELETE: ✅ Yes, but:
  - Cannot delete if active cases linked
  - Archive instead of delete
```

#### SLA Policy - Exceptions
```
DELETE: ✅ Yes, but:
  - Cannot delete if policy in use
  - Must deactivate first
```

#### Business Rules
```
READ: ✅ Yes
CREATE: ✅ Yes
UPDATE: ✅ Yes
DELETE: ✅ Yes, but cannot delete active rules
  - Must deactivate first
```

#### System Users
```
READ: ✅ Yes
CREATE: ✅ Yes
UPDATE: ✅ Yes (roles, active status, email, name)
DELETE: ❌ No (deactivate instead)
  - Set active = false instead of deleting
```

### System Configuration Access

Admin can manage:
- Business Rules
- UI Policies
- Client Scripts
- SLA Policies
- Assignment Rules
- Workflow automations
- Email configurations
- Report definitions
- User roles and permissions
- System settings

### Example Permissions

**Scenario 1: New Feature Deployment**
```
Admin needs to add new field to Case table
  ↓
Can:
  ✅ Create new field
  ✅ Create business rule for field
  ✅ Update UI to show field
  ✅ Configure permissions
  ✅ Test in production
```

**Scenario 2: Troubleshooting**
```
Performance issue reported
  ↓
Admin can:
  ✅ View all cases (no restrictions)
  ✅ Check business rules
  ✅ Review audit logs
  ✅ Query database directly
  ✅ Modify system settings
```

**Scenario 3: Data Cleanup**
```
Old test data needs removal
  ↓
Admin can:
  ✅ Query old cases
  ✅ Delete archived cases
  ✅ Archive old accounts
  ✅ Clean up test records
```

---

## ROLE 4: CUSTOMER USER

### Overview
**Role ID**: x_20261805_csm.customer_user  
**Level**: 1 (External User)  
**Users**: External customers, end users  
**Focus**: Portal access, self-service case management

### Capabilities Summary

| Capability | Allowed |
|------------|---------|
| Read own cases | ✅ Yes |
| Create cases | ✅ Yes (portal) |
| Update cases | ❌ No |
| Delete cases | ❌ No |
| View other cases | ❌ No |
| See internal notes | ❌ No |
| Access reports | ❌ No |
| View accounts | ✅ Read-only |

### Table Permissions

#### Customer Case
```
READ:
  ✅ Can only see:
     - Cases they created (created_by = current_user)
     - Cases in their account (customer_account IN user_accounts)
  ✅ Cannot see: Other customers' cases

CREATE:
  ✅ Via service portal only
  ✅ Standard fields only

UPDATE:
  ❌ No direct updates
  ⚠️ Can add communications/comments instead

DELETE:
  ❌ No delete permission

READ-ONLY FIELDS:
  - number
  - state
  - assigned_to
  - assignment_group
  - resolution_notes
  - created_at, updated_at
```

#### Customer Account
```
READ:
  ✅ Can read own account info
  ✅ Allowed fields:
     - name
     - account_type
     - support_tier

CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

#### Customer Contact
```
READ:
  ✅ Can read own contacts
  ✅ Allowed fields:
     - name
     - email
     - phone

CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

#### Communication
```
READ:
  ✅ Can see external communications only
  ❌ Cannot see internal notes

CREATE:
  ✅ Can add comments/messages to own cases

UPDATE: ❌ No
DELETE: ❌ No
```

#### SLA Policy
```
READ: ❌ No
CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

#### Knowledge Articles
```
READ:
  ✅ Published and portal-visible articles only
  ❌ Cannot see draft articles

CREATE: ❌ No
UPDATE: ❌ No
DELETE: ❌ No
```

### Access Control

**Portal Access Only**
```
✅ Can access: Service Portal
❌ Cannot access: Agent workspace
❌ Cannot access: Admin console
❌ Cannot access: Reports
```

**External User Flag**
```
User is marked as external
  ↓
Cannot see any internal CSM data
Cannot escalate cases
Cannot assign cases
Can only communicate via portal
```

### Example Permissions

**Scenario 1: Creating a Case**
```
Customer logs into portal
  ↓
Can:
  ✅ Click "New Case"
  ✅ Fill short description
  ✅ Select priority
  ✅ Attach files
  ✅ Submit
  ↓
Cannot:
  ❌ See case number (not generated yet)
  ❌ Assign to team
  ❌ Change state
```

**Scenario 2: Tracking Case**
```
Customer views case: CSE-1000042
  ↓
Can see:
  ✅ Case number
  ✅ Short description
  ✅ Priority
  ✅ Current state (e.g., "In Progress")
  ✅ Communications from support team
  ❌ Resolution notes (hidden)
  ❌ Internal notes (hidden)
  ❌ Assigned agent name (hidden)
```

**Scenario 3: Adding Communication**
```
Customer wants to provide update
  ↓
Can:
  ✅ Add comment/message to case
  ✅ Attach files
  ✅ Submit
  ↓
All internal users can see:
  ✅ Customer's message
  ✅ Attachments
  ✅ Timestamp
```

---

## ACL RECOMMENDATIONS BY TABLE

### Table 1: Customer Case

**Importance**: ⭐⭐⭐⭐⭐ (Critical)  
**Sensitivity**: High  
**Audit**: Required

#### ACL Rules

```
┌─ CSM Agent Read Access ──────────────────────────┐
│ Condition: assignment_group IN (agent_groups)   │
│        OR assigned_to = current_user             │
│        OR created_by = current_user              │
│ Operation: read                                  │
│ Can Delegate: No                                 │
└──────────────────────────────────────────────────┘

┌─ CSM Agent Create Access ────────────────────────┐
│ Condition: None                                  │
│ Operation: create                                │
│ Can Delegate: No                                 │
└──────────────────────────────────────────────────┘

┌─ CSM Agent Write Access ─────────────────────────┐
│ Condition: assigned_to = current_user            │
│        OR created_by = current_user              │
│ Operation: write                                 │
│ Can Delegate: No                                 │
└──────────────────────────────────────────────────┘

┌─ CSM Manager Read Access ────────────────────────┐
│ Condition: assignment_group IN (manager_groups) │
│        OR created_by = current_user              │
│ Operation: read                                  │
│ Can Delegate: No                                 │
└──────────────────────────────────────────────────┘

┌─ CSM Manager Write Access ───────────────────────┐
│ Condition: assignment_group IN (manager_groups) │
│ Operation: write                                 │
│ Can Delegate: No                                 │
└──────────────────────────────────────────────────┘

┌─ CSM Manager Delete Access ──────────────────────┐
│ Condition: state = "closed" OR                   │
│        state = "cancelled"                       │
│ Operation: delete                                │
│ Can Delegate: No                                 │
│ Purpose: Archive old cases only                  │
└──────────────────────────────────────────────────┘

┌─ CSM Admin Access ───────────────────────────────┐
│ Condition: None (no restrictions)                │
│ Operation: all (read, write, delete)             │
│ Can Delegate: Yes                                │
└──────────────────────────────────────────────────┘

┌─ Customer User Read Access ──────────────────────┐
│ Condition: created_by = current_user             │
│        OR customer_account IN (user_accounts)    │
│ Operation: read                                  │
│ Can Delegate: No                                 │
└──────────────────────────────────────────────────┘

┌─ Customer User Create Access ────────────────────┐
│ Condition: via_service_portal = true             │
│ Operation: create                                │
│ Can Delegate: No                                 │
└──────────────────────────────────────────────────┘
```

#### Field-Level ACLs

```
Field: number (case number)
  CSM Agent:      Read-Only
  CSM Manager:    Read-Only
  CSM Admin:      Read-Only
  Customer User:  Read-Only
  
Field: state
  CSM Agent:      Read-Write
  CSM Manager:    Read-Write
  CSM Admin:      Read-Write
  Customer User:  Read-Only
  
Field: assigned_to
  CSM Agent:      Read-Only
  CSM Manager:    Read-Write
  CSM Admin:      Read-Write
  Customer User:  No Access
  
Field: closure_code
  CSM Agent:      Read-Only
  CSM Manager:    Read-Write
  CSM Admin:      Read-Write
  Customer User:  No Access
  
Field: resolution_notes
  CSM Agent:      Read-Write
  CSM Manager:    Read-Write
  CSM Admin:      Read-Write
  Customer User:  No Access
  
Field: customer_satisfaction
  CSM Agent:      Read-Write
  CSM Manager:    Read-Write
  CSM Admin:      Read-Write
  Customer User:  No Access
```

---

### Table 2: Customer Account

**Importance**: ⭐⭐⭐⭐ (High)  
**Sensitivity**: High - Business data  
**Audit**: Required

#### ACL Rules

```
CSM Agent:
  - Read All (reference data)
  - Cannot create
  - Cannot modify
  - Cannot delete

CSM Manager:
  - Read: account IN (manager_accounts)
  - Write: account IN (manager_accounts)
  - Cannot delete

CSM Admin:
  - Read: All
  - Write: All
  - Delete: Only if no active cases linked
```

#### Field-Level ACLs

```
Field: support_tier
  CSM Agent:      Read-Only
  CSM Manager:    Read-Only
  CSM Admin:      Read-Write
  
Field: financial_data
  CSM Agent:      No Access
  CSM Manager:    Read-Only
  CSM Admin:      Read-Write
```

---

### Table 3: Customer Contact

**Importance**: ⭐⭐⭐ (Medium)  
**Sensitivity**: Medium - Personal data  
**Audit**: Required

#### ACL Rules

```
CSM Agent:
  - Read All
  - Cannot modify

CSM Manager:
  - Read All
  - Write: Allowed
  - Delete: Only if no active cases

CSM Admin:
  - Read: All
  - Write: All
  - Delete: Only if no active cases
```

---

### Table 4: Communication

**Importance**: ⭐⭐⭐⭐ (High)  
**Sensitivity**: Medium - May contain customer data  
**Audit**: Optional

#### ACL Rules

```
CSM Agent:
  - Read: own cases only
  - Create: own cases only
  - Update: own messages only

CSM Manager:
  - Read: all team communications
  - Write: all team communications
  - Delete: own only

CSM Admin:
  - Read: All
  - Write: All
  - Delete: All
```

#### Field-Level ACLs

```
Field: internal_notes
  CSM Agent:      Read-Write
  CSM Manager:    Read-Write
  CSM Admin:      Read-Write
  Customer User:  No Access (hidden)
  
Field: message_body
  CSM Agent:      Read-Write
  CSM Manager:    Read-Write
  CSM Admin:      Read-Write
  Customer User:  Read (visible to portal)
```

---

### Table 5: SLA Policy

**Importance**: ⭐⭐⭐ (Medium)  
**Sensitivity**: Low - System configuration  
**Audit**: Optional

#### ACL Rules

```
CSM Agent:
  - Read Only (reference)
  - Cannot modify
  
CSM Manager:
  - Read Only
  - Cannot modify

CSM Admin:
  - Read: All
  - Write: All
  - Delete: Only if not in use
```

---

### Table 6: Knowledge Articles

**Importance**: ⭐⭐⭐ (Medium)  
**Sensitivity**: Low - Reference material  
**Audit**: Not required

#### ACL Rules

```
CSM Agent:
  - Read: Published articles
  - Cannot write

CSM Manager:
  - Read: All (including drafts)
  - Write: Own articles
  - Delete: Own articles

CSM Admin:
  - Read: All
  - Write: All
  - Delete: All

Customer User:
  - Read: Published articles marked "portal visible"
  - Cannot write
```

---

## SECURITY POLICY DETAILS

### Data Ownership

**Principle**: Users control their own data

```
Agent creates case
  ↓ Case owned by: Agent
  ↓ Can be accessed by:
    ✅ Creating agent
    ✅ Assigned agent(s)
    ✅ Manager of agent's group
    ✅ CSM Admin
    ❌ Other agents
```

**Delegation**:
```
Manager can transfer ownership:
  Manager A → Manager B
  Case CSE-1000042
  
Result:
  Manager B now can:
    ✅ Modify case
    ✅ Reassign to team
    ✅ Update resolution
```

### Field-Level Security

**Auto-Generated Fields** (Read-Only)
- number (case #)
- created_at
- opened_at
- resolved_at
- updated_at

**System Fields** (Admin only)
- sys_id
- sys_created_on
- sys_updated_on

**Sensitive Fields** (Restricted)
- financial_data (Managers+)
- closure_code (Managers+)
- internal_notes (Internal only)

### Audit Requirements

**What to Log**:
```
✅ All read operations on Customer Accounts
✅ All read operations on sensitive fields
✅ All write operations (all tables)
✅ All delete operations (all tables)
✅ All role changes
✅ All permission changes
✅ Failed login attempts
```

**Retention**: Minimum 90 days

**Review**: Monthly by CSM Admin

---

## IMPLEMENTATION CHECKLIST

- [ ] Create 4 roles in ServiceNow
- [ ] Assign users to appropriate roles
- [ ] Create ACL rules for each table
- [ ] Create field ACLs for sensitive fields
- [ ] Test role permissions
- [ ] Configure audit logging
- [ ] Document role assignments
- [ ] Train users on permissions
- [ ] Review security policies monthly

---

## Reports Access Summary

| Report | Agent | Manager | Admin | Customer |
|--------|-------|---------|-------|----------|
| Case Volume | ❌ | ✅ | ✅ | ❌ |
| Workload Distribution | ❌ | ✅ | ✅ | ❌ |
| SLA Compliance | ❌ | ✅ | ✅ | ❌ |
| MTTR | ❌ | ✅ | ✅ | ❌ |
| Customer Satisfaction | ❌ | ✅ | ✅ | ✅ |
| My Cases | ✅ | ✅ | ✅ | ✅ |
| Audit Log | ❌ | ❌ | ✅ | ❌ |

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Created**: May 25, 2026
