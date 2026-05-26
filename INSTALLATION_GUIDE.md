# Custom CSM Support App - Installation & Deployment Guide

## Overview

This document provides comprehensive instructions for deploying the "Custom CSM Support App" - a complete Customer Service Management solution for ServiceNow that includes:

- **Customer Case Intake** - Submit and manage customer support cases
- **Case Assignment** - Automatic intelligent routing based on priority and category
- **Case Status Tracking** - Real-time visibility into case lifecycle
- **SLA Tracking** - Automatic SLA policy attachment and monitoring
- **Customer Communication** - Integrated notes, comments, and notifications
- **Resolution & Closure** - Structured workflows for case resolution and feedback

## Prerequisites

### ServiceNow Instance Requirements
- **ServiceNow Version**: Paris (Washington, Utah, or newer recommended)
- **Scope**: x_20261805_csm (Customer Service Management)
- **Update Sets**: None required (uses scoped application best practices)

### Required Roles
- **sys_admin** or higher to deploy the application
- **csm_admin** to manage CSM configurations (created during setup)

### Development Environment
- Node.js 16+ (for local development)
- @servicenow/sdk v4.6.1+
- TypeScript 5.5+

## Installation Steps

### Step 1: Create Application Scope

1. Navigate to **System Definition > Application** in ServiceNow
2. Create new application:
   - **Name**: Custom CSM Support App
   - **Scope**: x_20261805_csm
   - **Description**: Complete Customer Service Management solution
   - **Public**: No (scoped application)

### Step 2: Create Required Tables

#### Customer Case Table (x_20261805_csm_customer_case)

```sql
-- Table extends Task table for workflow capabilities
Parent Table: task
Table Name: x_20261805_csm_customer_case
Display Name: Customer Case
Plural: Customer Cases
```

**Custom Fields** (see [customer_case_table.ts](src/servicenow/tables/customer_case_table.ts)):

| Field Name | Type | Required | Default |
|-----------|------|----------|---------|
| customer | Reference (Account) | Yes | |
| customer_contact | Reference (Contact) | Yes | |
| customer_email | Email | Yes | |
| customer_phone | Phone | No | |
| category | Choice | Yes | Other |
| subcategory | String | No | |
| sla_policy | Reference (SLA) | No | |
| resolution_code | Choice | No | |
| resolution_notes | Text | No | |
| is_escalated | Boolean | No | false |
| escalation_reason | Text | No | |
| customer_satisfaction | Choice | No | |
| feedback_provided | Boolean | No | false |

### Step 3: Create Supporting Tables

Create the following tables in your scope:

```
- x_20261805_csm_assignment_log      (Log assignment actions)
- x_20261805_csm_communication_log   (Log customer communications)
- x_20261805_csm_routing_log         (Log case routing decisions)
- x_20261805_csm_sla_policy          (Custom SLA policies)
- x_20261805_csm_resolution_log      (Log case resolutions)
- x_20261805_csm_reopening_log       (Log case reopenings)
- x_20261805_csm_case_archive        (Archive closed cases)
- x_20261805_csm_closure_report      (Closure analytics)
- x_20261805_csm_security_audit      (Security audit trail)
```

### Step 4: Deploy Script Includes

1. **Navigate to**: System Definition > Script Include
2. **Create new Script Include** for each file:

| Script Include Name | Source File |
|-------------------|------------|
| CSMSLAManager | sla_manager.ts |
| CSMCommunicationManager | communication_manager.ts |
| CSMCaseClosureWorkflow | case_closure_workflow.ts |
| CSMSecurityManager | roles_and_security.ts |

**Configuration for each:**
- **Active**: true
- **Accessible from**: All application scopes
- **Copy from**: [ServiceNow Platform]

### Step 5: Create Business Rules

1. **Navigate to**: Service Customization > Business Rules
2. **Create Business Rule**: "Auto Assign Customer Cases"

Configuration:
- **Table**: x_20261805_csm_customer_case
- **When to run**: After insert, After update
- **Filter conditions**: `priority <= '2'`
- **Script**: See [auto_assign_case.ts](src/servicenow/businessRules/auto_assign_case.ts)

### Step 6: Create Client Scripts

1. **Navigate to**: Service Customization > Client Scripts
2. **Create Client Script**: "Validate Case Priority"

Configuration:
- **Table**: x_20261805_csm_customer_case
- **Events**: onLoad, onChange (priority field)
- **Script**: See [validate_case_priority.ts](src/servicenow/clientScripts/validate_case_priority.ts)

### Step 7: Create Flow

1. **Navigate to**: Process Automation > Flow
2. **Create new Flow**: "Route High Priority Customer Case"

Steps:
1. Check priority level (Decision)
2. Route to Senior Team if Priority ≤ 2
3. Route to Category-based Team if Priority > 2
4. Attach SLA Policy (Script Action)
5. Send Assignment Notification (Send Email Action)
6. Update Case State (Update Record)

See [route_high_priority_case.ts](src/servicenow/flows/route_high_priority_case.ts) for detailed configuration.

### Step 8: Create Roles

Navigate to **User Administration > Roles** and create:

| Role Name | Description | Capabilities |
|-----------|-----------|---|
| csm_admin | Administrator | Full access, manage all settings |
| csm_manager | Manager | Team management, reporting |
| csm_team_lead | Team Lead | Team coordination, case assignment |
| csm_agent | Agent | Day-to-day case handling |
| csm_viewer | Viewer | Read-only access, reporting |

See [roles_and_security.ts](src/servicenow/security/roles_and_security.ts) for permission matrix.

### Step 9: Create Groups

1. Navigate to **Organization > Groups**
2. Create support groups:

```
- x_20261805_csm_senior_support (for critical cases)
- x_20261805_csm_technical_support
- x_20261805_csm_billing_support
- x_20261805_csm_account_support
- x_20261805_csm_general_support
```

Assign users with appropriate CSM roles to each group.

### Step 10: Configure SLA Policies

1. Navigate to **Service Level Management > SLA**
2. Create SLA policies:

```
Name: CSM - Critical (2 hours)
Duration: 120 minutes
Start Condition: state = 'new'
Stop Condition: state = 'closed' OR state = 'resolved'

Name: CSM - High (4 hours)
Duration: 240 minutes

Name: CSM - Standard (24 hours)
Duration: 1440 minutes
```

### Step 11: Configure Email Templates

Create email notification templates for:
- Case Assignment Notification
- Case Status Update
- Case Resolution Confirmation
- Customer Feedback Request

## API Configuration

### Enable REST API

1. Navigate to **System Web Services > REST**
2. Create REST API resource:

```
Name: CSM Cases API
Base Path: /api/now/csm/v1
Active: true
```

### API Endpoints

See [cases_api.ts](src/servicenow/api/cases_api.ts) for complete endpoint documentation:

```
GET    /api/now/csm/v1/cases              - List all cases
POST   /api/now/csm/v1/cases              - Create case
GET    /api/now/csm/v1/cases/{id}         - Get case
PATCH  /api/now/csm/v1/cases/{id}/status  - Update status
POST   /api/now/csm/v1/cases/{id}/notes   - Add note
GET    /api/now/csm/v1/cases/{id}/sla     - Get SLA info
GET    /api/now/csm/v1/cases/search       - Search cases
```

## Configuration

### Priority & SLA Mapping

Edit [CSM_CONFIG.ts](src/servicenow/CSM_CONFIG.ts):

```typescript
export const PRIORITY_CONFIG = {
  1: { name: 'Critical', slaHours: 2, autoRoute: true },
  2: { name: 'High', slaHours: 4, autoRoute: true },
  3: { name: 'Medium', slaHours: 24, autoRoute: false },
  4: { name: 'Low', slaHours: 48, autoRoute: true },
  5: { name: 'Minimal', slaHours: 120, autoRoute: true }
};
```

### Notification Settings

Configure email recipients in **System Properties**:

```
x_20261805_csm.notification.critical = high_priority_support_group
x_20261805_csm.notification.escalation = csm_managers
```

## Post-Installation Verification

### 1. Test Case Creation

1. Navigate to **x_20261805_csm > Customer Case**
2. Create test case with:
   - Customer: Select existing customer
   - Description: Test case
   - Priority: 2 (High)
3. **Expected result**: Case assigned automatically to appropriate team

### 2. Test SLA Attachment

1. Check SLA policy was attached automatically
2. Verify SLA status displays in form
3. **Expected result**: SLA status shows "In Progress"

### 3. Test Notifications

1. Monitor email for assignment notification
2. Verify notification sent to assigned agent
3. **Expected result**: Agent receives case assignment email

### 4. Test API

```bash
# Test GET cases
curl -X GET \
  'http://[instance].service-now.com/api/now/csm/v1/cases' \
  -H 'Authorization: Basic [base64 encoded credentials]'

# Test POST case
curl -X POST \
  'http://[instance].service-now.com/api/now/csm/v1/cases' \
  -H 'Content-Type: application/json' \
  -d '{
    "short_description": "Test case",
    "customer": "[customer_sys_id]",
    "customer_email": "customer@example.com"
  }'
```

## Security Configuration

### Access Control

All tables have scoped ACLs restricting access to authorized CSM roles:

- **Create**: csm_admin, csm_manager, csm_agent
- **Read**: csm_admin, csm_manager, csm_agent, csm_viewer
- **Write**: csm_admin, csm_manager, csm_agent
- **Delete**: csm_admin only

### Field-Level Security

Sensitive fields protected:
- SLA policies: Read by agents, write by admin only
- Escalation info: Restricted to managers
- Work notes: Internal only, not visible to customers

See [roles_and_security.ts](src/servicenow/security/roles_and_security.ts) for complete matrix.

## Troubleshooting

### Issue: Cases not auto-assigning

**Solution**:
1. Check business rule is active: System Customization > Business Rules
2. Verify filter condition matches case priority
3. Check assignment groups exist and have members
4. Review system logs for errors

### Issue: SLA not attaching

**Solution**:
1. Verify SLA policies exist and are active
2. Check CSMSLAManager script include is deployed
3. Ensure case has valid priority and category
4. Check flow is active and executing

### Issue: Emails not sending

**Solution**:
1. Verify outbound email is configured
2. Check recipient email addresses are valid
3. Review Sent Emails log: System Logs > Email > Sent Emails
4. Verify email template is active

### Issue: API authentication failing

**Solution**:
1. Verify REST API web services are enabled
2. Check user has appropriate CSM role
3. Verify Basic Auth credentials are correct
4. Check API resource is active

## Performance Optimization

### Recommendations

1. **Indexing**: Add database indexes to frequently queried fields:
   - priority, state, assigned_to, customer, opened_at

2. **Batch Processing**: Use scheduled jobs for bulk operations:
   - SLA recalculation
   - Case archival
   - Reporting

3. **Caching**: Enable caching for lookup tables:
   - SLA policies
   - Assignment groups
   - Priority configurations

### Monitoring

1. Set up alerts for:
   - Failed case assignments
   - SLA breaches
   - Unclosed tickets > 30 days
   - High escalation rates

## Backup & Recovery

### Before Deployment

1. Create backup of affected tables
2. Export configurations to XML
3. Document current state

### After Deployment

1. Enable automatic backups
2. Test recovery procedures
3. Document rollback plan

## Support & Maintenance

### Regular Maintenance

- Weekly: Review escalated cases
- Monthly: Analyze case metrics and SLA performance
- Quarterly: Review and update SLA policies

### Known Limitations

- Maximum concurrent API calls: 100 per minute
- Case history limited to 2 years of data
- Archive requires manual cleanup

## Next Steps

1. Configure custom branding/colors
2. Set up dashboards and reports
3. Create knowledge base articles
4. Train support team
5. Go live with pilot group

## Additional Resources

- [ServiceNow CSM Documentation](https://docs.servicenow.com/)
- [Platform API Reference](https://developer.servicenow.com/)
- [Best Practices Guide](docs/BEST_PRACTICES.md)

---
**Version**: 1.0.0  
**Last Updated**: May 25, 2026  
**Scope**: x_20261805_csm
