# CSM Application - Table Definitions Guide

**Scope:** x_20261805_csm  
**Created:** May 25, 2026  
**Version:** 1.0.0

---

## Overview

This guide provides detailed information about the 5 core tables required for the basic CSM application. These tables work together to manage customer service cases, accounts, contacts, and communications.

### Table Hierarchy

```
Customer Account (x_20261805_csm_customer_account)
    ├── extends: cmn_companies
    ├── Primary Fields: name, account_type, status
    └── Related To:
        ├── Customer Contact (many)
        └── Customer Case (many)

Customer Contact (x_20261805_csm_customer_contact)
    ├── extends: contact
    ├── Primary Fields: first_name, last_name, email
    └── Related To:
        ├── Customer Account (many-to-one)
        └── Customer Case (many)

Case Category (x_20261805_csm_case_category)
    ├── extends: sys_metadata
    ├── Primary Fields: name, assignment_group
    └── Related To:
        └── Customer Case (many)

Customer Case (x_20261805_csm_customer_case)
    ├── extends: task
    ├── Primary Fields: number, short_description, state
    └── Related To:
        ├── Customer Account (many-to-one)
        ├── Customer Contact (many-to-one)
        ├── Case Category (many-to-one)
        └── Case Communication (one-to-many)

Case Communication (x_20261805_csm_case_communication)
    ├── extends: sys_metadata
    ├── Primary Fields: communication_id, content, visibility
    └── Related To:
        └── Customer Case (many-to-one)
```

---

## TABLE 1: CUSTOMER CASE

**Primary table for managing customer service cases**

### Basic Information

| Property | Value |
|----------|-------|
| **Table Name** | x_20261805_csm_customer_case |
| **Display Name** | Customer Case |
| **Label** | Customer Case |
| **Extends** | task |
| **Display Field** | number |
| **Total Fields** | 34 |
| **Mandatory Fields** | 8 |
| **Purpose** | Track and manage all customer support cases |

### Key Fields

#### Identity & Classification
| Field Name | Type | Mandatory | Example | Description |
|-----------|------|-----------|---------|------------|
| number | string (auto) | Yes | CSE-0001234 | Auto-generated unique case ID |
| short_description | string | Yes | Unable to login | Brief case summary (max 160 chars) |
| description | text | No | User cannot access portal | Detailed issue description |
| priority | choice | Yes | 2 - High | 1=Critical, 2=High, 3=Medium, 4=Low, 5=Minimal |
| case_category | reference | Yes | Technical | Category for routing |
| subcategory | string | No | Login Issues | Additional categorization |

#### Customer Information
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| customer_account | reference | Yes | Reference to Customer Account |
| customer_contact | reference | Yes | Reference to Customer Contact |
| customer_email | email | Yes | Customer's email address |
| customer_phone | phone | No | Customer's phone number |

#### Status & Lifecycle
| Field Name | Type | Mandatory | Valid Values |
|-----------|------|-----------|------------|
| state | choice | Yes | new, open, in_progress, waiting_on_customer, resolved, closed, cancelled |
| opened_at | date_time | No | Auto-set when opened |
| updated_at | date_time | No | Auto-updated |
| resolved_at | date_time | No | Set when resolved |
| closed_at | date_time | No | Set when closed |
| reopened_count | integer | No | Tracks number of reopenings |

#### Assignment & Routing
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| assignment_group | reference | No | Support team assigned |
| assigned_to | reference | No | Individual agent |
| assigned_to_date | date_time | No | When case was assigned |

#### SLA Tracking
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| sla_policy | reference | No | SLA policy applied |
| response_sla | reference (read-only) | No | Response time SLA instance |
| resolution_sla | reference (read-only) | No | Resolution time SLA instance |
| sla_status | choice (read-only) | No | success, breach, in_progress, paused |

#### Resolution & Communication
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| resolution_code | choice | No | How case was resolved |
| resolution_notes | text | No | Details about resolution |
| work_notes | text | No | Internal-only notes |
| comments | text | No | Customer-visible comments |

#### Additional Fields
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| urgency | choice | No | 1=High, 2=Medium, 3=Low |
| impact | choice | No | 1=High, 2=Medium, 3=Low |
| is_escalated | boolean | No | Whether escalated (default: false) |
| escalation_reason | text | No | Reason for escalation |
| customer_satisfaction | choice | No | 1=Very Dissatisfied to 5=Very Satisfied |
| feedback_provided | boolean | No | Has customer provided feedback |

### Field Dependencies

```
priority → determines → sla_policy
priority ≤ 2 → triggers → auto-assignment
state = 'resolved' → enables → closed_at
customer_satisfaction requires state = 'closed'
```

---

## TABLE 2: CUSTOMER ACCOUNT

**Represents customer organizations and account information**

### Basic Information

| Property | Value |
|----------|-------|
| **Table Name** | x_20261805_csm_customer_account |
| **Display Name** | Customer Account |
| **Label** | Customer Account |
| **Extends** | cmn_companies |
| **Display Field** | name |
| **Total Fields** | 18 |
| **Mandatory Fields** | 1 |
| **Purpose** | Store customer organization data |

### Key Fields

#### Identity
| Field Name | Type | Mandatory | Example |
|-----------|------|-----------|---------|
| name | string | Yes | Acme Corporation |
| account_type | choice | No | Enterprise, Mid-Market, SMB, Startup, Individual |
| status | choice | No | Active, Prospect, Inactive, At Risk |

#### Contact Information
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| billing_email | email | No | Email for billing inquiries |
| support_email | email | No | Email for support inquiries |
| phone | phone | No | Main phone number |
| website | url | No | Company website |

#### Address Information
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| street | string | No | Street address |
| city | string | No | City name |
| state | string | No | State or province |
| zip_code | string | No | Zip or postal code |
| country | string | No | Country name |

#### Business Information
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| industry | string | No | Industry classification |
| annual_revenue | currency | No | Annual revenue (reference) |
| employee_count | integer | No | Number of employees |
| customer_since | date | No | Relationship start date |
| account_manager | reference | No | Primary account manager |
| support_tier | choice | No | Basic, Standard, Premium, Enterprise |
| service_level_agreement | reference | No | Associated SLA |

#### Additional
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| notes | text | No | Internal account notes |

### Common Uses

- **Filtering Cases**: All cases linked to account
- **Contact Lookup**: Find all contacts for account
- **Support Tier**: Determine service level
- **Billing**: Track revenue per account
- **Escalation**: Notify account manager

---

## TABLE 3: CUSTOMER CONTACT

**Individual contacts at customer organizations**

### Basic Information

| Property | Value |
|----------|-------|
| **Table Name** | x_20261805_csm_customer_contact |
| **Display Name** | Customer Contact |
| **Label** | Customer Contact |
| **Extends** | contact |
| **Display Field** | name |
| **Total Fields** | 18 |
| **Mandatory Fields** | 5 |
| **Purpose** | Manage individual contact information |

### Key Fields

#### Identity
| Field Name | Type | Mandatory | Example | Read-Only |
|-----------|------|-----------|---------|-----------|
| first_name | string | Yes | John | No |
| last_name | string | Yes | Smith | No |
| name | string | Yes | John Smith | Yes (auto-generated) |
| title | string | No | IT Manager | No |
| department | string | No | Information Technology | No |

#### Organization Reference
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| customer_account | reference | Yes | Associated customer account |

#### Contact Information
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| email | email | Yes | Email address (must be unique per account) |
| phone | phone | No | Office phone number |
| mobile_phone | phone | No | Mobile phone number |
| fax | phone | No | Fax number |

#### Role & Preferences
| Field Name | Type | Mandatory | Valid Values |
|-----------|------|-----------|------------|
| role | choice | No | Technical Contact, Billing Contact, Executive, Decision Maker, End User, Other |
| is_primary_contact | boolean | No | Is this the main contact |
| preferred_contact_method | choice | No | Email, Phone, Mobile, Fax (default: Email) |
| notification_enabled | boolean | No | Receive case notifications |
| language | choice | No | English, Spanish, French, German, Other |

#### Status
| Field Name | Type | Mandatory | Valid Values |
|-----------|------|-----------|------------|
| status | choice | No | Active, Inactive, Left Company |

#### Additional
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| notes | text | No | Internal notes about contact |

### Common Uses

- **Case Assignment**: Assign cases to specific contact
- **Notifications**: Send updates to preferred contact
- **Escalation**: Notify decision makers
- **Multi-contact Support**: Track multiple contacts per account
- **Role-based Communication**: Route to appropriate person

---

## TABLE 4: CASE CATEGORY

**Defines case categories for classification and routing**

### Basic Information

| Property | Value |
|----------|-------|
| **Table Name** | x_20261805_csm_case_category |
| **Display Name** | Case Category |
| **Label** | Case Category |
| **Extends** | sys_metadata |
| **Display Field** | name |
| **Total Fields** | 14 |
| **Mandatory Fields** | 2 |
| **Purpose** | Manage case types and routing rules |

### Key Fields

#### Identity
| Field Name | Type | Mandatory | Unique | Example |
|-----------|------|-----------|--------|---------|
| name | string | Yes | Yes | Technical Support |
| description | text | No | No | Technical issues and troubleshooting |

#### Routing Configuration
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| assignment_group | reference | Yes | Default support group for this category |
| sla_policy | reference | No | Default SLA for this category |
| escalation_group | reference | No | Group for escalations |
| manager_email | email | No | Category manager email |

#### Categorization
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| subcategories | text | No | Comma-separated list of subcategories |
| keywords | text | No | Keywords for AI categorization |
| display_order | integer | No | Order in UI display |

#### Configuration Options
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| active | boolean | No | Is available for selection (default: true) |
| requires_approval | boolean | No | Cases need approval (default: false) |
| can_be_self_resolved | boolean | No | Customer can self-resolve (default: true) |

### Example Categories

```
1. Technical Support
   - Assignment Group: Technical Support Team
   - Subcategories: Password Reset, Login Issues, Access Problems
   - SLA: 4 hours

2. Billing Support
   - Assignment Group: Billing Team
   - Subcategories: Invoice Inquiry, Payment Issues, Subscription
   - SLA: 8 hours

3. Account Management
   - Assignment Group: Account Team
   - Subcategories: Profile Update, Company Info, Settings
   - SLA: 24 hours

4. General Inquiry
   - Assignment Group: General Support
   - Subcategories: Information Request, Feedback, Other
   - SLA: 24 hours
```

---

## TABLE 5: CASE COMMUNICATION

**Tracks all communications related to a case**

### Basic Information

| Property | Value |
|----------|-------|
| **Table Name** | x_20261805_csm_case_communication |
| **Display Name** | Case Communication |
| **Label** | Case Communication |
| **Extends** | sys_metadata |
| **Display Field** | communication_id |
| **Total Fields** | 33 |
| **Mandatory Fields** | 8 |
| **Purpose** | Store complete communication history |

### Key Fields

#### Identity
| Field Name | Type | Mandatory | Example | Read-Only |
|-----------|------|-----------|---------|-----------|
| communication_id | string (auto) | Yes | COMM-0001234 | Yes |

#### Case Reference
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| case_id | reference | Yes | Associated customer case |

#### Communication Type
| Field Name | Type | Mandatory | Valid Values |
|-----------|------|-----------|------------|
| communication_type | choice | Yes | Note, Comment, Email, Phone Call, Chat, Video Call, Attachment Upload, Status Update |
| visibility | choice | Yes | Internal, Customer, Both |

#### Sender Information
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| sender_type | choice | Yes | Agent, Customer, System |
| sender_name | string | Yes | Name of sender |
| sender_email | email | No | Email of sender |
| sender_user | reference | No | System user (if agent) |
| sender_contact | reference | No | Customer contact (if customer) |

#### Content
| Field Name | Type | Mandatory | Example |
|-----------|------|-----------|---------|
| content | text | Yes | I have investigated the issue... |
| subject | string | No | Update on your case |

#### Attachments
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| attachment_count | integer (read-only) | No | Number of attachments |
| attachment_ids | string | No | Comma-separated attachment sys_ids |

#### Metadata & Timestamps
| Field Name | Type | Mandatory | Read-Only | Description |
|-----------|------|-----------|-----------|------------|
| created_at | date_time | Yes | Yes | When created |
| created_by | reference | No | Yes | System user who created |
| updated_at | date_time | No | Yes | Last update time |
| updated_by | reference | No | Yes | Last person to update |

#### Email-Specific Fields
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| email_to | string | No | TO addresses (comma-separated) |
| email_cc | string | No | CC addresses (comma-separated) |
| email_bcc | string | No | BCC addresses (comma-separated) |
| email_subject | string | No | Original email subject |

#### Phone Call Fields
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| call_duration_minutes | integer | No | Duration of call |
| call_outcome | choice | No | Resolved, Escalated, Scheduled Callback, Unable to Reach, Voicemail |

#### Sentiment & Rating
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| sentiment | choice | No | Positive, Neutral, Negative |
| satisfaction_rating | choice | No | 1-5 scale satisfaction |

#### Action Tracking
| Field Name | Type | Mandatory | Description |
|-----------|------|-----------|------------|
| resolution_provided | boolean | No | Does this contain resolution |
| next_action | text | No | What action to take next |
| next_action_by | date_time | No | Target date for next action |

### Communication Types

| Type | Sender | Visibility | Use Case |
|------|--------|-----------|----------|
| Note | Agent | Internal | Internal observations |
| Comment | Agent | Customer/Both | Update for customer |
| Email | Agent/Customer | Customer/Both | Email communication |
| Phone Call | Agent | Internal | Record of phone call |
| Chat | Agent/Customer | Both | Real-time chat messages |
| Video Call | Agent | Internal | Record of video call |
| Attachment | Agent/Customer | Varies | File upload record |
| Status Update | System | Customer | Automated status change |

---

## TABLE RELATIONSHIPS & REFERENCES

### Many-to-One Relationships

```
Customer Case (Many) → Customer Account (One)
  Field: customer_account
  Meaning: A customer can have many cases

Customer Case (Many) → Customer Contact (One)
  Field: customer_contact
  Meaning: A contact receives cases

Customer Case (Many) → Case Category (One)
  Field: case_category
  Meaning: Cases are categorized

Case Communication (Many) → Customer Case (One)
  Field: case_id
  Meaning: A case has many communications

Customer Contact (Many) → Customer Account (One)
  Field: customer_account
  Meaning: An account has many contacts
```

### Reference Fields by Table

| Source Table | Reference Field | Target Table | Type |
|-------------|-----------------|-------------|------|
| Customer Case | customer_account | Customer Account | Required |
| Customer Case | customer_contact | Customer Contact | Required |
| Customer Case | case_category | Case Category | Required |
| Customer Case | assignment_group | sys_user_group | Optional |
| Customer Case | assigned_to | sys_user | Optional |
| Customer Case | sla_policy | sla | Optional |
| Case Category | assignment_group | sys_user_group | Required |
| Case Category | sla_policy | sla | Optional |
| Customer Contact | customer_account | Customer Account | Required |
| Case Communication | case_id | Customer Case | Required |
| Case Communication | sender_user | sys_user | Optional |
| Case Communication | sender_contact | Customer Contact | Optional |

---

## MANDATORY FIELDS BY TABLE

### Customer Case (8 mandatory fields)
1. number *(auto-generated)*
2. short_description
3. customer_account
4. customer_contact
5. customer_email
6. priority
7. case_category
8. state

### Customer Account (1 mandatory field)
1. name

### Customer Contact (5 mandatory fields)
1. first_name
2. last_name
3. name *(auto-generated)*
4. customer_account
5. email

### Case Category (2 mandatory fields)
1. name
2. assignment_group

### Case Communication (8 mandatory fields)
1. communication_id *(auto-generated)*
2. case_id
3. communication_type
4. sender_type
5. sender_name
6. content
7. visibility
8. created_at

---

## FIELD TYPES REFERENCE

| Type | Description | Example | Max Length |
|------|-------------|---------|-----------|
| string | Text field | John Smith | Varies (usually 160) |
| text | Large text area | Long description | Unlimited |
| integer | Whole number | 42 | N/A |
| choice | Dropdown selection | High Priority | N/A |
| reference | Link to another table | [sys_id] | N/A |
| date | Date only | 2026-05-25 | N/A |
| date_time | Date and time | 2026-05-25 14:30:00 | N/A |
| email | Email address | user@example.com | 100 |
| phone_number | Phone number | 555-0123 | 20 |
| url | Web address | https://example.com | 160 |
| currency | Money amount | 50000.00 | N/A |
| boolean | True/False | true/false | N/A |

---

## BEST PRACTICES FOR TABLE SETUP

### 1. Before Creating Tables
- ✓ Plan field requirements
- ✓ Identify references
- ✓ Define mandatory fields
- ✓ Create assignment groups first

### 2. Table Creation Order
1. **First**: Case Category (referenced by others)
2. **Second**: Customer Account & Customer Contact
3. **Third**: Customer Case (depends on all above)
4. **Fourth**: Case Communication (depends on Case)

### 3. Reference Validation
- Ensure referenced tables exist
- Test references with sample data
- Verify reference display fields

### 4. Security Setup
- Set up table ACLs
- Configure field-level security
- Create role-based views

### 5. Testing
- Create sample records in each table
- Test relationships
- Verify auto-generated fields
- Check mandatory field validation

---

## IMPLEMENTATION CHECKLIST

**Use this checklist when creating the tables in ServiceNow:**

### Step 1: Case Category Table
- [ ] Create x_20261805_csm_case_category table
- [ ] Add all fields
- [ ] Create sample categories (Technical, Billing, Account, General)
- [ ] Assign to support groups

### Step 2: Customer Account Table
- [ ] Create x_20261805_csm_customer_account table
- [ ] Add all fields
- [ ] Create sample accounts
- [ ] Test reference in contacts

### Step 3: Customer Contact Table
- [ ] Create x_20261805_csm_customer_contact table
- [ ] Add all fields
- [ ] Create sample contacts linked to accounts
- [ ] Test primary contact flag

### Step 4: Customer Case Table
- [ ] Create x_20261805_csm_customer_case table
- [ ] Add all 34 fields
- [ ] Set up auto-numbering for case number
- [ ] Test all references
- [ ] Set default state to "new"

### Step 5: Case Communication Table
- [ ] Create x_20261805_csm_case_communication table
- [ ] Add all 33 fields
- [ ] Set up auto-numbering for communication_id
- [ ] Test case reference
- [ ] Configure visibility filtering

### Step 6: Validation
- [ ] Test mandatory field validation
- [ ] Test reference lookups
- [ ] Test choice field options
- [ ] Verify auto-generation
- [ ] Test ACLs and security

---

## Quick Reference Summary

| Table | Extends | Display Field | Main Purpose |
|-------|---------|---------------|-------------|
| Customer Case | task | number | Track support cases |
| Customer Account | cmn_companies | name | Customer organizations |
| Customer Contact | contact | name | Contact people |
| Case Category | sys_metadata | name | Route cases |
| Case Communication | sys_metadata | communication_id | Communication history |

---

**Document Version**: 1.0.0  
**Last Updated**: May 25, 2026  
**Status**: Ready for Implementation
