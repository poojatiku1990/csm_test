# Custom CSM Support App - Architecture & Best Practices

## Application Architecture

### Overview

The Custom CSM Support App is designed as a scoped ServiceNow application following enterprise best practices for Customer Service Management. The architecture is organized into logical layers:

```
┌─────────────────────────────────────────┐
│      Presentation Layer                  │
│  • Service Portal Widget                 │
│  • Customer Portal Forms                 │
│  • Admin Dashboards                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      API Layer                           │
│  • REST API Endpoints                    │
│  • OAuth 2.0 Authentication              │
│  • Rate Limiting & Throttling            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Business Logic Layer                │
│  • Case Management                       │
│  • Routing Engine                        │
│  • SLA Manager                           │
│  • Communication Manager                 │
│  • Closure Workflow                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Data Access Layer                   │
│  • GlideRecord Queries                   │
│  • Data Validation                       │
│  • Transaction Management                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Data Layer                          │
│  • x_20261805_csm_customer_case          │
│  • Communication Logs                    │
│  • Assignment Logs                       │
│  • Archive Tables                        │
└─────────────────────────────────────────┘
```

## Component Overview

### 1. Tables

**Primary Table**: x_20261805_csm_customer_case
- Extends Task table for workflow capabilities
- 25+ fields for comprehensive case management
- Audit trail with sys_created/sys_updated fields

**Supporting Tables**:
- Assignment Log - tracks all case assignments
- Communication Log - records all customer communications
- Routing Log - logs routing decisions
- Resolution Log - documents case resolutions
- Reopening Log - tracks case reopenings
- Case Archive - historical data storage

### 2. Business Rules

**Auto Assign Cases**
- Trigger: After Insert, After Update
- Condition: Priority ≤ 2
- Logic: Route to optimal team based on category and priority
- Output: Assigns case to group and individual agent

### 3. Workflows (Flows)

**Route High Priority Case**
- Triggered on case creation/update
- Decision tree based on priority
- Auto-attaches SLA policy
- Sends notifications to team
- Updates case state

### 4. Script Includes

**CSMSLAManager**
- Attach SLA policies to cases
- Calculate SLA health percentage
- Check for breaches
- Escalate at-risk cases

**CSMCommunicationManager**
- Add internal notes and work notes
- Send customer emails
- Request feedback
- Maintain communication history

**CSMCaseClosureWorkflow**
- Validate case ready for resolution
- Handle case closure process
- Request customer feedback
- Generate closure reports
- Manage case reopening

**CSMSecurityManager**
- Role-based access control
- Field-level security checks
- Capability verification
- Security audit logging

### 5. Client Scripts

**Validate Case Priority**
- onLoad: Display SLA information
- onChange: Validate and update UI
- onSubmit: Final validation before save

### 6. API Layer

**REST Endpoints** (/api/now/csm/v1/):
- Cases: List, Create, Get, Update
- Status: Update case status
- Notes: Add notes to cases
- SLA: Get SLA information
- Search: Full-text case search

## Key Features

### 1. Intelligent Case Routing

**Automatic Assignment Logic**:
1. Check case priority
2. Determine assignment group based on:
   - Priority level (critical → senior team)
   - Category (technical, billing, account)
   - Availability (load balancing)
3. Assign to least busy agent in group
4. Update case state to "open"
5. Send notification to assigned agent

### 2. SLA Management

**SLA Attachment**:
- Policies based on priority
- Automatic attachment on case creation
- Real-time health monitoring
- Escalation when < 20% time remaining
- Breach notifications

**SLA Policies**:
- Critical: 2 hours (Priority 1)
- High: 4 hours (Priority 2)
- Standard: 24 hours (Priority 3-5)

### 3. Communication Management

**Communication Types**:
- Internal notes (work_notes) - agents only
- Customer comments (comments) - visible to customer
- Emails - sent to customer
- Phone - logged for reference
- Chat - integrated communication

**Features**:
- Visibility control (internal/customer)
- Attachment support
- Audit trail
- Communication history

### 4. Case Lifecycle

```
NEW
  ↓ (Business rule assigns)
OPEN
  ↓ (Agent works on case)
IN_PROGRESS
  ↓ (Waiting for customer input)
WAITING_ON_CUSTOMER
  ↓ (Response received, resolved)
RESOLVED
  ↓ (Verified by customer, closed)
CLOSED
  ↓ (Can be reopened if needed)
REOPENED → OPEN
```

### 5. Security & Access Control

**Role-Based Access**:
- csm_admin: Full access
- csm_manager: Team management + reporting
- csm_team_lead: Team coordination
- csm_agent: Daily case handling
- csm_viewer: Read-only access

**Field-Level Security**:
- Work notes: Agents only
- Escalation data: Managers only
- SLA policies: Admin to modify
- Comments: Customer visible

## Configuration Best Practices

### 1. SLA Configuration

```typescript
// Priority-based SLA
Priority 1 (Critical) → 2-hour resolution SLA
Priority 2 (High) → 4-hour resolution SLA
Priority 3 (Medium) → 24-hour resolution SLA
Priority 4 (Low) → 48-hour resolution SLA
Priority 5 (Minimal) → 5-day resolution SLA
```

### 2. Assignment Group Configuration

```
Category → Assignment Group Mapping:
Technical → CSM Technical Support
Billing → CSM Billing Support
Account → CSM Account Support
Other → CSM General Support

Priority 1 → Override to: CSM Senior Support
```

### 3. Notification Configuration

```
Case Assignment → Assigned Agent
Case Update → Assignment Group Members
Case Escalation → Assignment Group Manager
Case Closure → Customer (confirmation email)
Feedback Request → Customer (survey link)
```

## Performance Considerations

### 1. Query Optimization

- Use indexed fields in filters (priority, state, customer)
- Limit result sets with pagination
- Use field lists instead of all fields
- Cache frequently accessed data

### 2. Batch Operations

- Archive cases > 90 days old (scheduled job)
- Recalculate SLA metrics hourly
- Generate reports off-peak

### 3. Database Indexes

```sql
-- Recommended indexes
CREATE INDEX idx_priority ON x_20261805_csm_customer_case(priority);
CREATE INDEX idx_state ON x_20261805_csm_customer_case(state);
CREATE INDEX idx_assigned_to ON x_20261805_csm_customer_case(assigned_to);
CREATE INDEX idx_customer ON x_20261805_csm_customer_case(customer);
CREATE INDEX idx_opened_at ON x_20261805_csm_customer_case(opened_at DESC);
```

## Development Best Practices

### 1. Coding Standards

**File Organization**:
```
src/servicenow/
├── api/           - REST endpoints
├── businessRules/ - Business logic rules
├── clientScripts/ - Form-side validation
├── flows/         - Workflow definitions
├── security/      - Access control
├── tables/        - Table definitions
├── utils/         - Shared utilities
└── workflows/     - Complex workflows
```

**Naming Conventions**:
- Script Includes: x_20261805_csm_[description]
- Business Rules: [Table]_[Action]
- Client Scripts: [Table]_[Action]_[Event]
- Tables: x_20261805_csm_[entity_name]

### 2. Error Handling

```typescript
// Always wrap in try-catch
try {
  const gr = new GlideRecord('x_20261805_csm_customer_case');
  gr.get(caseId);
  // process
} catch (e) {
  gs.error('Error processing case: ' + e);
  return { success: false, error: e };
}
```

### 3. Logging

```typescript
// Use appropriate log levels
gs.info('Case created: ' + caseId);
gs.warn('SLA threshold exceeded: ' + caseId);
gs.error('Assignment failed: ' + e);
```

### 4. Validation

```typescript
// Validate early and often
if (!caseId || caseId.length === 0) {
  return { success: false, error: 'Case ID required' };
}

const gr = new GlideRecord('x_20261805_csm_customer_case');
if (!gr.get(caseId)) {
  return { success: false, error: 'Case not found' };
}
```

## Testing Strategy

### 1. Unit Tests

- Test SLA calculations
- Test routing logic
- Test validation functions

### 2. Integration Tests

- Test business rule execution
- Test flow completion
- Test API endpoints

### 3. System Tests

- Test end-to-end case lifecycle
- Test with production-like data
- Load test with multiple concurrent users

## Deployment Strategy

### 1. Pre-Deployment

- Backup all data
- Test in development instance
- Validate all configurations
- Prepare rollback plan

### 2. Deployment

- Deploy during maintenance window
- Deploy in this order:
  1. Tables
  2. Script Includes
  3. Business Rules
  4. Client Scripts
  5. Flows
  6. API endpoints

### 3. Post-Deployment

- Verify all components active
- Run test cases
- Monitor error logs
- Monitor performance metrics

## Monitoring & Maintenance

### 1. Key Metrics

```
• Case Resolution Time (target: < SLA)
• Case Backlog (cases in "open" state)
• Assignment Success Rate (% successfully assigned)
• SLA Compliance Rate (% meeting SLA)
• Customer Satisfaction (survey average)
• First Contact Resolution (resolved without reopening)
```

### 2. Alerts

```
• Critical Cases not assigned within 15 minutes
• SLA breach imminent (> 80% used)
• High escalation rate
• API error rate > 1%
• Failed email notifications
```

### 3. Maintenance Tasks

```
Weekly:
  - Review escalated cases
  - Check for failed assignments
  - Verify email delivery

Monthly:
  - Analyze case metrics
  - Review SLA performance
  - Audit security access

Quarterly:
  - Update SLA policies based on trends
  - Review and optimize routing rules
  - Capacity planning
```

## Advanced Customization

### 1. Custom Fields

Add additional fields to customer case table:
```typescript
{
  name: 'custom_field',
  type: 'string',
  label: 'Custom Field',
  required: false
}
```

### 2. Custom Notifications

Create custom email templates:
```
System Notification > Email Template
Add template for: case_created, case_escalated, etc.
```

### 3. Custom Reports

Use Reporting Workbench to create:
- Case volume by priority
- SLA compliance metrics
- Agent performance
- Customer satisfaction

## Compliance & Governance

### 1. Data Privacy

- GDPR: Case data retention policies
- CCPA: Customer data access logs
- Audit trail for all modifications

### 2. Security

- Encrypt sensitive data
- Log all security events
- Regular access reviews
- Password policies

### 3. SOX Compliance

- Change management
- Audit trails
- Segregation of duties
- Access controls

---

**Document Version**: 1.0.0  
**Last Updated**: May 25, 2026  
**Maintained By**: CSM Team
