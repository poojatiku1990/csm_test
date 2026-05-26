# CSM Demo Data Quick Reference

**Scope**: x_20261805_csm  
**Last Updated**: May 26, 2026

---

## QUICK LOOKUP TABLES

### Accounts at a Glance

```
┌─────────────────────────────────┬──────────────┬────────┬─────────┐
│ Account Name                    │ Type         │ Tier   │ Cases   │
├─────────────────────────────────┼──────────────┼────────┼─────────┤
│ Acme Corporation                │ Enterprise   │ Premium│ 2       │
│ Global Tech Solutions           │ Enterprise   │ Premium│ 2       │
│ CloudFirst Systems              │ SMB          │ Standard│ 2      │
│ StartupHub Inc                  │ Startup      │ Basic  │ 1       │
│ Enterprise Solutions LLC        │ Enterprise   │ Premium│ 3       │
└─────────────────────────────────┴──────────────┴────────┴─────────┘
```

### Cases by Priority

```
CRITICAL (P1) - 2 cases:
  CSE-1000001  Acme Corporation         Performance degradation
  CSE-1000002  Enterprise Solutions     Database connection timeout

HIGH (P2) - 4 cases:
  CSE-1000004  CloudFirst Systems       API documentation unclear
  CSE-1000005  StartupHub Inc           Profile update bug
  CSE-1000008  CloudFirst Systems       Email notifications
  CSE-1000009  Global Tech Solutions    Analytics integration

MEDIUM (P3) - 3 cases:
  CSE-1000003  Global Tech Solutions    MFA feature request
  CSE-1000006  Acme Corporation         License renewal
  CSE-1000007  Enterprise Solutions     Training request

LOW (P4) - 1 case:
  CSE-1000010  Acme Corporation         Maintenance completed
```

### Cases by State

```
OPEN - 2 cases:
  CSE-1000003  Enhancement request
  CSE-1000007  Training request

IN PROGRESS - 4 cases:
  CSE-1000001  Performance issue
  CSE-1000002  Database issue
  CSE-1000004  Documentation issue
  CSE-1000009  Integration issue

WAITING - 1 case:
  CSE-1000006  License renewal

RESOLVED - 2 cases:
  CSE-1000005  Bug fix (Profile update)
  CSE-1000008  Email notifications

CLOSED - 1 case:
  CSE-1000010  Maintenance
```

### Cases by Category

```
Performance       CSE-1000001
Database          CSE-1000002
Enhancement       CSE-1000003
Documentation     CSE-1000004
Bug               CSE-1000005
Billing           CSE-1000006
Training          CSE-1000007
Email             CSE-1000008
Integration       CSE-1000009
Maintenance       CSE-1000010
```

---

## CONTACT DIRECTORY

| Name | Account | Email | Title | Primary |
|------|---------|-------|-------|---------|
| John Smith | Acme | john.smith@acme.com | IT Manager | ✓ |
| Sarah Johnson | Acme | sarah.johnson@acme.com | Operations Director | |
| Michael Chen | Global Tech | michael.chen@globaltechsolutions.com | Technical Lead | ✓ |
| Emily Rodriguez | Global Tech | emily.r@globaltechsolutions.com | Support Coord. | |
| David Park | CloudFirst | david.park@cloudfirst.com | Sys Admin | ✓ |
| Lisa Anderson | StartupHub | lisa.a@startuphub.io | DevOps Engineer | ✓ |
| Thomas Martinez | Enterprise Sol. | thomas.m@entsol.com | CTO | ✓ |
| Jennifer Lee | Enterprise Sol. | jennifer.lee@entsol.com | Infra Manager | |
| Robert Williams | Acme | robert.w@acme.com | DBA | |
| Amanda Foster | CloudFirst | amanda.foster@cloudfirst.com | PM | |

---

## TEST DATA QUERIES

### Find All Critical Cases
```
Case number starts with CSE-1000001 or CSE-1000002
Expected: 2 results
```

### Find Unassigned Cases
```
Priority = 3 AND State = open
Expected: CSE-1000003, CSE-1000007 (2 cases)
```

### Find Cases by Acme Corporation
```
Account = Acme Corporation
Expected: CSE-1000001, CSE-1000006, CSE-1000010 (3 cases)
```

### Find Cases Assigned to Senior Support Team
```
Assignment Group = Senior Support Team
Expected: CSE-1000001, CSE-1000002 (2 cases - both P1)
```

### Find Resolved Cases
```
State = resolved
Expected: CSE-1000005, CSE-1000008 (2 cases)
```

### Find Open Cases
```
State = open
Expected: CSE-1000003, CSE-1000007 (2 cases)
```

### Find In-Progress Cases
```
State = in_progress
Expected: CSE-1000001, CSE-1000002, CSE-1000004, CSE-1000009 (4 cases)
```

---

## TESTING WORKFLOWS

### Test: Create New Case
```
1. Click New Case
2. Account: Select "Acme Corporation"
3. Contact: Select "John Smith"
4. Priority: Select "2"
5. Description: Enter test description
6. Submit
✓ Case number auto-generated (CSE-XXXXXXX)
✓ Business rule sets default state = "new"
✓ Priority recalculated
```

### Test: Assign Case
```
1. Open case CSE-1000003 (unassigned)
2. Assignment Group: Select "Technical Support"
3. Save
✓ Case assigned to next available agent
✓ Agent notified
✓ Assignment timestamp recorded
```

### Test: Change Priority
```
1. Open case CSE-1000003
2. Priority: Change from 3 to 1
3. Save
✓ Impact/Urgency updated
✓ SLA updated
✓ Escalation triggered
```

### Test: Resolve Case
```
1. Open case CSE-1000005 (already resolved)
2. Note: Shows resolution info
✓ Resolution notes mandatory when state = resolved
✓ Resolution date recorded
✓ Ready for closure
```

### Test: Close Case
```
1. Open case CSE-1000010 (closed)
2. Review: Full case history visible
✓ Closure code visible
✓ Customer satisfaction recorded
✓ Case archived properly
```

---

## ASSIGNMENT GROUPS

| Group | Members | Queue Type | Tier | Cases |
|-------|---------|------------|------|-------|
| Senior Support Team | Agent Smith, Agent Johnson | Priority | Premium | 2 |
| Technical Support | Agent Lee, Miller, Davis, Wilson | Round Robin | Standard | 4 |
| Sales Support | Agent Brown | Priority | Standard | 1 |
| Operations | Agent Garcia | FIFO | Standard | 1 |

---

## COMMON QUERIES FOR TESTING

### Report: Cases by Priority
```
Query: Select all cases, group by priority, count
Expected Result:
  P1: 2 cases (20%)
  P2: 4 cases (40%)
  P3: 3 cases (30%)
  P4: 1 case (10%)
```

### Report: Cases by State
```
Query: Select all cases, group by state, count
Expected Result:
  Open: 2 cases (20%)
  In Progress: 4 cases (40%)
  Waiting: 1 case (10%)
  Resolved: 2 cases (20%)
  Closed: 1 case (10%)
```

### Report: Cases by Account
```
Query: Select all cases, group by account, count
Expected Result:
  Acme Corporation: 3 cases
  Global Tech: 2 cases
  CloudFirst: 2 cases
  StartupHub: 1 case
  Enterprise Sol: 2 cases
```

### Report: Open Case Queue
```
Query: State = open OR state = new, ordered by priority
Expected Result:
  CSE-1000003 (P3, Enhancement)
  CSE-1000007 (P3, Training)
```

### Report: Agent Workload
```
Query: Group by assigned_to, count cases
Expected Result:
  Agent Smith: 1 case
  Agent Johnson: 1 case
  Agent Lee: 1 case
  Agent Miller: 1 case
  Agent Davis: 1 case
  Agent Wilson: 1 case
  Unassigned: 4 cases
```

---

## DEMO SCRIPTS (Copy-Paste Ready)

### Load Demo Data
```javascript
// Run in: System UI → Execute Script

function loadDemoData() {
  gs.log('Starting CSM Demo Load');
  
  // Create accounts
  var acc1 = new GlideRecord('x_20261805_csm_customer_account');
  acc1.name = 'Acme Corporation';
  acc1.account_type = 'Enterprise';
  acc1.support_tier = 'Premium';
  acc1.insert();
  
  gs.log('Demo data load complete');
}

loadDemoData();
```

### Find Case by Number
```javascript
var gr = new GlideRecord('x_20261805_csm_customer_case');
gr.addQuery('number', 'CSE-1000001');
gr.query();

if (gr.next()) {
  gs.log('Case: ' + gr.short_description);
  gs.log('Priority: ' + gr.priority);
  gs.log('State: ' + gr.state);
}
```

### List All Unassigned Cases
```javascript
var gr = new GlideRecord('x_20261805_csm_customer_case');
gr.addQuery('assigned_to', 'EMPTY');
gr.orderBy('priority');
gr.query();

while (gr.next()) {
  gs.log(gr.number + ' - ' + gr.short_description);
}
```

### Update Case Priority
```javascript
var gr = new GlideRecord('x_20261805_csm_customer_case');
gr.get('number', 'CSE-1000003');
gr.priority = 1;
gr.update();
gs.log('Priority updated');
```

---

## QUICK FACTS

**Total Records**: 25  
**Accounts**: 5  
**Contacts**: 10  
**Cases**: 10  
**Priority Distribution**: 20% P1, 40% P2, 30% P3, 10% P4  
**State Distribution**: 40% In Progress, 20% Open, 20% Resolved, 10% Waiting, 10% Closed  
**Critical Cases**: 2 (both in progress)  
**Unassigned Cases**: 4  
**Resolved/Closed**: 3  
**Time Period**: May 20-26, 2026  

---

## LINKS TO FULL DOCUMENTATION

- [Complete Demo Data Guide](DEMO_DATA_GUIDE.md) - Full reference with all details
- [Sample Data TypeScript](src/servicenow/demoData/csm_sample_data.ts) - Source code and export objects

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Scope**: x_20261805_csm
