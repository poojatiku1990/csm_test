# Custom CSM Support App

A comprehensive **Customer Service Management (CSM)** scoped application built for ServiceNow using enterprise best practices. This production-ready application provides complete case lifecycle management, intelligent routing, SLA tracking, and customer communication capabilities.

## 🎯 Overview

Custom CSM Support App is a fully-featured ServiceNow scoped application (scope: `x_20261805_csm`) designed to manage customer service cases end-to-end:

- **Customer Case Intake** - Submit and track support requests
- **Intelligent Case Assignment** - Automatic routing based on priority and category
- **Real-Time Status Tracking** - Monitor case progress and lifecycle
- **SLA Management** - Automatic policy attachment and compliance monitoring
- **Multi-Channel Communication** - Email, notes, comments, and feedback integration
- **Resolution & Closure** - Structured workflows with customer feedback

## ✨ Key Features

### 1. Case Management
- Multi-field case intake form with validation
- Auto-generated case numbers (CSE-XXXXXX format)
- Priority-based case classification
- Category-based routing (Technical, Billing, Account, Other)
- Full audit trail with change tracking

### 2. Intelligent Assignment
- **Automatic routing** based on priority and category
- **Load balancing** to assign to least busy agent
- **Escalation** to senior teams for critical cases (Priority 1-2)
- **Team-based assignment** with group management
- Fallback to team leads if no availability
- Real-time assignment notifications

### 3. SLA Tracking
- **Auto-attach** SLA policies based on priority
- **Real-time health calculation** (% time remaining)
- **Breach detection** with notifications
- **At-risk escalation** when < 20% time remaining
- Priority-based SLA times:
  - Critical (P1): 2 hours
  - High (P2): 4 hours
  - Medium (P3): 24 hours
  - Low (P4): 48 hours
  - Minimal (P5): 5 days

### 4. Communication Management
- **Work notes** - Internal-only agent notes
- **Customer comments** - Visible to customers
- **Email integration** - Send direct emails with attachments
- **Communication history** - Full audit trail
- **Automatic notifications** - Customer confirmations and updates
- **Feedback surveys** - Post-closure customer satisfaction

### 5. Case Lifecycle
```
NEW → OPEN → IN_PROGRESS → WAITING_ON_CUSTOMER → RESOLVED → CLOSED
                                                            ↓
                                                        REOPENED → OPEN
```

### 6. REST API
Complete REST API for external integrations:
- List, create, read, update cases
- Manage case notes and status
- Query SLA information
- Full-text case search
- OAuth 2.0 authentication

### 7. Security & RBAC
Five role levels with granular permissions:
- **csm_admin** - Full administrative access
- **csm_manager** - Team management and reporting
- **csm_team_lead** - Team coordination
- **csm_agent** - Daily case handling
- **csm_viewer** - Read-only access

### 8. Analytics & Reporting
- Case volume by priority
- Resolution time analysis
- SLA compliance metrics
- Agent performance dashboard
- Team workload distribution
- Customer satisfaction trends

## 📋 Project Structure

```
csm_test/
├── src/servicenow/
│   ├── api/
│   │   └── cases_api.ts              # REST API endpoints
│   ├── businessRules/
│   │   └── auto_assign_case.ts       # Auto-assignment logic
│   ├── clientScripts/
│   │   └── validate_case_priority.ts # Form validation & SLA display
│   ├── flows/
│   │   └── route_high_priority_case.ts # Routing workflow
│   ├── security/
│   │   └── roles_and_security.ts     # RBAC configuration
│   ├── scriptIncludes/
│   │   └── sla_manager.ts            # SLA utilities
│   ├── tables/
│   │   └── customer_case_table.ts    # Table definition
│   ├── utils/
│   │   └── communication_manager.ts  # Communication utilities
│   └── workflows/
│       └── case_closure_workflow.ts  # Closure process
├── CSM_CONFIG.ts                     # Configuration settings
├── INSTALLATION_GUIDE.md             # Complete deployment steps
├── ARCHITECTURE_AND_BEST_PRACTICES.md # Design & best practices
├── IMPLEMENTATION_SUMMARY.ts         # Project summary
├── package.json
└── manifest.json
```

## 🚀 Quick Start

### Prerequisites
- ServiceNow instance (Paris or later)
- Admin access
- Node.js 16+ (for local development)

### Installation (3-4 hours)

1. **Create Application Scope**
   ```
   Navigate to System Definition > Application
   Create new app with scope: x_20261805_csm
   ```

2. **Create Main Table**
   - Deploy `x_20261805_csm_customer_case` table
   - Add custom fields (see INSTALLATION_GUIDE.md)

3. **Deploy Components**
   - Script Includes (SLA Manager, Communication Manager, etc.)
   - Business Rules (Auto Assignment)
   - Client Scripts (Priority Validation)
   - Flows (Case Routing)

4. **Configure Security**
   - Create roles: csm_admin, csm_manager, csm_agent, csm_viewer
   - Create support groups by category
   - Set up ACLs

5. **Setup SLA Policies**
   - Create 5 SLA policies (one per priority level)
   - Configure duration times

6. **Test & Validate**
   - Create test case and verify auto-assignment
   - Check SLA attachment
   - Test API endpoints
   - Verify email notifications

See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed step-by-step instructions.

## 📚 Documentation

- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Complete deployment instructions
- **[ARCHITECTURE_AND_BEST_PRACTICES.md](ARCHITECTURE_AND_BEST_PRACTICES.md)** - Architecture overview and development guidelines
- **[IMPLEMENTATION_SUMMARY.ts](IMPLEMENTATION_SUMMARY.ts)** - Project structure and component reference
- **[CSM_CONFIG.ts](src/servicenow/CSM_CONFIG.ts)** - Configuration reference

## 🔧 Build & Development

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to ServiceNow
npm run deploy

# Generate types
npm run types

# Watch mode for development
npm run dev

# Transform source code
npm run transform
```

## 🌐 API Documentation

### Base URL
```
https://[instance].service-now.com/api/now/csm/v1
```

### Endpoints

#### List Cases
```
GET /cases?limit=10&offset=0&state=open&priority=1
```

#### Create Case
```
POST /cases
{
  "short_description": "Unable to login",
  "customer": "[sys_id]",
  "customer_email": "user@example.com",
  "priority": "2"
}
```

#### Get Case
```
GET /cases/{case_sys_id}
```

#### Update Status
```
PATCH /cases/{case_sys_id}/status
{
  "state": "in_progress"
}
```

#### Add Note
```
POST /cases/{case_sys_id}/notes
{
  "note": "Investigating issue...",
  "visibility": "internal"
}
```

#### Get SLA
```
GET /cases/{case_sys_id}/sla
```

See [cases_api.ts](src/servicenow/api/cases_api.ts) for complete API documentation.

## 📊 Configuration

### Priority-Based SLA Times

| Priority | Level | Resolution SLA | Response Time |
|----------|-------|---|---|
| 1 | Critical | 2 hours | 15 minutes |
| 2 | High | 4 hours | 30 minutes |
| 3 | Medium | 24 hours | 2 hours |
| 4 | Low | 48 hours | 4 hours |
| 5 | Minimal | 5 days | 24 hours |

### Case States

| State | Description |
|-------|---|
| new | Newly created case |
| open | Assigned and ready for work |
| in_progress | Agent actively working |
| waiting_on_customer | Awaiting customer input |
| resolved | Work completed, awaiting closure |
| closed | Case closed and archived |

### Category-Based Routing

| Category | Assignment Group | SLA Policy |
|----------|---|---|
| Technical | CSM Technical Support | csm_sla_technical |
| Billing | CSM Billing Support | csm_sla_billing |
| Account | CSM Account Support | csm_sla_account |
| Other | CSM General Support | csm_sla_standard |

## 🔒 Security

### Role-Based Access Control

- **csm_admin**: Full access, configuration, user management
- **csm_manager**: Team management, reporting, escalations
- **csm_team_lead**: Team coordination, case assignment
- **csm_agent**: Case handling, customer communication
- **csm_viewer**: Read-only access, reporting

### Field-Level Security

- Work notes: Agents only (internal)
- Escalation data: Managers and admins only
- SLA policies: Admins only for modification
- Comments: Customer visible

See [roles_and_security.ts](src/servicenow/security/roles_and_security.ts) for complete RBAC configuration.

## 📈 Key Metrics

Monitor these KPIs for application health:

```
Case Resolution Time: < SLA time (Target: 95% compliance)
Case Backlog: Cases in "open" state (Target: < 50)
Assignment Success: Auto-assigned / total (Target: > 95%)
First Contact Resolution: Not reopened / closed (Target: > 70%)
Customer Satisfaction: Average survey score (Target: > 4.0/5.0)
SLA Compliance: On-time / total (Target: > 95%)
```

## 🧪 Testing

### Test Case Scenarios

1. **Auto-Assignment**
   - Create Priority 1 case → Should assign within 5 minutes
   - Create Priority 3 case → Should not auto-assign

2. **SLA Tracking**
   - Create case and verify SLA policy attached
   - Check SLA health % decreases over time
   - Verify escalation triggers at 20% remaining

3. **Communication**
   - Add internal note → Should not be visible to customer
   - Add comment → Should be visible to customer
   - Send email → Customer should receive notification

4. **Case Closure**
   - Resolve case → Should request feedback
   - Close case → Should archive data
   - Reopen case → Should update reopening counter

## 🐛 Troubleshooting

### Cases not auto-assigning?
1. Check business rule is active
2. Verify assignment groups exist with active members
3. Check case priority ≤ 2
4. Review system logs for errors

### SLA not attaching?
1. Verify SLA policies exist and are active
2. Check CSMSLAManager script include is deployed
3. Ensure case has valid priority
4. Check flow is executing (Flow Designer logs)

### Emails not sending?
1. Verify email service is configured
2. Check recipient email addresses are valid
3. Review System Logs > Email > Sent Emails
4. Verify email template is active

## 📞 Support

For issues or questions:
1. Check [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) troubleshooting section
2. Review [ARCHITECTURE_AND_BEST_PRACTICES.md](ARCHITECTURE_AND_BEST_PRACTICES.md)
3. Check ServiceNow system logs
4. Review script error logs for specific components

## 🎓 Learning Resources

- [Glassdoor API Examples](docs/api-examples.md)
- [Workflow Patterns](docs/workflow-patterns.md)
- [Troubleshooting Guide](docs/troubleshooting.md)
- [Performance Tuning](docs/performance-tuning.md)

## 💡 Best Practices

### Development
- Follow TypeScript strict mode
- Use GlideRecord for database queries
- Always validate input data
- Log errors with gs.error()
- Use try-catch for exception handling

### Deployment
- Test in development instance first
- Deploy during maintenance window
- Deploy tables before business rules
- Verify ACLs before going live
- Monitor error logs after deployment

### Operations
- Review SLA compliance weekly
- Analyze case metrics monthly
- Update routing rules quarterly
- Archive cases > 90 days
- Maintain security audit trail

## 📝 License

UNLICENSED - For internal use only

## 👥 Author

**CSM Team**

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 25, 2026 | Initial release with full CSM capabilities |