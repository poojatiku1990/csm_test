# Roles & ACLs Quick Reference

**Scope**: x_20261805_csm  
**4 Roles × 6 Tables = 24 Primary ACLs**  
**Status**: ✅ Production Ready

---

## Four-Role Model at a Glance

```
┌───────────────────────────────────────────────────┐
│ CSM_ADMIN (Level 4)                               │
│ - Full system access                              │
│ - Can manage everything                           │
│ - No restrictions                                 │
└───────────────────────────────────────────────────┘
                        ▲
                        │ inherits
                        │
┌───────────────────────────────────────────────────┐
│ CSM_MANAGER (Level 3)                             │
│ - Team management                                 │
│ - Can manage team cases                           │
│ - Can delete closed cases                         │
│ - Can view reports                                │
└───────────────────────────────────────────────────┘
                        ▲
                        │ inherits
                        │
┌───────────────────────────────────────────────────┐
│ CSM_AGENT (Level 2)                               │
│ - Case handling                                   │
│ - Own cases only                                  │
│ - No deletion                                     │
│ - No team management                              │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│ CUSTOMER_USER (Level 1)                           │
│ - External user (no inheritance)                  │
│ - Portal access only                              │
│ - Own cases only                                  │
│ - Read-only mostly                                │
└───────────────────────────────────────────────────┘
```

---

## Permission Matrix by Table

### Customer Case

```
                Agent    Manager  Admin    Customer
┌────────────────────────────────────────────────┐
│ Read     │ ✓ Own    │ ✓ Team   │ ✓ All    │ ✓ Own    │
│ Create   │ ✓ Yes    │ ✓ Yes    │ ✓ Yes    │ ✓ Portal │
│ Update   │ ✓ Own    │ ✓ Team   │ ✓ All    │ ✗ No     │
│ Delete   │ ✗ No     │ ✓ Closed │ ✓ All    │ ✗ No     │
└────────────────────────────────────────────────┘
```

### Customer Account

```
                Agent    Manager  Admin    Customer
┌────────────────────────────────────────────────┐
│ Read     │ ✓ All    │ ✓ All    │ ✓ All    │ ✓ Own    │
│ Create   │ ✗ No     │ ✗ No     │ ✓ Yes    │ ✗ No     │
│ Update   │ ✗ No     │ ✓ Yes    │ ✓ Yes    │ ✗ No     │
│ Delete   │ ✗ No     │ ✗ No     │ ✓ No act │ ✗ No     │
└────────────────────────────────────────────────┘
```

### Customer Contact

```
                Agent    Manager  Admin    Customer
┌────────────────────────────────────────────────┐
│ Read     │ ✓ All    │ ✓ All    │ ✓ All    │ ✓ Own    │
│ Create   │ ✗ No     │ ✗ No     │ ✓ Yes    │ ✗ No     │
│ Update   │ ✗ No     │ ✓ Yes    │ ✓ Yes    │ ✗ No     │
│ Delete   │ ✗ No     │ ✗ No     │ ✓ No act │ ✗ No     │
└────────────────────────────────────────────────┘
```

### Communication

```
                Agent    Manager  Admin    Customer
┌────────────────────────────────────────────────┐
│ Read     │ ✓ Own    │ ✓ Team   │ ✓ All    │ ✓ Own    │
│ Create   │ ✓ Own    │ ✓ Yes    │ ✓ Yes    │ ✓ Own    │
│ Update   │ ✓ Own    │ ✓ Own    │ ✓ All    │ ✗ No     │
│ Delete   │ ✗ No     │ ✓ Own    │ ✓ All    │ ✗ No     │
└────────────────────────────────────────────────┘
```

### SLA Policy

```
                Agent    Manager  Admin    Customer
┌────────────────────────────────────────────────┐
│ Read     │ ✓ Only   │ ✓ Only   │ ✓ All    │ ✗ No     │
│ Create   │ ✗ No     │ ✗ No     │ ✓ Yes    │ ✗ No     │
│ Update   │ ✗ No     │ ✗ No     │ ✓ Yes    │ ✗ No     │
│ Delete   │ ✗ No     │ ✗ No     │ ✓ Active │ ✗ No     │
└────────────────────────────────────────────────┘
```

### Knowledge Articles

```
                Agent         Manager       Admin       Customer
┌────────────────────────────────────────────────────┐
│ Read     │ ✓ Pub    │ ✓ All    │ ✓ All    │ ✓ Portal │
│ Create   │ ✗ No     │ ✓ Yes    │ ✓ Yes    │ ✗ No     │
│ Update   │ ✗ No     │ ✓ Own    │ ✓ All    │ ✗ No     │
│ Delete   │ ✗ No     │ ✓ Own    │ ✓ All    │ ✗ No     │
└────────────────────────────────────────────────────┘
```

---

## ACL Conditions Summary

### For CSM Agent

```
Read Cases:
  WHERE assigned_to = current_user
     OR created_by = current_user
     OR assignment_group IN (agent_groups)

Update Cases:
  WHERE assigned_to = current_user
     OR created_by = current_user

Delete Cases:
  [NO ACCESS]
```

### For CSM Manager

```
Read Cases:
  WHERE assignment_group IN (manager_groups)
     OR created_by = current_user

Update Cases:
  WHERE assignment_group IN (manager_groups)

Delete Cases:
  WHERE state = 'closed'
     OR state = 'cancelled'
```

### For CSM Admin

```
All Operations:
  [NO RESTRICTIONS]
  Exceptions:
    - Cannot delete users
    - Cannot delete active business rules
    - Cannot delete active SLA policies
```

### For Customer User

```
Read Cases:
  WHERE created_by = current_user
     OR customer_account IN (user_accounts)

Create Cases:
  WHERE source = 'service_portal'

Update Cases:
  [NO ACCESS]

Delete Cases:
  [NO ACCESS]
```

---

## Field-Level ACLs

### Customer Case - Read Access

```
Field          Agent  Manager  Admin  Customer
─────────────────────────────────────────────
number          ✓      ✓       ✓      ✓
state           ✓      ✓       ✓      ✓
assigned_to     ✓      ✓       ✓      ✗
assignment_group ✓     ✓       ✓      ✗
created_at      ✓      ✓       ✓      ✓
opened_at       ✓      ✓       ✓      ✓
resolved_at     ✓      ✓       ✓      ✗
resolution_code ✓      ✓       ✓      ✗
resolution_notes ✓     ✓       ✓      ✗
closure_code    ✓      ✓       ✓      ✗
customer_satisfaction ✓ ✓     ✓      ✗
```

### Customer Case - Write Access

```
Field          Agent  Manager  Admin  Customer
─────────────────────────────────────────────
number          ✗      ✗       ✗      ✗
state           ✓      ✓       ✓      ✗
assigned_to     ✗      ✓       ✓      ✗
assignment_group ✗     ✓       ✓      ✗
created_at      ✗      ✗       ✗      ✗
opened_at       ✗      ✗       ✗      ✗
resolved_at     ✗      ✗       ✓      ✗
resolution_code ✓      ✓       ✓      ✗
resolution_notes ✓     ✓       ✓      ✗
closure_code    ✗      ✓       ✓      ✗
customer_satisfaction ✓ ✓     ✓      ✗
```

---

## Common Workflows & Permissions

### Create & Assign Case

```
Agent creates case
  ✓ Can create new case
  ✓ Auto-number generated
  ✗ Cannot assign (auto-assigned)

Manager can override
  ✓ Can manually assign to team member
  ✓ Can reassign anytime
  ✓ Can assign to different group
```

### Work on Case

```
Agent works on assigned case
  ✓ Can read case
  ✓ Can update state
  ✓ Can update resolution_notes
  ✓ Can add communications
  ✗ Cannot reassign
  ✗ Cannot close (manager only)

Manager supervises
  ✓ Can see all team's work
  ✓ Can help complete cases
  ✓ Can override assignments
  ✓ Can close cases
```

### Close Case

```
Prerequisites:
  ✓ State must be "resolved" or "in_progress"
  ✓ All mandatory fields filled

Manager only:
  ✓ Can change state to "closed"
  ✓ Must fill closure_code
  ✓ Must fill customer_satisfaction
  ✓ Can then delete (archive)
```

### View Reports

```
Agent: No access
  ✗ Cannot view any reports

Manager: Full access
  ✓ Case Volume
  ✓ SLA Compliance
  ✓ MTTR
  ✓ Customer Satisfaction
  ✓ My Cases

Admin: Full access
  ✓ All manager reports
  ✓ Audit Logs
  ✓ System Reports

Customer: Limited
  ✓ My Cases only
  ✓ Satisfaction ratings
  ✗ Team reports
```

---

## Role Assignment Decision Tree

```
Does user need to work on cases?
  ├─ NO → Skip to next question
  └─ YES → Is user external?
      ├─ YES → Assign: CUSTOMER_USER
      └─ NO → Is user a manager?
          ├─ YES → Assign: CSM_MANAGER
          └─ NO → Assign: CSM_AGENT

Does user need system access?
  ├─ NO → Done
  └─ YES → Is user IT staff?
      └─ YES → Assign: CSM_ADMIN
```

---

## Quick Permission Lookup

### "Can I...?"

```
I'm an Agent. Can I...

...read my cases?
  ✓ YES

...read other agent's cases?
  ✗ NO

...delete a case?
  ✗ NO

...assign a case?
  ✗ NO

...view reports?
  ✗ NO


I'm a Manager. Can I...

...read all team cases?
  ✓ YES

...assign cases to team members?
  ✓ YES

...delete a closed case?
  ✓ YES

...modify SLA policies?
  ✗ NO

...view reports?
  ✓ YES


I'm an Admin. Can I...

...do anything?
  ✓ YES (with noted exceptions)

...delete users?
  ✗ NO (deactivate instead)

...bypass business rules?
  ✓ YES

...access audit logs?
  ✓ YES


I'm a Customer. Can I...

...create a case?
  ✓ YES (via portal)

...read my cases?
  ✓ YES

...see internal notes?
  ✗ NO

...modify a case?
  ✗ NO

...view satisfaction rating?
  ✓ YES
```

---

## Access Denied Troubleshooting

### Agent gets "Access Denied" on case

**Check**:
1. Case assigned to you?
   - ✓ No → Ask manager to assign
2. Case created by you?
   - ✓ No → Ask manager to check
3. Are you in correct group?
   - ✓ No → Update group membership

### Manager gets "Access Denied"

**Check**:
1. Case in your team?
   - ✓ No → Ask admin
2. Are you set as group manager?
   - ✓ No → Ask admin to configure
3. Is manager role assigned?
   - ✓ No → Ask admin

### Customer gets "Access Denied"

**Check**:
1. Case created by you?
   - ✓ No → Create new case
2. Linked to account?
   - ✓ No → Ask admin to link
3. Account has cases?
   - ✓ No → Create new case

---

## Table ACL Creation Checklist

```
Customer Case:
  ☐ Agent Read      [own + assigned + group]
  ☐ Agent Create    [all]
  ☐ Agent Write     [own + assigned]
  ☐ Manager Read    [team]
  ☐ Manager Write   [team]
  ☐ Manager Delete  [closed/cancelled]
  ☐ Admin All       [unrestricted]
  ☐ Customer Read   [own]
  ☐ Customer Create [portal]

Customer Account:
  ☐ Agent Read      [all read-only]
  ☐ Manager Write   [all]
  ☐ Admin All       [all]
  ☐ Customer Read   [own]

Customer Contact:
  ☐ Agent Read      [all read-only]
  ☐ Manager Write   [all]
  ☐ Admin All       [all]
  ☐ Customer Read   [own]

Communication:
  ☐ Agent Read/Create [own cases]
  ☐ Manager All      [team]
  ☐ Admin All        [all]
  ☐ Customer Read    [own external]

SLA Policy:
  ☐ Agent Read       [read-only]
  ☐ Manager Read     [read-only]
  ☐ Admin All        [all]

Knowledge Articles:
  ☐ Agent Read       [published]
  ☐ Manager All      [own + admin]
  ☐ Admin All        [all]
  ☐ Customer Read    [portal visible]
```

---

## Testing Checklist (Quick)

For each role:

**Agent**:
- [ ] Can read own cases
- [ ] Cannot read others' cases
- [ ] Can create cases
- [ ] Cannot delete cases
- [ ] Cannot see reports

**Manager**:
- [ ] Can read team cases
- [ ] Can assign cases
- [ ] Can delete closed cases
- [ ] Can view reports
- [ ] Cannot delete active rules

**Admin**:
- [ ] Can access everything
- [ ] Can modify business rules
- [ ] Cannot delete users
- [ ] Can view audit logs

**Customer**:
- [ ] Can create cases (portal)
- [ ] Can read own cases
- [ ] Cannot modify cases
- [ ] Cannot see internal notes
- [ ] Cannot access agent workspace

---

## Standard Configuration

Ready-to-deploy defaults:

```
Scope: x_20261805_csm

Roles (4):
  1. csm_agent
  2. csm_manager (inherits csm_agent)
  3. csm_admin (inherits csm_manager)
  4. customer_user (standalone)

ACLs per role:
  - 9 table-level rules
  - 6 field-level rules
  Total: ~30 ACLs

Conditions:
  - User-based (gs.getUserID())
  - Group-based (manager_groups)
  - Status-based (state = 'closed')
  - Source-based (via_service_portal)

Audit:
  - All tables audited
  - 90-day retention
  - Monthly review
```

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: May 25, 2026
