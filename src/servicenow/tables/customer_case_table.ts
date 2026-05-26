/**
 * Customer Case Table Definition
 * Scope: x_20261805_csm
 * 
 * This table stores all customer service cases with extended fields for:
 * - Case intake and categorization
 * - Assignment and routing
 * - Status tracking and lifecycle
 * - SLA management
 * - Customer communication
 */

export interface CustomerCaseRecord {
  // Core Fields
  sys_id: string;
  number: string;
  short_description: string;
  description: string;
  
  // Customer Information
  customer: string; // Refers to Accounts table
  customer_contact: string; // Refers to Contacts table
  customer_email: string;
  customer_phone: string;
  
  // Case Classification
  priority: '1' | '2' | '3' | '4' | '5'; // 1=Critical, 5=Minimal
  urgency: '1' | '2' | '3' | '4' | '5';
  impact: '1' | '2' | '3' | '4' | '5';
  category: string;
  subcategory: string;
  
  // Assignment & Routing
  state: 'new' | 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed' | 'cancelled';
  assignment_group: string; // Refers to Group table
  assigned_to: string; // Refers to User table
  assigned_to_date: string;
  
  // Dates & Lifecycle
  opened_at: string;
  updated_at: string;
  resolved_at: string;
  closed_at: string;
  reopened_count: number;
  
  // SLA Information
  sla_policy: string; // Refers to SLA table
  response_sla: string; // Refers to SLA Instance table
  resolution_sla: string; // Refers to SLA Instance table
  sla_status: 'success' | 'breach' | 'in_progress' | 'paused';
  
  // Resolution Information
  resolution_code: string;
  resolution_notes: string;
  
  // Additional Tracking
  work_notes: string;
  comments: string;
  attachments: string[]; // Array of attachment sys_ids
  related_cases: string[]; // Related case sys_ids
  
  // Internal Flags
  is_escalated: boolean;
  escalation_reason: string;
  customer_satisfaction: '1' | '2' | '3' | '4' | '5'; // Survey score
  feedback_provided: boolean;
  
  // Audit
  sys_created_on: string;
  sys_created_by: string;
  sys_updated_on: string;
  sys_updated_by: string;
}

/**
 * Table Configuration for ServiceNow Platform
 */
export const TABLE_CONFIG = {
  name: 'Customer Case',
  tableName: 'x_20261805_csm_customer_case',
  parent: 'task',
  extends: 'task',
  label: 'Customer Case',
  plural: 'Customer Cases',
  
  // Access Control
  acl: {
    create: {
      roles: ['csm_admin', 'csm_agent', 'csm_manager'],
      condition: null
    },
    read: {
      roles: ['csm_admin', 'csm_agent', 'csm_manager', 'csm_viewer'],
      condition: null
    },
    update: {
      roles: ['csm_admin', 'csm_agent', 'csm_manager'],
      condition: null
    },
    delete: {
      roles: ['csm_admin'],
      condition: null
    }
  },
  
  // UI Configuration
  ui: {
    list: {
      fields: ['number', 'short_description', 'customer', 'priority', 'state', 'assigned_to', 'opened_at'],
      filters: ['priority', 'state', 'assignment_group', 'customer'],
      orderBy: ['-opened_at']
    },
    form: {
      sections: [
        {
          label: 'Case Information',
          fields: ['number', 'short_description', 'description', 'priority', 'urgency', 'impact', 'category', 'subcategory']
        },
        {
          label: 'Customer Information',
          fields: ['customer', 'customer_contact', 'customer_email', 'customer_phone']
        },
        {
          label: 'Assignment',
          fields: ['state', 'assignment_group', 'assigned_to', 'assigned_to_date']
        },
        {
          label: 'SLA Tracking',
          fields: ['sla_policy', 'response_sla', 'resolution_sla', 'sla_status']
        },
        {
          label: 'Resolution',
          fields: ['resolved_at', 'resolution_code', 'resolution_notes', 'customer_satisfaction']
        }
      ]
    }
  },
  
  // Service Portal
  servicePortal: {
    enabled: true,
    allowCreation: true,
    allowUpdate: true,
    allowView: true
  }
};

/**
 * Field Definitions for Table Creation
 */
export const FIELDS = [
  {
    name: 'customer',
    type: 'reference',
    reference: 'account',
    label: 'Customer',
    required: true
  },
  {
    name: 'customer_contact',
    type: 'reference',
    reference: 'contact',
    label: 'Contact',
    required: true
  },
  {
    name: 'customer_email',
    type: 'email',
    label: 'Email',
    required: true
  },
  {
    name: 'customer_phone',
    type: 'phone_number',
    label: 'Phone',
    required: false
  },
  {
    name: 'category',
    type: 'choice',
    label: 'Category',
    choices: ['Billing', 'Technical', 'Feature Request', 'Account', 'Other'],
    required: true
  },
  {
    name: 'subcategory',
    type: 'string',
    label: 'Subcategory',
    required: false
  },
  {
    name: 'sla_policy',
    type: 'reference',
    reference: 'sla',
    label: 'SLA Policy',
    required: false
  },
  {
    name: 'resolution_code',
    type: 'choice',
    label: 'Resolution Code',
    choices: ['Resolved', 'Unable to Resolve', 'Duplicate', 'No Further Action', 'Customer Request'],
    required: false
  },
  {
    name: 'resolution_notes',
    type: 'text',
    label: 'Resolution Notes',
    required: false
  },
  {
    name: 'is_escalated',
    type: 'boolean',
    label: 'Is Escalated',
    default: false
  },
  {
    name: 'escalation_reason',
    type: 'text',
    label: 'Escalation Reason',
    required: false
  },
  {
    name: 'customer_satisfaction',
    type: 'choice',
    label: 'Satisfaction Rating',
    choices: ['1 - Very Dissatisfied', '2 - Dissatisfied', '3 - Neutral', '4 - Satisfied', '5 - Very Satisfied'],
    required: false
  },
  {
    name: 'feedback_provided',
    type: 'boolean',
    label: 'Feedback Provided',
    default: false
  }
];
