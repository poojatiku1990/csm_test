# CSM Demo Data Guide

**Scope**: x_20261805_csm  
**Sample Data Includes**: 5 Accounts, 10 Contacts, 10 Cases  
**Created**: May 26, 2026

---

## Overview

This guide provides comprehensive sample data for demonstrating, testing, and training with the Custom CSM Support Application. The demo dataset includes realistic scenarios across multiple priority levels, case states, and categories.

---

## SAMPLE DATA INVENTORY

### 5 Customer Accounts

| Account | Type | Tier | Industry | Status |
|---------|------|------|----------|--------|
| Acme Corporation | Enterprise | Premium | Technology | Active |
| Global Tech Solutions | Enterprise | Premium | Technology | Active |
| CloudFirst Systems | SMB | Standard | Software | Active |
| StartupHub Inc | Startup | Basic | Fintech | Active |
| Enterprise Solutions LLC | Enterprise | Premium | Finance | Active |

### 10 Customer Contacts

| Contact | Account | Title | Department | Primary |
|---------|---------|-------|------------|---------|
| John Smith | Acme Corporation | IT Manager | IT | ✓ |
| Sarah Johnson | Acme Corporation | Operations Director | Operations | |
| Michael Chen | Global Tech Solutions | Technical Lead | Engineering | ✓ |
| Emily Rodriguez | Global Tech Solutions | Support Coordinator | Support | |
| David Park | CloudFirst Systems | System Administrator | IT | ✓ |
| Lisa Anderson | StartupHub Inc | DevOps Engineer | Engineering | ✓ |
| Thomas Martinez | Enterprise Solutions | CTO | Technology | ✓ |
| Jennifer Lee | Enterprise Solutions | Infrastructure Manager | Operations | |
| Robert Williams | Acme Corporation | Database Administrator | Database | |
| Amanda Foster | CloudFirst Systems | Project Manager | Project Management | |

### 10 Sample Cases

Comprehensive distribution across priorities, states, and categories:

**Case Distribution by Priority**

| Priority | Count | Cases |
|----------|-------|-------|
| 1 - Critical | 2 | CSE-1000001, CSE-1000002 |
| 2 - High | 4 | CSE-1000004, CSE-1000005, CSE-1000008, CSE-1000009 |
| 3 - Medium | 3 | CSE-1000003, CSE-1000006, CSE-1000007 |
| 4 - Low | 1 | CSE-1000010 |

**Case Distribution by State**

| State | Count | Cases |
|-------|-------|-------|
| open | 2 | CSE-1000003, CSE-1000007 |
| in_progress | 4 | CSE-1000001, CSE-1000002, CSE-1000004, CSE-1000009 |
| waiting_on_customer | 1 | CSE-1000006 |
| resolved | 2 | CSE-1000005, CSE-1000008 |
| closed | 1 | CSE-1000010 |

**Case Distribution by Category**

| Category | Count | Case |
|----------|-------|------|
| Performance | 1 | CSE-1000001 |
| Database | 1 | CSE-1000002 |
| Enhancement | 1 | CSE-1000003 |
| Documentation | 1 | CSE-1000004 |
| Bug | 1 | CSE-1000005 |
| Billing | 1 | CSE-1000006 |
| Training | 1 | CSE-1000007 |
| Email | 1 | CSE-1000008 |
| Integration | 1 | CSE-1000009 |
| Maintenance | 1 | CSE-1000010 |

---

## SAMPLE DATA DETAILS

### Account 1: Acme Corporation

```
Name: Acme Corporation
Type: Enterprise
Tier: Premium
Industry: Technology
Location: New York, NY
Revenue: $500M+
Employees: 5000+
Status: Active
Key Details:
  - Key enterprise customer
  - Critical systems
  - Premium support tier
  - Contract: 2020-2025

Contacts: 3
  - John Smith (Primary) - IT Manager
  - Sarah Johnson - Operations Director
  - Robert Williams - Database Administrator

Cases: 2
  - CSE-1000001: System performance degradation (Critical, In Progress)
  - CSE-1000010: Scheduled maintenance (Low, Closed)
```

### Account 2: Global Tech Solutions

```
Name: Global Tech Solutions
Type: Enterprise
Tier: Premium
Industry: Technology
Location: San Francisco, CA
Revenue: $250M+
Employees: 2000+
Status: Active
Key Details:
  - Large account
  - Multiple departments
  - Premium support tier
  - Contract: 2021-2026

Contacts: 2
  - Michael Chen (Primary) - Technical Lead
  - Emily Rodriguez - Support Coordinator

Cases: 2
  - CSE-1000003: MFA feature request (Medium, Open)
  - CSE-1000009: Analytics integration failure (High, In Progress)
```

### Account 3: CloudFirst Systems

```
Name: CloudFirst Systems
Type: SMB
Tier: Standard
Industry: Software
Location: Austin, TX
Revenue: $10M-$50M
Employees: 100-500
Status: Active
Key Details:
  - Growing SMB customer
  - Standard support tier
  - Contract: 2022-2024

Contacts: 2
  - David Park (Primary) - System Administrator
  - Amanda Foster - Project Manager

Cases: 2
  - CSE-1000004: API documentation unclear (High, In Progress)
  - CSE-1000008: Email notifications failing (High, Resolved)
```

### Account 4: StartupHub Inc

```
Name: StartupHub Inc
Type: Startup
Tier: Basic
Industry: Fintech
Location: Seattle, WA
Revenue: $1M-$10M
Employees: 50-100
Status: Active
Key Details:
  - Early-stage startup
  - Basic support tier
  - Cost-sensitive
  - Contract: 2023-2024

Contacts: 1
  - Lisa Anderson (Primary) - DevOps Engineer

Cases: 1
  - CSE-1000005: Profile update bug (High, Resolved)
```

### Account 5: Enterprise Solutions LLC

```
Name: Enterprise Solutions LLC
Type: Enterprise
Tier: Premium
Industry: Finance
Location: Chicago, IL
Revenue: $1B+
Employees: 10000+
Status: Active
Key Details:
  - Flagship customer
  - Mission-critical systems
  - Premium support tier
  - Contract: 2019-2026

Contacts: 2
  - Thomas Martinez (Primary) - CTO
  - Jennifer Lee - Infrastructure Manager

Cases: 2
  - CSE-1000002: Database connection timeout (Critical, In Progress)
  - CSE-1000006: License renewal inquiry (Medium, Waiting)
  - CSE-1000007: Training request (Medium, Open)
```

---

## CASE SCENARIOS

### Case 1: System Performance Degradation

```
Number: CSE-1000001
Title: System experiencing performance degradation during peak hours
Account: Acme Corporation
Contact: John Smith
Priority: 1 - Critical
Impact: 1 - Affects 3-5 departments
Urgency: 1 - Immediate action needed
Category: Performance
State: In Progress
Assigned: Agent Smith, Senior Support Team
Escalated: Yes - Critical impact to production

Scenario:
  - Customer reports significant slowdown during business hours
  - Multiple departments affected
  - Issue started yesterday morning
  - Requires immediate attention
  - Premium tier account

Use for:
  - Testing critical priority workflows
  - Escalation procedures
  - Senior support team assignment
  - Performance monitoring
```

### Case 2: Database Connection Issues

```
Number: CSE-1000002
Title: Database connection timeout errors in production environment
Account: Enterprise Solutions LLC
Contact: Thomas Martinez
Priority: 1 - Critical
Impact: 1 - Affects entire system
Urgency: 1 - Immediate action needed
Category: Database
State: In Progress
Assigned: Agent Johnson, Senior Support Team
Escalated: Yes - Mission-critical system down

Scenario:
  - Intermittent database connection failures
  - Application errors throughout the day
  - No specific pattern identified yet
  - Mission-critical system
  - Flagship customer account

Use for:
  - Testing critical severity handling
  - Expert team assignment
  - Complex troubleshooting workflows
  - Customer communication templates
```

### Case 3: Feature Request

```
Number: CSE-1000003
Title: Feature request: Multi-factor authentication support
Account: Global Tech Solutions
Contact: Michael Chen
Priority: 3 - Medium
Impact: 3 - No impact (enhancement)
Urgency: 3 - Standard timeline
Category: Enhancement
State: Open
Assigned: Unassigned
Escalated: No

Scenario:
  - Customer requesting new security feature
  - Enhancement/feature request
  - No urgent need
  - Needs product evaluation
  - Implementation timeline discussion needed

Use for:
  - Testing feature request workflows
  - Product evaluation processes
  - Capability assessment templates
  - Customer requirement documentation
```

### Case 4: Documentation Issue

```
Number: CSE-1000004
Title: API documentation unclear for OAuth2 implementation
Account: CloudFirst Systems
Contact: David Park
Priority: 2 - High
Impact: 2 - Affects specific functionality
Urgency: 2 - Should address today
Category: Documentation
State: In Progress
Assigned: Agent Lee, Technical Support
Escalated: No

Scenario:
  - Customer struggling with API documentation
  - Outdated examples in docs
  - OAuth2 token refresh issues
  - Developer support needed
  - Documentation improvement opportunity

Use for:
  - Testing technical documentation support
  - Developer enablement workflows
  - Documentation review processes
  - Knowledge transfer scenarios
```

### Case 5: Bug Fix Completed

```
Number: CSE-1000005
Title: Unable to update user profile information
Account: StartupHub Inc
Contact: Lisa Anderson
Priority: 2 - High
Impact: 2 - Affects user functionality
Urgency: 2 - Should address today
Category: Bug
State: Resolved
Assigned: Agent Miller, Technical Support
Resolution: Fixed in Code
Resolution Date: 2026-05-25

Scenario:
  - Product defect found and fixed
  - Database trigger conflict identified
  - Hotfix deployed to production
  - Customer verified fix working
  - Ready for closure

Use for:
  - Testing bug resolution workflows
  - Fix deployment procedures
  - Customer verification processes
  - Resolution documentation
  - Closure procedures
```

### Case 6: License Renewal

```
Number: CSE-1000006
Title: License renewal inquiry for additional seats
Account: Acme Corporation
Contact: Sarah Johnson
Priority: 3 - Medium
Impact: 3 - Business operations
Urgency: 3 - Normal timeline
Category: Billing
State: Waiting on Customer
Assigned: Agent Brown, Sales Support
Escalated: No

Scenario:
  - Customer expanding license seats (50 new users)
  - Pricing and discount inquiry
  - Renewal terms discussion
  - Waiting for customer pricing approval
  - Upsell opportunity

Use for:
  - Testing billing support workflows
  - Sales enablement procedures
  - Pricing calculations
  - Customer negotiation templates
  - Waiting state management
```

### Case 7: Training Request

```
Number: CSE-1000007
Title: Training request: Advanced admin features
Account: Enterprise Solutions LLC
Contact: Jennifer Lee
Priority: 3 - Medium
Impact: 2 - Affects team capability
Urgency: 3 - Normal timeline
Category: Training
State: Open
Assigned: Unassigned
Escalated: No

Scenario:
  - New admin team members need training
  - Advanced features certification requested
  - On-site or virtual training options
  - Instructor coordination needed
  - Skill development initiative

Use for:
  - Testing training request workflows
  - Professional services coordination
  - Customer skill development
  - Training resource allocation
  - Certification tracking
```

### Case 8: Email Configuration Fix

```
Number: CSE-1000008
Title: Email notification not being received from system
Account: CloudFirst Systems
Contact: Amanda Foster
Priority: 2 - High
Impact: 2 - Affects notifications
Urgency: 2 - Should address today
Category: Email
State: Resolved
Assigned: Agent Davis, Technical Support
Resolution: Configuration Fixed
Resolution Date: 2026-05-24

Scenario:
  - Automated email notifications not sending
  - Customer settings verified as correct
  - No spam folder issues
  - System configuration disabled notifications
  - Settings re-enabled successfully
  - All notifications now working

Use for:
  - Testing email system troubleshooting
  - Configuration verification procedures
  - Email troubleshooting templates
  - Customer communication workflows
  - Resolution verification
```

### Case 9: Integration Troubleshooting

```
Number: CSE-1000009
Title: Integration with third-party analytics platform failing
Account: Global Tech Solutions
Contact: Emily Rodriguez
Priority: 2 - High
Impact: 2 - Affects analytics
Urgency: 2 - Should address today
Category: Integration
State: In Progress
Assigned: Agent Wilson, Technical Support
Escalated: No

Scenario:
  - Google Analytics integration failing
  - OAuth API authentication errors (401)
  - Documentation steps followed but still failing
  - Complex troubleshooting required
  - Third-party API coordination needed

Use for:
  - Testing integration troubleshooting
  - Third-party API debugging
  - Authentication error resolution
  - Integration testing procedures
  - Customer technical support
```

### Case 10: Maintenance Completion

```
Number: CSE-1000010
Title: Scheduled maintenance completed successfully
Account: Acme Corporation
Contact: John Smith
Priority: 4 - Low
Impact: 4 - No customer impact (planned)
Urgency: 4 - Routine
Category: Maintenance
State: Closed
Assigned: Agent Garcia, Operations
Resolution: Completed
Resolution Date: 2026-05-21
Satisfaction: 5/5

Scenario:
  - Monthly maintenance window
  - Completed on schedule
  - No customer impact
  - All systems operational post-maintenance
  - Database backups completed
  - Security patches applied
  - Customer satisfied with process

Use for:
  - Testing maintenance procedures
  - Operations workflows
  - Customer satisfaction tracking
  - Scheduled task management
  - Case closure procedures
```

---

## HOW TO USE DEMO DATA

### For Testing

**Purpose**: Test CSM application functionality

**Steps**:
1. Load demo data into development environment
2. Create test cases using sample data
3. Verify workflows execute correctly
4. Validate field calculations
5. Test state transitions
6. Check business rules

**Test Scenarios**:
- [ ] Create new case from demo contact
- [ ] Assign case from demo account
- [ ] Change case state through workflow
- [ ] Update priority and verify recalculation
- [ ] Add communications to case
- [ ] Close case with demo data
- [ ] Verify email notifications
- [ ] Check reporting accuracy

### For Training

**Purpose**: Train users on CSM workflows

**Steps**:
1. Show demo data in training environment
2. Walk through case lifecycle
3. Demonstrate role-based access
4. Show reporting capabilities
5. Practice common workflows

**Training Scenarios**:
- [ ] Agent: Work on assigned case
- [ ] Manager: Review team workload
- [ ] Admin: Create new assignment group
- [ ] Customer: Create case via portal

### For Demonstrations

**Purpose**: Show CSM capabilities to stakeholders

**Features to Demonstrate**:
- [ ] Multiple account types (Enterprise, SMB, Startup)
- [ ] Priority-based case handling
- [ ] Automatic assignment workflow
- [ ] State transitions and business rules
- [ ] Customer communications
- [ ] Reporting and analytics
- [ ] Mobile accessibility
- [ ] Portal customer experience

### For Performance Testing

**Purpose**: Test system performance with realistic data

**Load Testing**:
- Can system handle multiple concurrent users?
- How does case assignment perform at scale?
- Can reports generate with sample data volume?
- Email notification throughput?

**Metrics to Track**:
- Form load time
- Case creation time
- Report generation time
- Assignment time
- Search performance

---

## LOADING DEMO DATA

### Option 1: Manual Creation (Simple)

**Time**: ~30 minutes

**Steps**:
1. Log in to ServiceNow as admin
2. Navigate to each table
3. Click "New"
4. Fill in data from sample_data.ts
5. Save each record
6. Verify relationships

**Best for**: Quick manual testing, small dataset

### Option 2: Bulk Import (Moderate)

**Time**: ~15 minutes

**Steps**:
1. Export sample data to Excel/CSV
2. Map columns to ServiceNow fields
3. Use System Import feature
4. Navigate to: System Import → New
5. Upload file
6. Map fields
7. Execute import

**Best for**: Quick data population, testing imports

### Option 3: Script Execution (Automated)

**Time**: ~5 minutes

**Steps**:
1. Log in to ServiceNow as admin
2. Navigate to: System UI → Execute Script
3. Paste script from DEMO_DATA_LOADER
4. Click "Execute"
5. Verify data loaded
6. Check system logs

**Best for**: Automated, repeatable, all relationships created correctly

---

## DEMO DATA SCRIPT

Copy and paste this script into ServiceNow **System UI → Execute Script**:

```javascript
// CSM Demo Data Loader Script

function loadDemoData() {
  gs.log('=== Starting CSM Demo Data Load ===');
  
  var accountMap = {};
  var contactMap = {};
  
  // Load Accounts
  var accounts = [
    {name: 'Acme Corporation', type: 'Enterprise', tier: 'Premium'},
    {name: 'Global Tech Solutions', type: 'Enterprise', tier: 'Premium'},
    {name: 'CloudFirst Systems', type: 'SMB', tier: 'Standard'},
    {name: 'StartupHub Inc', type: 'Startup', tier: 'Basic'},
    {name: 'Enterprise Solutions LLC', type: 'Enterprise', tier: 'Premium'}
  ];
  
  for (var i = 0; i < accounts.length; i++) {
    var acc = accounts[i];
    var gr = new GlideRecord('x_20261805_csm_customer_account');
    gr.name = acc.name;
    gr.account_type = acc.type;
    gr.support_tier = acc.tier;
    gr.active = true;
    var id = gr.insert();
    accountMap[acc.name] = id;
    gs.log('Created account: ' + acc.name);
  }
  
  // Load Contacts
  var contacts = [
    {name: 'John Smith', email: 'john.smith@acme.com', account: 'Acme Corporation', primary: true},
    {name: 'Sarah Johnson', email: 'sarah.johnson@acme.com', account: 'Acme Corporation', primary: false},
    {name: 'Michael Chen', email: 'michael.chen@globaltechsolutions.com', account: 'Global Tech Solutions', primary: true},
    {name: 'Emily Rodriguez', email: 'emily.r@globaltechsolutions.com', account: 'Global Tech Solutions', primary: false},
    {name: 'David Park', email: 'david.park@cloudfirst.com', account: 'CloudFirst Systems', primary: true},
    {name: 'Lisa Anderson', email: 'lisa.a@startuphub.io', account: 'StartupHub Inc', primary: true},
    {name: 'Thomas Martinez', email: 'thomas.m@entsol.com', account: 'Enterprise Solutions LLC', primary: true},
    {name: 'Jennifer Lee', email: 'jennifer.lee@entsol.com', account: 'Enterprise Solutions LLC', primary: false},
    {name: 'Robert Williams', email: 'robert.w@acme.com', account: 'Acme Corporation', primary: false},
    {name: 'Amanda Foster', email: 'amanda.foster@cloudfirst.com', account: 'CloudFirst Systems', primary: false}
  ];
  
  for (var j = 0; j < contacts.length; j++) {
    var con = contacts[j];
    var gr = new GlideRecord('x_20261805_csm_customer_contact');
    gr.name = con.name;
    gr.email = con.email;
    gr.customer_account = accountMap[con.account];
    gr.is_primary_contact = con.primary;
    var id = gr.insert();
    contactMap[con.name] = id;
    gs.log('Created contact: ' + con.name);
  }
  
  // Load Cases
  var cases = [
    {desc: 'System performance degradation', account: 'Acme Corporation', contact: 'John Smith', priority: 1, state: 'in_progress', category: 'Performance'},
    {desc: 'Database connection timeout errors', account: 'Enterprise Solutions LLC', contact: 'Thomas Martinez', priority: 1, state: 'in_progress', category: 'Database'},
    {desc: 'Feature request: MFA support', account: 'Global Tech Solutions', contact: 'Michael Chen', priority: 3, state: 'open', category: 'Enhancement'},
    {desc: 'API documentation unclear', account: 'CloudFirst Systems', contact: 'David Park', priority: 2, state: 'in_progress', category: 'Documentation'},
    {desc: 'Unable to update profile', account: 'StartupHub Inc', contact: 'Lisa Anderson', priority: 2, state: 'resolved', category: 'Bug'},
    {desc: 'License renewal inquiry', account: 'Acme Corporation', contact: 'Sarah Johnson', priority: 3, state: 'waiting_on_customer', category: 'Billing'},
    {desc: 'Training request: Admin features', account: 'Enterprise Solutions LLC', contact: 'Jennifer Lee', priority: 3, state: 'open', category: 'Training'},
    {desc: 'Email notifications not received', account: 'CloudFirst Systems', contact: 'Amanda Foster', priority: 2, state: 'resolved', category: 'Email'},
    {desc: 'Analytics integration failing', account: 'Global Tech Solutions', contact: 'Emily Rodriguez', priority: 2, state: 'in_progress', category: 'Integration'},
    {desc: 'Maintenance completed', account: 'Acme Corporation', contact: 'John Smith', priority: 4, state: 'closed', category: 'Maintenance'}
  ];
  
  for (var k = 0; k < cases.length; k++) {
    var cse = cases[k];
    var gr = new GlideRecord('x_20261805_csm_customer_case');
    gr.short_description = cse.desc;
    gr.customer_account = accountMap[cse.account];
    gr.customer_contact = contactMap[cse.contact];
    gr.priority = cse.priority;
    gr.state = cse.state;
    gr.category = cse.category;
    gr.impact = cse.priority;
    gr.urgency = cse.priority;
    gr.insert();
    gs.log('Created case: ' + cse.desc);
  }
  
  gs.log('=== CSM Demo Data Load Complete ===');
  gs.log('Loaded: ' + accounts.length + ' accounts, ' + contacts.length + ' contacts, ' + cases.length + ' cases');
}

// Execute
loadDemoData();
```

### Verification Checklist

After loading demo data:

- [ ] 5 accounts created
  - [ ] Acme Corporation (Enterprise)
  - [ ] Global Tech Solutions (Enterprise)
  - [ ] CloudFirst Systems (SMB)
  - [ ] StartupHub Inc (Startup)
  - [ ] Enterprise Solutions LLC (Enterprise)

- [ ] 10 contacts created
  - [ ] 5 primary contacts (1 per account, except 1 account)
  - [ ] 5 secondary contacts
  - [ ] All linked to correct accounts

- [ ] 10 cases created
  - [ ] 2 Priority 1 (Critical)
  - [ ] 4 Priority 2 (High)
  - [ ] 3 Priority 3 (Medium)
  - [ ] 1 Priority 4 (Low)
  - [ ] 2 Open
  - [ ] 4 In Progress
  - [ ] 1 Waiting on Customer
  - [ ] 2 Resolved
  - [ ] 1 Closed

- [ ] Business rules executed
  - [ ] Case numbers generated (CSE-XXXXXXX)
  - [ ] States set correctly
  - [ ] Priorities calculated correctly
  - [ ] Auto-assignment applied

- [ ] Reports reflect sample data
  - [ ] Case volume by priority
  - [ ] Cases by state
  - [ ] Cases by account

---

## RESETTING DEMO DATA

To remove demo data and start fresh:

```javascript
// DANGER: This will delete ALL data - use carefully!

function resetDemoData() {
  var gr = new GlideRecord('x_20261805_csm_customer_case');
  gr.deleteMultiple();
  
  var gr2 = new GlideRecord('x_20261805_csm_customer_contact');
  gr2.deleteMultiple();
  
  var gr3 = new GlideRecord('x_20261805_csm_customer_account');
  gr3.deleteMultiple();
  
  gs.log('Demo data reset complete');
}

// Execute
resetDemoData();
```

---

## DEMO SCENARIOS FOR PRESENTATIONS

### Scenario 1: Creating a New Case (5 minutes)

**Setup**: Demo account "Acme Corporation" open

**Demo Flow**:
1. Click "New Case"
2. Select: Account = Acme Corporation
3. Select: Contact = John Smith
4. Enter: Description = "System is running slow"
5. Set: Priority = 1
6. Click: Save
7. Show: Auto-generated case number CSE-XXXXXXX
8. Explain: Auto-assignment to Senior Support Team

**Talking Points**:
- "Customers can create cases through portal"
- "Case numbers auto-generated"
- "Intelligent assignment based on priority"
- "Team can immediately see new case"

### Scenario 2: Managing Team Workload (5 minutes)

**Setup**: Demo agent dashboard open with sample cases

**Demo Flow**:
1. Show: Open cases for support team
2. Filter: By priority (show Critical cases first)
3. Show: Case assignments
4. Click: One high-priority case
5. Show: Case details and communications
6. Explain: Manager oversight capabilities

**Talking Points**:
- "Managers see all team cases"
- "Can reassign if needed"
- "SLA compliance tracked"
- "Easy workload balancing"

### Scenario 3: Resolving a Customer Issue (5 minutes)

**Setup**: Case CSE-1000005 (bug) in resolved state

**Demo Flow**:
1. Show: Case details
2. Show: Issue description and timeline
3. Show: Resolution notes
4. Show: Communications with customer
5. Explain: Case closure process
6. Show: Customer satisfaction rating

**Talking Points**:
- "Complete audit trail of case"
- "All communications documented"
- "Resolution tracked for compliance"
- "Customer feedback captured"

### Scenario 4: Reporting and Analytics (5 minutes)

**Setup**: Reports dashboard open

**Demo Flow**:
1. Show: "Cases by Priority" report
2. Show: "Cases by State" report
3. Show: "MTTR (Mean Time to Resolution)"
4. Show: "SLA Compliance" report
5. Explain: Data-driven insights

**Talking Points**:
- "Real-time dashboard"
- "Track team performance"
- "Identify bottlenecks"
- "Manage SLA compliance"
- "Data export for analysis"

---

## DEMO DATA STATISTICS

```
Total Records: 25

Accounts: 5 (5 types)
  - Enterprise: 3
  - SMB: 1
  - Startup: 1

Contacts: 10 (2 per account avg)
  - Primary: 5
  - Secondary: 5

Cases: 10 (2 per account avg)

Priority Distribution:
  - Critical (1): 20%
  - High (2): 40%
  - Medium (3): 30%
  - Low (4): 10%

State Distribution:
  - Open: 20%
  - In Progress: 40%
  - Waiting: 10%
  - Resolved: 20%
  - Closed: 10%

Category Coverage: 10 categories (1 per case)

Time Span: May 20-26, 2026 (6 days)

Average Case Age: 2.5 days

Escalation Rate: 20% (2 of 10 cases)
```

---

**Version**: 1.0.0  
**Status**: ✅ Ready to Use  
**Created**: May 26, 2026
