# CSM Tables - Quick Reference

**Scope**: x_20261805_csm  
**Last Updated**: May 25, 2026

---

## 📋 All 5 Tables at a Glance

### Table 1: CUSTOMER CASE (Main Table)
```
Table Name: x_20261805_csm_customer_case
Extends: task
Display Field: number
Total Fields: 34
Mandatory Fields: 8

Key Fields:
├── number (auto, read-only)
├── short_description ⚡
├── customer_account → Customer Account ⚡
├── customer_contact → Customer Contact ⚡
├── customer_email ⚡
├── priority ⚡
├── case_category → Case Category ⚡
├── state ⚡
├── assignment_group → User Group
├── assigned_to → User
├── resolution_code
├── resolution_notes
└── work_notes, comments

States: new → open → in_progress → waiting_on_customer → resolved → closed
```

### Table 2: CUSTOMER ACCOUNT
```
Table Name: x_20261805_csm_customer_account
Extends: cmn_companies
Display Field: name
Total Fields: 18
Mandatory Fields: 1

Key Fields:
├── name ⚡
├── account_type
├── status
├── industry
├── phone
├── email (billing & support)
├── address (street, city, state, zip, country)
├── account_manager → User
├── support_tier
└── service_level_agreement → SLA

Related To: Has many Customer Contacts & Cases
```

### Table 3: CUSTOMER CONTACT
```
Table Name: x_20261805_csm_customer_contact
Extends: contact
Display Field: name
Total Fields: 18
Mandatory Fields: 5

Key Fields:
├── first_name ⚡
├── last_name ⚡
├── name (auto-generated) ⚡
├── customer_account → Customer Account ⚡
├── email ⚡
├── phone
├── mobile_phone
├── title
├── department
├── role (Technical, Billing, Executive, etc.)
├── is_primary_contact
├── preferred_contact_method
├── notification_enabled
└── language

Related To: Belongs to Customer Account, Receives Cases
```

### Table 4: CASE CATEGORY
```
Table Name: x_20261805_csm_case_category
Extends: sys_metadata
Display Field: name
Total Fields: 14
Mandatory Fields: 2

Key Fields:
├── name ⚡ (unique)
├── description
├── assignment_group → User Group ⚡
├── sla_policy → SLA
├── escalation_group → User Group
├── subcategories (comma-separated)
├── keywords (for AI)
├── active (default: true)
├── display_order
├── requires_approval
└── can_be_self_resolved

Example Categories:
- Technical Support → Tech Team (4h SLA)
- Billing Support → Billing Team (8h SLA)
- Account Management → Account Team (24h SLA)
- General Inquiry → General Team (24h SLA)
```

### Table 5: CASE COMMUNICATION
```
Table Name: x_20261805_csm_case_communication
Extends: sys_metadata
Display Field: communication_id
Total Fields: 33
Mandatory Fields: 8

Key Fields:
├── communication_id (auto, read-only) ⚡
├── case_id → Customer Case ⚡
├── communication_type ⚡ (Note, Comment, Email, Phone Call, Chat, Video, Attachment, Status Update)
├── sender_type ⚡ (Agent, Customer, System)
├── sender_name ⚡
├── sender_email
├── sender_user → User
├── sender_contact → Customer Contact
├── content (message) ⚡
├── subject
├── visibility ⚡ (Internal, Customer, Both)
├── attachment_count & attachment_ids
├── created_at ⚡
├── sentiment (Positive, Neutral, Negative)
├── satisfaction_rating (1-5)
├── resolution_provided
├── next_action & next_action_by
├── Email fields (to, cc, bcc, subject)
└── Phone fields (duration, outcome)

Communication Types:
- Note: Internal only
- Comment: Customer visible
- Email: External communication
- Phone: Call record
- Chat: Real-time messaging
```

---

## 🔗 Relationships Map

```
CUSTOMER ACCOUNT (1)
    ↓ (1:Many)
    ├→ CUSTOMER CONTACT (Many)
    │   └→ referenced in CUSTOMER CASE
    │
    └→ CUSTOMER CASE (Many)
        ├→ CASE CATEGORY
        ├→ CASE COMMUNICATION (1:Many)
        └→ Assignment/Routing

CASE CATEGORY
    ├→ assignment_group
    ├→ sla_policy
    └→ escalation_group
```

---

## 🎯 Field Types Used

| Count | Type | Example Tables |
|-------|------|---|
| 15 | string | name, description, email, etc. |
| 8 | choice | priority, state, communication_type |
| 7 | reference | assignment_group, customer_account, etc. |
| 4 | text | work_notes, comments, content, etc. |
| 3 | boolean | is_escalated, notification_enabled |
| 3 | date_time | created_at, resolved_at, assigned_to_date |
| 2 | integer | attachment_count, reopened_count |
| 1 | phone_number | phone fields |
| 1 | email | email fields |
| 1 | currency | annual_revenue |
| 1 | url | website |
| 1 | date | customer_since |

---

## ⚡ Mandatory Fields Summary

**CUSTOMER CASE** (8 required):
- number, short_description, customer_account
- customer_contact, customer_email, priority
- case_category, state

**CUSTOMER ACCOUNT** (1 required):
- name

**CUSTOMER CONTACT** (5 required):
- first_name, last_name, name (auto)
- customer_account, email

**CASE CATEGORY** (2 required):
- name, assignment_group

**CASE COMMUNICATION** (8 required):
- communication_id (auto), case_id, communication_type
- sender_type, sender_name, content, visibility
- created_at

---

## 📊 Field Counts by Table

| Table | Total Fields | Mandatory | Optional | Read-Only |
|-------|-------------|-----------|----------|-----------|
| Customer Case | 34 | 8 | 24 | 2 |
| Customer Account | 18 | 1 | 17 | 0 |
| Customer Contact | 18 | 5 | 13 | 1 |
| Case Category | 14 | 2 | 12 | 0 |
| Case Communication | 33 | 8 | 22 | 3 |
| **TOTAL** | **117** | **24** | **88** | **6** |

---

## 🔄 Creation Order

When implementing in ServiceNow, create tables in this order:

```
1. Case Category
   (referenced by Customer Case)

2. Customer Account & Customer Contact
   (referenced by Customer Case)

3. Customer Case
   (depends on all of the above)

4. Case Communication
   (references Customer Case)
```

---

## 🔐 Access Control

**Suggested ACL Setup:**

```
CREATE:
├─ Customer Case: csm_agent, csm_manager, csm_admin
├─ Customer Account: csm_manager, csm_admin
├─ Customer Contact: csm_agent, csm_manager, csm_admin
├─ Case Category: csm_admin only
└─ Case Communication: csm_agent, customer (portal)

READ:
├─ Customer Case: csm_agent, csm_manager, csm_admin, csm_viewer
├─ Customer Account: csm_agent, csm_manager, csm_admin, csm_viewer
├─ Customer Contact: csm_agent, csm_manager, csm_admin, csm_viewer
├─ Case Category: csm_agent, csm_manager, csm_admin
└─ Case Communication: csm_agent, csm_manager, csm_admin

UPDATE:
├─ Customer Case: csm_agent, csm_manager, csm_admin
├─ Customer Account: csm_manager, csm_admin
├─ Customer Contact: csm_agent, csm_manager, csm_admin
├─ Case Category: csm_admin only
└─ Case Communication: Limited (status/sentiment only for agents)

DELETE:
└─ All: csm_admin only
```

---

## 🔍 Common Queries

### Find All Cases for a Customer
```
SELECT * FROM x_20261805_csm_customer_case
WHERE customer_account = [account_id]
ORDER BY opened_at DESC
```

### Get Contact's Cases
```
SELECT * FROM x_20261805_csm_customer_case
WHERE customer_contact = [contact_id]
AND state != 'closed'
```

### Communication History for Case
```
SELECT * FROM x_20261805_csm_case_communication
WHERE case_id = [case_id]
ORDER BY created_at DESC
```

### Cases Assigned to Group
```
SELECT * FROM x_20261805_csm_customer_case
WHERE assignment_group = [group_id]
AND state IN ('open', 'in_progress')
```

### Unassigned Cases
```
SELECT * FROM x_20261805_csm_customer_case
WHERE assigned_to IS NULL
AND state = 'open'
ORDER BY priority, opened_at
```

---

## 📝 Example Data Structure

### Customer Account Record
```javascript
{
  name: "Acme Corporation",
  account_type: "Enterprise",
  status: "Active",
  industry: "Technology",
  billing_email: "billing@acme.com",
  support_email: "support@acme.com",
  phone: "555-0100",
  support_tier: "Premium",
  account_manager: "[user_id]",
  customer_since: "2020-01-15",
  annual_revenue: 50000000,
  employee_count: 500
}
```

### Customer Contact Record
```javascript
{
  first_name: "John",
  last_name: "Smith",
  name: "John Smith", // auto
  customer_account: "[account_id]",
  email: "john.smith@acme.com",
  phone: "555-0123",
  title: "IT Manager",
  department: "Information Technology",
  role: "Technical Contact",
  is_primary_contact: true,
  preferred_contact_method: "Email",
  notification_enabled: true
}
```

### Case Category Record
```javascript
{
  name: "Technical Support",
  description: "Technical issues and troubleshooting",
  assignment_group: "[group_id]",
  sla_policy: "[sla_id]", // 4 hours
  subcategories: "Password Reset, Access Issues, Performance",
  keywords: "technical, password, access, login, error",
  display_order: 1,
  active: true,
  can_be_self_resolved: true
}
```

### Customer Case Record
```javascript
{
  number: "CSE-0001234", // auto
  short_description: "Unable to reset password",
  description: "User cannot reset password via forgot password link",
  customer_account: "[account_id]",
  customer_contact: "[contact_id]",
  customer_email: "john.smith@acme.com",
  priority: "2", // High
  case_category: "[category_id]",
  state: "open",
  assignment_group: "[group_id]",
  assigned_to: "[user_id]",
  sla_policy: "[sla_id]",
  opened_at: "2026-05-25 10:00:00",
  updated_at: "2026-05-25 11:30:00"
}
```

### Case Communication Record
```javascript
{
  communication_id: "COMM-0001234", // auto
  case_id: "[case_id]",
  communication_type: "Email",
  sender_type: "Agent",
  sender_name: "Support Agent",
  sender_user: "[user_id]",
  sender_email: "support@company.com",
  content: "We have reset your password. You should receive an email shortly.",
  subject: "Re: Unable to reset password",
  visibility: "Customer",
  email_to: "john.smith@acme.com",
  email_subject: "Re: Unable to reset password",
  created_at: "2026-05-25 11:30:00",
  resolution_provided: true
}
```

---

## ✅ Implementation Checklist

- [ ] Review all 5 table definitions
- [ ] Confirm field requirements
- [ ] Check reference dependencies
- [ ] Create assignment groups
- [ ] Create SLA policies
- [ ] Create application scope (x_20261805_csm)
- [ ] Create tables in correct order
- [ ] Add all fields per specifications
- [ ] Set mandatory field flags
- [ ] Configure auto-numbering
- [ ] Set default values
- [ ] Create sample records
- [ ] Test all references
- [ ] Test mandatory validation
- [ ] Configure ACLs
- [ ] Create role-based views
- [ ] Set up notifications
- [ ] Complete!

---

## 📞 Support References

- Full Guide: [TABLE_DEFINITIONS_GUIDE.md](TABLE_DEFINITIONS_GUIDE.md)
- TypeScript Definitions: [csm_table_definitions.ts](src/servicenow/tables/csm_table_definitions.ts)
- Related Documentation: [README.md](README.md)

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Scope**: x_20261805_csm
