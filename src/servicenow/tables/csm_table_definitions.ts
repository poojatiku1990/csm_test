/**
 * ServiceNow CSM Application Tables
 * Scope: x_20261805_csm
 * 
 * This file defines all core tables for the Customer Service Management application
 * including Customer Cases, Accounts, Contacts, Categories, and Communication records.
 */

// ============================================================
// TABLE 1: CUSTOMER CASE TABLE
// ============================================================

export const CUSTOMER_CASE_TABLE = {
  name: 'Customer Case',
  tableName: 'x_20261805_csm_customer_case',
  extends: 'task',
  displayField: 'number',
  label: 'Customer Case',
  plural: 'Customer Cases',
  isExtensible: true,
  description: 'Tracks customer service cases and support requests',
  
  fields: [
    // Core Identity Fields (inherited from task)
    {
      name: 'number',
      type: 'string',
      label: 'Case Number',
      mandatory: true,
      readOnly: true,
      autoNumber: true,
      example: 'CSE-0001234',
      description: 'Auto-generated unique case identifier'
    },
    {
      name: 'short_description',
      type: 'string',
      label: 'Summary',
      mandatory: true,
      maxLength: 160,
      example: 'Unable to reset password',
      description: 'Brief summary of the case'
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      mandatory: false,
      example: 'Customer unable to reset password via forgot password link',
      description: 'Detailed description of the issue'
    },
    
    // Customer Information
    {
      name: 'customer_account',
      type: 'reference',
      reference: 'x_20261805_csm_customer_account',
      label: 'Customer Account',
      mandatory: true,
      description: 'The customer account associated with this case'
    },
    {
      name: 'customer_contact',
      type: 'reference',
      reference: 'x_20261805_csm_customer_contact',
      label: 'Contact',
      mandatory: true,
      description: 'The specific contact person for this case'
    },
    {
      name: 'customer_email',
      type: 'email',
      label: 'Customer Email',
      mandatory: true,
      example: 'customer@example.com',
      description: 'Contact email address for customer communication'
    },
    {
      name: 'customer_phone',
      type: 'phone_number',
      label: 'Customer Phone',
      mandatory: false,
      example: '555-0123',
      description: 'Customer phone number'
    },
    
    // Case Classification
    {
      name: 'priority',
      type: 'choice',
      label: 'Priority',
      mandatory: true,
      defaultValue: '3',
      choices: ['1 - Critical', '2 - High', '3 - Medium', '4 - Low', '5 - Minimal'],
      description: 'Case priority level affecting SLA'
    },
    {
      name: 'urgency',
      type: 'choice',
      label: 'Urgency',
      mandatory: false,
      choices: ['1 - High', '2 - Medium', '3 - Low'],
      description: 'Urgency of the case'
    },
    {
      name: 'impact',
      type: 'choice',
      label: 'Impact',
      mandatory: false,
      choices: ['1 - High', '2 - Medium', '3 - Low'],
      description: 'Business impact of the case'
    },
    {
      name: 'case_category',
      type: 'reference',
      reference: 'x_20261805_csm_case_category',
      label: 'Category',
      mandatory: true,
      description: 'Case category for routing and classification'
    },
    {
      name: 'subcategory',
      type: 'string',
      label: 'Subcategory',
      mandatory: false,
      maxLength: 100,
      description: 'Additional categorization within category'
    },
    
    // Case Status & Lifecycle (inherited from task)
    {
      name: 'state',
      type: 'choice',
      label: 'State',
      mandatory: true,
      defaultValue: 'new',
      choices: [
        'new',
        'open',
        'in_progress',
        'waiting_on_customer',
        'resolved',
        'closed',
        'cancelled'
      ],
      description: 'Current state of the case'
    },
    
    // Assignment
    {
      name: 'assignment_group',
      type: 'reference',
      reference: 'sys_user_group',
      label: 'Assignment Group',
      mandatory: false,
      description: 'Support team assigned to this case'
    },
    {
      name: 'assigned_to',
      type: 'reference',
      reference: 'sys_user',
      label: 'Assigned to',
      mandatory: false,
      description: 'Individual agent handling this case'
    },
    {
      name: 'assigned_to_date',
      type: 'date_time',
      label: 'Assigned Date',
      mandatory: false,
      description: 'When the case was assigned'
    },
    
    // SLA Information
    {
      name: 'sla_policy',
      type: 'reference',
      reference: 'sla',
      label: 'SLA Policy',
      mandatory: false,
      description: 'SLA policy applied to this case'
    },
    {
      name: 'response_sla',
      type: 'reference',
      reference: 'sla_instance',
      label: 'Response SLA',
      mandatory: false,
      readOnly: true,
      description: 'Response time SLA instance'
    },
    {
      name: 'resolution_sla',
      type: 'reference',
      reference: 'sla_instance',
      label: 'Resolution SLA',
      mandatory: false,
      readOnly: true,
      description: 'Resolution time SLA instance'
    },
    {
      name: 'sla_status',
      type: 'choice',
      label: 'SLA Status',
      mandatory: false,
      readOnly: true,
      choices: ['success', 'breach', 'in_progress', 'paused'],
      description: 'Current SLA status'
    },
    
    // Dates & Lifecycle
    {
      name: 'opened_at',
      type: 'date_time',
      label: 'Opened',
      mandatory: false,
      readOnly: true,
      description: 'When case was opened'
    },
    {
      name: 'updated_at',
      type: 'date_time',
      label: 'Updated',
      mandatory: false,
      readOnly: true,
      description: 'Last update time'
    },
    {
      name: 'resolved_at',
      type: 'date_time',
      label: 'Resolved',
      mandatory: false,
      description: 'When case was resolved'
    },
    {
      name: 'closed_at',
      type: 'date_time',
      label: 'Closed',
      mandatory: false,
      description: 'When case was closed'
    },
    {
      name: 'reopened_count',
      type: 'integer',
      label: 'Reopened Count',
      mandatory: false,
      defaultValue: 0,
      description: 'Number of times case has been reopened'
    },
    
    // Resolution
    {
      name: 'resolution_code',
      type: 'choice',
      label: 'Resolution Code',
      mandatory: false,
      choices: [
        'Resolved',
        'Unable to Resolve',
        'Duplicate',
        'No Further Action',
        'Customer Request'
      ],
      description: 'How the case was resolved'
    },
    {
      name: 'resolution_notes',
      type: 'text',
      label: 'Resolution Notes',
      mandatory: false,
      description: 'Details about the resolution'
    },
    
    // Communication & Notes
    {
      name: 'work_notes',
      type: 'text',
      label: 'Work Notes',
      mandatory: false,
      description: 'Internal notes (not visible to customer)'
    },
    {
      name: 'comments',
      type: 'text',
      label: 'Comments',
      mandatory: false,
      description: 'Customer-visible comments'
    },
    
    // Escalation & Satisfaction
    {
      name: 'is_escalated',
      type: 'boolean',
      label: 'Escalated',
      mandatory: false,
      defaultValue: false,
      description: 'Whether case has been escalated'
    },
    {
      name: 'escalation_reason',
      type: 'text',
      label: 'Escalation Reason',
      mandatory: false,
      description: 'Reason for escalation'
    },
    {
      name: 'customer_satisfaction',
      type: 'choice',
      label: 'Satisfaction',
      mandatory: false,
      choices: [
        '1 - Very Dissatisfied',
        '2 - Dissatisfied',
        '3 - Neutral',
        '4 - Satisfied',
        '5 - Very Satisfied'
      ],
      description: 'Customer satisfaction rating'
    },
    {
      name: 'feedback_provided',
      type: 'boolean',
      label: 'Feedback Provided',
      mandatory: false,
      defaultValue: false,
      description: 'Whether customer provided feedback'
    }
  ]
};

// ============================================================
// TABLE 2: CUSTOMER ACCOUNT TABLE
// ============================================================

export const CUSTOMER_ACCOUNT_TABLE = {
  name: 'Customer Account',
  tableName: 'x_20261805_csm_customer_account',
  extends: 'cmn_companies',
  displayField: 'name',
  label: 'Customer Account',
  plural: 'Customer Accounts',
  isExtensible: true,
  description: 'Represents customer organizations and accounts',
  
  fields: [
    // Core Fields (inherited from cmn_companies)
    {
      name: 'name',
      type: 'string',
      label: 'Account Name',
      mandatory: true,
      maxLength: 160,
      example: 'Acme Corporation',
      description: 'Name of the customer account'
    },
    {
      name: 'account_type',
      type: 'choice',
      label: 'Account Type',
      mandatory: false,
      choices: ['Enterprise', 'Mid-Market', 'SMB', 'Startup', 'Individual'],
      description: 'Type/size of customer account'
    },
    {
      name: 'industry',
      type: 'string',
      label: 'Industry',
      mandatory: false,
      maxLength: 100,
      example: 'Technology, Finance, Healthcare',
      description: 'Industry classification'
    },
    {
      name: 'status',
      type: 'choice',
      label: 'Status',
      mandatory: false,
      defaultValue: 'Active',
      choices: ['Active', 'Prospect', 'Inactive', 'At Risk'],
      description: 'Account status'
    },
    
    // Contact Information
    {
      name: 'billing_email',
      type: 'email',
      label: 'Billing Email',
      mandatory: false,
      example: 'billing@acme.com',
      description: 'Email for billing inquiries'
    },
    {
      name: 'support_email',
      type: 'email',
      label: 'Support Email',
      mandatory: false,
      example: 'support@acme.com',
      description: 'Email for support inquiries'
    },
    {
      name: 'phone',
      type: 'phone_number',
      label: 'Phone',
      mandatory: false,
      example: '555-0100',
      description: 'Main phone number'
    },
    {
      name: 'website',
      type: 'url',
      label: 'Website',
      mandatory: false,
      example: 'https://www.acme.com',
      description: 'Company website'
    },
    
    // Address Information
    {
      name: 'street',
      type: 'string',
      label: 'Street',
      mandatory: false,
      maxLength: 160,
      example: '123 Business Ave',
      description: 'Street address'
    },
    {
      name: 'city',
      type: 'string',
      label: 'City',
      mandatory: false,
      maxLength: 100,
      description: 'City'
    },
    {
      name: 'state',
      type: 'string',
      label: 'State/Province',
      mandatory: false,
      maxLength: 50,
      description: 'State or province'
    },
    {
      name: 'zip_code',
      type: 'string',
      label: 'Zip/Postal Code',
      mandatory: false,
      maxLength: 20,
      description: 'Zip or postal code'
    },
    {
      name: 'country',
      type: 'string',
      label: 'Country',
      mandatory: false,
      maxLength: 100,
      description: 'Country'
    },
    
    // Business Information
    {
      name: 'annual_revenue',
      type: 'currency',
      label: 'Annual Revenue',
      mandatory: false,
      example: '50000000',
      description: 'Annual revenue (for reference)'
    },
    {
      name: 'employee_count',
      type: 'integer',
      label: 'Employee Count',
      mandatory: false,
      example: '500',
      description: 'Number of employees'
    },
    {
      name: 'account_manager',
      type: 'reference',
      reference: 'sys_user',
      label: 'Account Manager',
      mandatory: false,
      description: 'Primary account manager'
    },
    {
      name: 'support_tier',
      type: 'choice',
      label: 'Support Tier',
      mandatory: false,
      choices: ['Basic', 'Standard', 'Premium', 'Enterprise'],
      description: 'Support level/tier'
    },
    {
      name: 'service_level_agreement',
      type: 'reference',
      reference: 'sla',
      label: 'SLA',
      mandatory: false,
      description: 'Service level agreement'
    },
    
    // Additional Fields
    {
      name: 'customer_since',
      type: 'date',
      label: 'Customer Since',
      mandatory: false,
      description: 'When customer relationship started'
    },
    {
      name: 'notes',
      type: 'text',
      label: 'Account Notes',
      mandatory: false,
      description: 'Internal notes about account'
    }
  ]
};

// ============================================================
// TABLE 3: CUSTOMER CONTACT TABLE
// ============================================================

export const CUSTOMER_CONTACT_TABLE = {
  name: 'Customer Contact',
  tableName: 'x_20261805_csm_customer_contact',
  extends: 'contact',
  displayField: 'name',
  label: 'Customer Contact',
  plural: 'Customer Contacts',
  isExtensible: true,
  description: 'Represents individual contacts/people at customer organizations',
  
  fields: [
    // Core Fields (inherited from contact)
    {
      name: 'first_name',
      type: 'string',
      label: 'First Name',
      mandatory: true,
      maxLength: 100,
      example: 'John',
      description: 'First name'
    },
    {
      name: 'last_name',
      type: 'string',
      label: 'Last Name',
      mandatory: true,
      maxLength: 100,
      example: 'Smith',
      description: 'Last name'
    },
    {
      name: 'name',
      type: 'string',
      label: 'Name',
      mandatory: true,
      readOnly: true,
      example: 'John Smith',
      description: 'Full name (auto-generated)'
    },
    
    // Organization Reference
    {
      name: 'customer_account',
      type: 'reference',
      reference: 'x_20261805_csm_customer_account',
      label: 'Customer Account',
      mandatory: true,
      description: 'Associated customer account'
    },
    
    // Contact Information
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      mandatory: true,
      example: 'john.smith@acme.com',
      description: 'Email address'
    },
    {
      name: 'phone',
      type: 'phone_number',
      label: 'Phone',
      mandatory: false,
      example: '555-0123',
      description: 'Phone number'
    },
    {
      name: 'mobile_phone',
      type: 'phone_number',
      label: 'Mobile Phone',
      mandatory: false,
      description: 'Mobile phone number'
    },
    {
      name: 'fax',
      type: 'phone_number',
      label: 'Fax',
      mandatory: false,
      description: 'Fax number'
    },
    
    // Role & Responsibility
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      mandatory: false,
      maxLength: 100,
      example: 'IT Manager',
      description: 'Job title'
    },
    {
      name: 'department',
      type: 'string',
      label: 'Department',
      mandatory: false,
      maxLength: 100,
      example: 'Information Technology',
      description: 'Department'
    },
    {
      name: 'role',
      type: 'choice',
      label: 'Role',
      mandatory: false,
      choices: [
        'Technical Contact',
        'Billing Contact',
        'Executive',
        'Decision Maker',
        'End User',
        'Other'
      ],
      description: 'Role in support context'
    },
    {
      name: 'is_primary_contact',
      type: 'boolean',
      label: 'Primary Contact',
      mandatory: false,
      defaultValue: false,
      description: 'Is this the primary contact for the account'
    },
    
    // Contact Preferences
    {
      name: 'preferred_contact_method',
      type: 'choice',
      label: 'Preferred Contact Method',
      mandatory: false,
      choices: ['Email', 'Phone', 'Mobile', 'Fax'],
      defaultValue: 'Email',
      description: 'Preferred method of contact'
    },
    {
      name: 'notification_enabled',
      type: 'boolean',
      label: 'Notification Enabled',
      mandatory: false,
      defaultValue: true,
      description: 'Receive case notifications'
    },
    
    // Status
    {
      name: 'status',
      type: 'choice',
      label: 'Status',
      mandatory: false,
      choices: ['Active', 'Inactive', 'Left Company'],
      defaultValue: 'Active',
      description: 'Contact status'
    },
    
    // Additional Information
    {
      name: 'language',
      type: 'choice',
      label: 'Language',
      mandatory: false,
      choices: ['English', 'Spanish', 'French', 'German', 'Other'],
      defaultValue: 'English',
      description: 'Preferred language'
    },
    {
      name: 'notes',
      type: 'text',
      label: 'Notes',
      mandatory: false,
      description: 'Internal notes about contact'
    }
  ]
};

// ============================================================
// TABLE 4: CASE CATEGORY TABLE
// ============================================================

export const CASE_CATEGORY_TABLE = {
  name: 'Case Category',
  tableName: 'x_20261805_csm_case_category',
  extends: 'sys_metadata',
  displayField: 'name',
  label: 'Case Category',
  plural: 'Case Categories',
  isExtensible: true,
  description: 'Defines categories for case classification and routing',
  
  fields: [
    // Core Fields
    {
      name: 'name',
      type: 'string',
      label: 'Category Name',
      mandatory: true,
      maxLength: 100,
      unique: true,
      example: 'Technical Support',
      description: 'Name of the category'
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      mandatory: false,
      example: 'Technical issues and troubleshooting',
      description: 'Category description'
    },
    
    // Routing Information
    {
      name: 'assignment_group',
      type: 'reference',
      reference: 'sys_user_group',
      label: 'Assignment Group',
      mandatory: true,
      description: 'Default group for this category'
    },
    {
      name: 'sla_policy',
      type: 'reference',
      reference: 'sla',
      label: 'Default SLA Policy',
      mandatory: false,
      description: 'Default SLA for this category'
    },
    
    // Configuration
    {
      name: 'requires_approval',
      type: 'boolean',
      label: 'Requires Approval',
      mandatory: false,
      defaultValue: false,
      description: 'Whether cases require approval'
    },
    {
      name: 'can_be_self_resolved',
      type: 'boolean',
      label: 'Can Be Self Resolved',
      mandatory: false,
      defaultValue: true,
      description: 'Whether customers can self-resolve'
    },
    {
      name: 'active',
      type: 'boolean',
      label: 'Active',
      mandatory: false,
      defaultValue: true,
      description: 'Is this category active for selection'
    },
    {
      name: 'display_order',
      type: 'integer',
      label: 'Display Order',
      mandatory: false,
      description: 'Order in which to display in lists'
    },
    
    // Subcategories
    {
      name: 'subcategories',
      type: 'text',
      label: 'Subcategories',
      mandatory: false,
      example: 'Password Reset, Account Access, Login Issues',
      description: 'Comma-separated list of subcategories'
    },
    
    // Keywords for Search
    {
      name: 'keywords',
      type: 'text',
      label: 'Keywords',
      mandatory: false,
      example: 'account, access, login, password',
      description: 'Keywords for categorization AI'
    },
    
    // Notifications
    {
      name: 'manager_email',
      type: 'email',
      label: 'Manager Email',
      mandatory: false,
      description: 'Email for category manager'
    },
    {
      name: 'escalation_group',
      type: 'reference',
      reference: 'sys_user_group',
      label: 'Escalation Group',
      mandatory: false,
      description: 'Group for escalations'
    }
  ]
};

// ============================================================
// TABLE 5: CASE NOTES / COMMUNICATION TABLE
// ============================================================

export const CASE_COMMUNICATION_TABLE = {
  name: 'Case Communication',
  tableName: 'x_20261805_csm_case_communication',
  extends: 'sys_metadata',
  displayField: 'communication_id',
  label: 'Case Communication',
  plural: 'Case Communications',
  isExtensible: true,
  description: 'Tracks all communications and notes related to a case',
  
  fields: [
    // Identity
    {
      name: 'communication_id',
      type: 'string',
      label: 'Communication ID',
      mandatory: true,
      readOnly: true,
      autoNumber: true,
      example: 'COMM-0001234',
      description: 'Unique communication identifier'
    },
    
    // Case Reference
    {
      name: 'case_id',
      type: 'reference',
      reference: 'x_20261805_csm_customer_case',
      label: 'Case',
      mandatory: true,
      description: 'The associated case'
    },
    
    // Communication Type
    {
      name: 'communication_type',
      type: 'choice',
      label: 'Type',
      mandatory: true,
      choices: [
        'Note',
        'Comment',
        'Email',
        'Phone Call',
        'Chat',
        'Video Call',
        'Attachment Upload',
        'Status Update'
      ],
      description: 'Type of communication'
    },
    
    // Sender Information
    {
      name: 'sender_type',
      type: 'choice',
      label: 'Sender Type',
      mandatory: true,
      choices: ['Agent', 'Customer', 'System'],
      description: 'Who sent this communication'
    },
    {
      name: 'sender_user',
      type: 'reference',
      reference: 'sys_user',
      label: 'Agent/User',
      mandatory: false,
      description: 'The agent who sent (if applicable)'
    },
    {
      name: 'sender_contact',
      type: 'reference',
      reference: 'x_20261805_csm_customer_contact',
      label: 'Customer Contact',
      mandatory: false,
      description: 'The customer contact who sent (if applicable)'
    },
    {
      name: 'sender_email',
      type: 'email',
      label: 'Sender Email',
      mandatory: false,
      description: 'Email of the sender'
    },
    {
      name: 'sender_name',
      type: 'string',
      label: 'Sender Name',
      mandatory: true,
      maxLength: 100,
      description: 'Name of the sender'
    },
    
    // Content
    {
      name: 'content',
      type: 'text',
      label: 'Content',
      mandatory: true,
      example: 'I investigated the issue and found the root cause...',
      description: 'Communication content/message'
    },
    {
      name: 'subject',
      type: 'string',
      label: 'Subject',
      mandatory: false,
      maxLength: 160,
      example: 'Update on your case',
      description: 'Subject line (for emails)'
    },
    
    // Visibility & Privacy
    {
      name: 'visibility',
      type: 'choice',
      label: 'Visibility',
      mandatory: true,
      defaultValue: 'internal',
      choices: [
        'Internal',
        'Customer',
        'Both'
      ],
      description: 'Who can see this communication'
    },
    {
      name: 'is_internal_note',
      type: 'boolean',
      label: 'Internal Note',
      mandatory: false,
      defaultValue: false,
      description: 'Is this an internal-only note'
    },
    
    // Attachments
    {
      name: 'attachment_count',
      type: 'integer',
      label: 'Attachment Count',
      mandatory: false,
      defaultValue: 0,
      readOnly: true,
      description: 'Number of attachments'
    },
    {
      name: 'attachment_ids',
      type: 'string',
      label: 'Attachment IDs',
      mandatory: false,
      description: 'Comma-separated attachment sys_ids'
    },
    
    // Metadata
    {
      name: 'created_at',
      type: 'date_time',
      label: 'Created',
      mandatory: true,
      readOnly: true,
      description: 'When this communication was created'
    },
    {
      name: 'created_by',
      type: 'reference',
      reference: 'sys_user',
      label: 'Created By',
      mandatory: false,
      readOnly: true,
      description: 'System user who created record'
    },
    {
      name: 'updated_at',
      type: 'date_time',
      label: 'Updated',
      mandatory: false,
      readOnly: true,
      description: 'Last update time'
    },
    {
      name: 'updated_by',
      type: 'reference',
      reference: 'sys_user',
      label: 'Updated By',
      mandatory: false,
      readOnly: true,
      description: 'Last person to update'
    },
    
    // Email-specific Fields
    {
      name: 'email_to',
      type: 'string',
      label: 'To',
      mandatory: false,
      description: 'Email TO addresses (comma-separated)'
    },
    {
      name: 'email_cc',
      type: 'string',
      label: 'CC',
      mandatory: false,
      description: 'Email CC addresses (comma-separated)'
    },
    {
      name: 'email_bcc',
      type: 'string',
      label: 'BCC',
      mandatory: false,
      description: 'Email BCC addresses (comma-separated)'
    },
    {
      name: 'email_subject',
      type: 'string',
      label: 'Email Subject',
      mandatory: false,
      maxLength: 160,
      description: 'Original email subject'
    },
    
    // Phone Call Specific
    {
      name: 'call_duration_minutes',
      type: 'integer',
      label: 'Call Duration (minutes)',
      mandatory: false,
      description: 'Duration of phone call'
    },
    {
      name: 'call_outcome',
      type: 'choice',
      label: 'Call Outcome',
      mandatory: false,
      choices: [
        'Resolved',
        'Escalated',
        'Scheduled Callback',
        'Unable to Reach',
        'Voicemail'
      ],
      description: 'Outcome of phone call'
    },
    
    // Sentiment & Rating
    {
      name: 'sentiment',
      type: 'choice',
      label: 'Sentiment',
      mandatory: false,
      choices: ['Positive', 'Neutral', 'Negative'],
      description: 'Sentiment of communication'
    },
    {
      name: 'satisfaction_rating',
      type: 'choice',
      label: 'Satisfaction Rating',
      mandatory: false,
      choices: ['1 - Very Dissatisfied', '2 - Dissatisfied', '3 - Neutral', '4 - Satisfied', '5 - Very Satisfied'],
      description: 'Customer satisfaction with this interaction'
    },
    
    // Resolution Related
    {
      name: 'resolution_provided',
      type: 'boolean',
      label: 'Resolution Provided',
      mandatory: false,
      defaultValue: false,
      description: 'Does this contain a resolution'
    },
    {
      name: 'next_action',
      type: 'text',
      label: 'Next Action',
      mandatory: false,
      description: 'What action to take next'
    },
    {
      name: 'next_action_by',
      type: 'date_time',
      label: 'Next Action By',
      mandatory: false,
      description: 'Target date for next action'
    }
  ]
};

// ============================================================
// TABLE RELATIONSHIPS
// ============================================================

export const TABLE_RELATIONSHIPS = {
  descriptions: [
    {
      from: 'Customer Case',
      to: 'Customer Account',
      type: 'Many-to-One',
      field: 'customer_account',
      description: 'Each case belongs to one account'
    },
    {
      from: 'Customer Case',
      to: 'Customer Contact',
      type: 'Many-to-One',
      field: 'customer_contact',
      description: 'Each case is associated with one contact'
    },
    {
      from: 'Customer Case',
      to: 'Case Category',
      type: 'Many-to-One',
      field: 'case_category',
      description: 'Each case has one category'
    },
    {
      from: 'Case Communication',
      to: 'Customer Case',
      type: 'Many-to-One',
      field: 'case_id',
      description: 'Each communication belongs to one case'
    },
    {
      from: 'Customer Contact',
      to: 'Customer Account',
      type: 'Many-to-One',
      field: 'customer_account',
      description: 'Multiple contacts belong to one account'
    },
    {
      from: 'Case Category',
      to: 'User Group',
      type: 'Many-to-One',
      field: 'assignment_group',
      description: 'Each category routes to one group'
    }
  ]
};

// ============================================================
// TABLE CONFIGURATION SUMMARY
// ============================================================

export const TABLE_SUMMARY = {
  tables: [
    {
      name: 'Customer Case',
      tableName: 'x_20261805_csm_customer_case',
      fields: 34,
      extends: 'task',
      purpose: 'Main case management table'
    },
    {
      name: 'Customer Account',
      tableName: 'x_20261805_csm_customer_account',
      fields: 18,
      extends: 'cmn_companies',
      purpose: 'Customer organization data'
    },
    {
      name: 'Customer Contact',
      tableName: 'x_20261805_csm_customer_contact',
      fields: 18,
      extends: 'contact',
      purpose: 'Individual contact management'
    },
    {
      name: 'Case Category',
      tableName: 'x_20261805_csm_case_category',
      fields: 14,
      extends: 'sys_metadata',
      purpose: 'Case classification and routing'
    },
    {
      name: 'Case Communication',
      tableName: 'x_20261805_csm_case_communication',
      fields: 33,
      extends: 'sys_metadata',
      purpose: 'Communication history and notes'
    }
  ],
  
  totalFields: 117,
  totalTables: 5,
  
  mandatoryFieldsByTable: {
    'Customer Case': ['number', 'short_description', 'customer_account', 'customer_contact', 'customer_email', 'priority', 'case_category', 'state'],
    'Customer Account': ['name'],
    'Customer Contact': ['first_name', 'last_name', 'name', 'customer_account', 'email'],
    'Case Category': ['name', 'assignment_group'],
    'Case Communication': ['communication_id', 'case_id', 'communication_type', 'sender_type', 'sender_name', 'content', 'visibility', 'created_at']
  }
};

export default {
  CUSTOMER_CASE_TABLE,
  CUSTOMER_ACCOUNT_TABLE,
  CUSTOMER_CONTACT_TABLE,
  CASE_CATEGORY_TABLE,
  CASE_COMMUNICATION_TABLE,
  TABLE_RELATIONSHIPS,
  TABLE_SUMMARY
};
