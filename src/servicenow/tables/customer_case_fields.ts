/**
 * Customer Case Table - Field Definitions
 * Scope: x_20261805_csm
 * Table: Customer Case (x_20261805_csm_customer_case)
 * 
 * This file defines all fields for the Customer Case table with
 * recommended field types, default values, and properties.
 * 
 * Created: May 25, 2026
 */

export const CUSTOMER_CASE_FIELDS = [
  // ============================================================
  // IDENTITY & BASIC INFORMATION
  // ============================================================
  
  {
    fieldName: 'number',
    label: 'Case Number',
    type: 'string',
    description: 'Unique auto-generated case identifier',
    mandatory: true,
    readOnly: true,
    maxLength: 40,
    autoNumber: {
      enabled: true,
      prefix: 'CSE',
      numDigits: 7,
      startNumber: 1000000,
      example: 'CSE-1000001'
    },
    displayField: true,
    sortable: true,
    filterable: true,
    defaultValue: null,
    example: 'CSE-1000042'
  },

  {
    fieldName: 'short_description',
    label: 'Short Description',
    type: 'string',
    description: 'Brief summary of the case/issue',
    mandatory: true,
    readOnly: false,
    maxLength: 160,
    placeholder: 'Enter a brief summary of the issue',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: 'Unable to reset password',
    validationRule: {
      minLength: 5,
      pattern: null
    }
  },

  {
    fieldName: 'description',
    label: 'Description',
    type: 'text',
    description: 'Detailed description of the case',
    mandatory: false,
    readOnly: false,
    maxLength: null,
    placeholder: 'Provide detailed information about the issue',
    sortable: false,
    filterable: false,
    searchable: true,
    defaultValue: null,
    example: 'Customer unable to access password reset link sent via email',
    htmlEditor: true
  },

  // ============================================================
  // CUSTOMER INFORMATION
  // ============================================================

  {
    fieldName: 'customer_account',
    label: 'Customer Account',
    type: 'reference',
    reference: 'x_20261805_csm_customer_account',
    description: 'The customer account associated with this case',
    mandatory: true,
    readOnly: false,
    displayField: 'name',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: '[Account_sys_id]',
    cascadeDelete: false,
    reverseLink: {
      enabled: true,
      label: 'Cases'
    }
  },

  {
    fieldName: 'customer_contact',
    label: 'Customer Contact',
    type: 'reference',
    reference: 'x_20261805_csm_customer_contact',
    description: 'The specific contact person for this case',
    mandatory: true,
    readOnly: false,
    displayField: 'name',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: '[Contact_sys_id]',
    cascadeDelete: false,
    reverseLink: {
      enabled: true,
      label: 'Cases'
    },
    dependentOn: {
      field: 'customer_account',
      query: 'customer_account={customer_account}'
    }
  },

  {
    fieldName: 'customer_email',
    label: 'Customer Email',
    type: 'email',
    description: 'Contact email address for customer communication',
    mandatory: true,
    readOnly: false,
    maxLength: 100,
    placeholder: 'customer@example.com',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: 'john.smith@acme.com',
    validationRule: {
      validEmail: true
    }
  },

  {
    fieldName: 'customer_phone',
    label: 'Customer Phone',
    type: 'phone_number',
    description: 'Customer phone number for contact',
    mandatory: false,
    readOnly: false,
    maxLength: 20,
    placeholder: '(555) 123-4567',
    sortable: true,
    filterable: false,
    searchable: true,
    defaultValue: null,
    example: '555-0123'
  },

  // ============================================================
  // CASE CLASSIFICATION
  // ============================================================

  {
    fieldName: 'priority',
    label: 'Priority',
    type: 'choice',
    description: 'Priority level for case resolution',
    mandatory: true,
    readOnly: false,
    choices: [
      { value: '1', label: '1 - Critical' },
      { value: '2', label: '2 - High' },
      { value: '3', label: '3 - Medium' },
      { value: '4', label: '4 - Low' },
      { value: '5', label: '5 - Minimal' }
    ],
    defaultValue: '3',
    sortable: true,
    filterable: true,
    example: '2',
    affectsSLA: true,
    orderingField: 'priority'
  },

  {
    fieldName: 'category',
    label: 'Category',
    type: 'reference',
    reference: 'x_20261805_csm_case_category',
    description: 'Category for case classification and routing',
    mandatory: true,
    readOnly: false,
    displayField: 'name',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: '[Category_sys_id]',
    cascadeDelete: false,
    reverseLink: {
      enabled: true,
      label: 'Cases'
    }
  },

  {
    fieldName: 'subcategory',
    label: 'Subcategory',
    type: 'string',
    description: 'Subcategory for additional classification',
    mandatory: false,
    readOnly: false,
    maxLength: 100,
    placeholder: 'Select or enter subcategory',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: 'Password Reset',
    dependentOn: {
      field: 'category',
      query: 'parent={category}'
    }
  },

  // ============================================================
  // CASE STATE & LIFECYCLE
  // ============================================================

  {
    fieldName: 'state',
    label: 'State',
    type: 'choice',
    description: 'Current state of the case in its lifecycle',
    mandatory: true,
    readOnly: false,
    choices: [
      { value: 'new', label: 'New', displayColor: 'rgb(0, 0, 255)' },
      { value: 'open', label: 'Open', displayColor: 'rgb(255, 165, 0)' },
      { value: 'in_progress', label: 'In Progress', displayColor: 'rgb(255, 200, 0)' },
      { value: 'waiting_on_customer', label: 'Waiting on Customer', displayColor: 'rgb(128, 128, 128)' },
      { value: 'resolved', label: 'Resolved', displayColor: 'rgb(144, 238, 144)' },
      { value: 'closed', label: 'Closed', displayColor: 'rgb(0, 100, 0)' },
      { value: 'cancelled', label: 'Cancelled', displayColor: 'rgb(192, 192, 192)' }
    ],
    defaultValue: 'new',
    sortable: true,
    filterable: true,
    example: 'in_progress',
    stateTransitions: {
      new: ['open', 'cancelled'],
      open: ['in_progress', 'waiting_on_customer', 'cancelled'],
      in_progress: ['waiting_on_customer', 'resolved', 'cancelled'],
      waiting_on_customer: ['in_progress', 'cancelled'],
      resolved: ['closed', 'open'],
      closed: ['open'],
      cancelled: []
    }
  },

  // ============================================================
  // ASSIGNMENT & ROUTING
  // ============================================================

  {
    fieldName: 'assignment_group',
    label: 'Assignment Group',
    type: 'reference',
    reference: 'sys_user_group',
    description: 'Support team assigned to handle this case',
    mandatory: false,
    readOnly: false,
    displayField: 'name',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: '[Group_sys_id]',
    cascadeDelete: false,
    reverseLink: {
      enabled: true,
      label: 'Cases'
    }
  },

  {
    fieldName: 'assigned_to',
    label: 'Assigned To',
    type: 'reference',
    reference: 'sys_user',
    description: 'Individual agent assigned to this case',
    mandatory: false,
    readOnly: false,
    displayField: 'name',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: '[User_sys_id]',
    cascadeDelete: false,
    reverseLink: {
      enabled: true,
      label: 'Cases'
    }
  },

  {
    fieldName: 'assigned_to_date',
    label: 'Assigned To Date',
    type: 'date_time',
    description: 'Date and time when the case was assigned',
    mandatory: false,
    readOnly: true,
    sortable: true,
    filterable: true,
    defaultValue: null,
    example: '2026-05-25 14:30:00',
    autoPopulate: {
      trigger: 'assigned_to_changed'
    }
  },

  // ============================================================
  // SLA MANAGEMENT
  // ============================================================

  {
    fieldName: 'sla_policy',
    label: 'SLA Policy',
    type: 'reference',
    reference: 'sla',
    description: 'Service Level Agreement applied to this case',
    mandatory: false,
    readOnly: false,
    displayField: 'name',
    sortable: true,
    filterable: true,
    searchable: true,
    defaultValue: null,
    example: '[SLA_sys_id]',
    cascadeDelete: false
  },

  {
    fieldName: 'sla_due_date',
    label: 'SLA Due Date',
    type: 'date_time',
    description: 'Target date/time for SLA resolution',
    mandatory: false,
    readOnly: true,
    sortable: true,
    filterable: true,
    defaultValue: null,
    example: '2026-05-26 14:30:00',
    autoCalculated: {
      formula: 'opened_at + (sla_policy.response_time)'
    }
  },

  {
    fieldName: 'response_sla',
    label: 'Response SLA',
    type: 'reference',
    reference: 'sla_instance',
    description: 'Response time SLA instance tracking',
    mandatory: false,
    readOnly: true,
    displayField: 'name',
    sortable: false,
    filterable: false,
    example: '[SLA_Instance_sys_id]'
  },

  {
    fieldName: 'resolution_sla',
    label: 'Resolution SLA',
    type: 'reference',
    reference: 'sla_instance',
    description: 'Resolution time SLA instance tracking',
    mandatory: false,
    readOnly: true,
    displayField: 'name',
    sortable: false,
    filterable: false,
    example: '[SLA_Instance_sys_id]'
  },

  {
    fieldName: 'sla_status',
    label: 'SLA Status',
    type: 'choice',
    description: 'Current status of SLA tracking',
    mandatory: false,
    readOnly: true,
    choices: [
      { value: 'active', label: 'Active' },
      { value: 'success', label: 'Success' },
      { value: 'breach', label: 'Breach' },
      { value: 'paused', label: 'Paused' }
    ],
    defaultValue: null,
    sortable: true,
    filterable: true,
    example: 'active'
  },

  // ============================================================
  // TIMESTAMPS & LIFECYCLE DATES
  // ============================================================

  {
    fieldName: 'opened_at',
    label: 'Opened On',
    type: 'date_time',
    description: 'Date and time when the case was opened',
    mandatory: false,
    readOnly: true,
    sortable: true,
    filterable: true,
    defaultValue: 'now()',
    example: '2026-05-25 10:00:00',
    autoPopulate: {
      trigger: 'state_changed_to_open'
    }
  },

  {
    fieldName: 'updated_on',
    label: 'Updated On',
    type: 'date_time',
    description: 'Date and time of last update',
    mandatory: false,
    readOnly: true,
    sortable: true,
    filterable: true,
    defaultValue: 'now()',
    example: '2026-05-25 14:30:00',
    autoPopulate: {
      trigger: 'any_field_updated'
    }
  },

  {
    fieldName: 'resolved_at',
    label: 'Resolved On',
    type: 'date_time',
    description: 'Date and time when the case was resolved',
    mandatory: false,
    readOnly: false,
    sortable: true,
    filterable: true,
    defaultValue: null,
    example: '2026-05-25 16:00:00',
    autoPopulate: {
      trigger: 'state_changed_to_resolved'
    }
  },

  {
    fieldName: 'closed_at',
    label: 'Closed On',
    type: 'date_time',
    description: 'Date and time when the case was closed',
    mandatory: false,
    readOnly: false,
    sortable: true,
    filterable: true,
    defaultValue: null,
    example: '2026-05-26 09:00:00',
    autoPopulate: {
      trigger: 'state_changed_to_closed'
    }
  },

  {
    fieldName: 'created_on',
    label: 'Created On',
    type: 'date_time',
    description: 'System date/time when record was created',
    mandatory: false,
    readOnly: true,
    sortable: true,
    filterable: true,
    defaultValue: 'now()',
    example: '2026-05-25 09:30:00'
  },

  // ============================================================
  // RESOLUTION & CLOSURE
  // ============================================================

  {
    fieldName: 'resolution_code',
    label: 'Resolution Code',
    type: 'choice',
    description: 'How the case was resolved',
    mandatory: false,
    readOnly: false,
    choices: [
      { value: 'resolved', label: 'Resolved' },
      { value: 'unable_to_resolve', label: 'Unable to Resolve' },
      { value: 'duplicate', label: 'Duplicate' },
      { value: 'no_action_needed', label: 'No Further Action' },
      { value: 'customer_request', label: 'Customer Request' },
      { value: 'workaround', label: 'Workaround Provided' }
    ],
    defaultValue: null,
    sortable: true,
    filterable: true,
    example: 'resolved',
    requiredWhen: 'state = closed'
  },

  {
    fieldName: 'resolution_notes',
    label: 'Resolution Notes',
    type: 'text',
    description: 'Details about how the case was resolved',
    mandatory: false,
    readOnly: false,
    maxLength: null,
    placeholder: 'Explain how the case was resolved',
    sortable: false,
    filterable: false,
    searchable: true,
    defaultValue: null,
    example: 'Password reset link was resent and customer confirmed successful access',
    htmlEditor: true,
    requiredWhen: 'resolution_code is not null'
  },

  {
    fieldName: 'closure_code',
    label: 'Closure Code',
    type: 'choice',
    description: 'Code indicating why case was closed',
    mandatory: false,
    readOnly: false,
    choices: [
      { value: 'issue_resolved', label: 'Issue Resolved' },
      { value: 'workaround_applied', label: 'Workaround Applied' },
      { value: 'customer_not_responding', label: 'Customer Not Responding' },
      { value: 'customer_cancelled', label: 'Customer Cancelled' },
      { value: 'duplicate_case', label: 'Duplicate Case' },
      { value: 'no_longer_needed', label: 'No Longer Needed' }
    ],
    defaultValue: null,
    sortable: true,
    filterable: true,
    example: 'issue_resolved',
    requiredWhen: 'state = closed'
  },

  {
    fieldName: 'reopened_count',
    label: 'Reopened Count',
    type: 'integer',
    description: 'Number of times this case has been reopened',
    mandatory: false,
    readOnly: true,
    defaultValue: 0,
    sortable: true,
    filterable: true,
    example: 2,
    autoIncrement: {
      trigger: 'state_changed_from_closed_to_open'
    }
  },

  // ============================================================
  // INTERNAL NOTES & COMMUNICATION
  // ============================================================

  {
    fieldName: 'work_notes',
    label: 'Work Notes',
    type: 'text',
    description: 'Internal notes not visible to customer',
    mandatory: false,
    readOnly: false,
    maxLength: null,
    placeholder: 'Add internal notes about your work on this case',
    sortable: false,
    filterable: false,
    searchable: true,
    defaultValue: null,
    example: 'Checked email configuration - settings are correct',
    htmlEditor: true,
    visibleTo: 'internal_only'
  },

  {
    fieldName: 'comments',
    label: 'Comments',
    type: 'text',
    description: 'Customer-visible comments',
    mandatory: false,
    readOnly: false,
    maxLength: null,
    placeholder: 'Add comments visible to the customer',
    sortable: false,
    filterable: false,
    searchable: true,
    defaultValue: null,
    example: 'We have identified the issue and are working on a solution',
    htmlEditor: true,
    visibleTo: 'customer_visible'
  },

  // ============================================================
  // ESCALATION & SATISFACTION
  // ============================================================

  {
    fieldName: 'is_escalated',
    label: 'Escalated',
    type: 'boolean',
    description: 'Whether this case has been escalated',
    mandatory: false,
    readOnly: false,
    defaultValue: false,
    sortable: true,
    filterable: true,
    example: true
  },

  {
    fieldName: 'escalation_reason',
    label: 'Escalation Reason',
    type: 'text',
    description: 'Reason for escalating this case',
    mandatory: false,
    readOnly: false,
    maxLength: null,
    placeholder: 'Explain why this case was escalated',
    sortable: false,
    filterable: false,
    searchable: true,
    defaultValue: null,
    example: 'Customer very dissatisfied, requires immediate attention',
    htmlEditor: false,
    requiredWhen: 'is_escalated = true'
  },

  {
    fieldName: 'customer_satisfaction',
    label: 'Satisfaction',
    type: 'choice',
    description: 'Customer satisfaction rating',
    mandatory: false,
    readOnly: false,
    choices: [
      { value: '1', label: '1 - Very Dissatisfied' },
      { value: '2', label: '2 - Dissatisfied' },
      { value: '3', label: '3 - Neutral' },
      { value: '4', label: '4 - Satisfied' },
      { value: '5', label: '5 - Very Satisfied' }
    ],
    defaultValue: null,
    sortable: true,
    filterable: true,
    example: 5,
    requiredWhen: 'state = closed'
  },

  {
    fieldName: 'feedback_provided',
    label: 'Feedback Provided',
    type: 'boolean',
    description: 'Whether customer provided feedback',
    mandatory: false,
    readOnly: true,
    defaultValue: false,
    sortable: true,
    filterable: true,
    example: true,
    autoPopulate: {
      trigger: 'customer_satisfaction_set'
    }
  }
];

// ============================================================
// FIELD CONFIGURATION SUMMARY
// ============================================================

export const FIELD_SUMMARY = {
  totalFields: CUSTOMER_CASE_FIELDS.length,
  byType: {
    string: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'string').length,
    text: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'text').length,
    choice: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'choice').length,
    reference: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'reference').length,
    date_time: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'date_time').length,
    email: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'email').length,
    phone_number: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'phone_number').length,
    boolean: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'boolean').length,
    integer: CUSTOMER_CASE_FIELDS.filter(f => f.type === 'integer').length
  },
  mandatory: CUSTOMER_CASE_FIELDS.filter(f => f.mandatory).length,
  readOnly: CUSTOMER_CASE_FIELDS.filter(f => f.readOnly).length,
  sortable: CUSTOMER_CASE_FIELDS.filter(f => f.sortable).length,
  filterable: CUSTOMER_CASE_FIELDS.filter(f => f.filterable).length,
  searchable: CUSTOMER_CASE_FIELDS.filter(f => f.searchable).length
};

// ============================================================
// FIELD GROUPING FOR UI ORGANIZATION
// ============================================================

export const FIELD_GROUPS = {
  identity: [
    'number',
    'short_description',
    'description'
  ],
  
  customer: [
    'customer_account',
    'customer_contact',
    'customer_email',
    'customer_phone'
  ],
  
  classification: [
    'priority',
    'category',
    'subcategory'
  ],
  
  lifecycle: [
    'state',
    'opened_at',
    'updated_on',
    'resolved_at',
    'closed_at',
    'created_on'
  ],
  
  assignment: [
    'assignment_group',
    'assigned_to',
    'assigned_to_date'
  ],
  
  sla: [
    'sla_policy',
    'sla_due_date',
    'response_sla',
    'resolution_sla',
    'sla_status'
  ],
  
  resolution: [
    'resolution_code',
    'resolution_notes',
    'closure_code',
    'reopened_count'
  ],
  
  communication: [
    'work_notes',
    'comments'
  ],
  
  escalation: [
    'is_escalated',
    'escalation_reason'
  ],
  
  satisfaction: [
    'customer_satisfaction',
    'feedback_provided'
  ]
};

// ============================================================
// FORM LAYOUTS - How fields appear in UI
// ============================================================

export const FORM_LAYOUTS = {
  createForm: {
    tabName: 'Create New Case',
    sections: [
      {
        name: 'Customer Information',
        fields: ['customer_account', 'customer_contact', 'customer_email', 'customer_phone']
      },
      {
        name: 'Case Details',
        fields: ['short_description', 'description', 'priority', 'category', 'subcategory']
      },
      {
        name: 'Assignment',
        fields: ['assignment_group', 'assigned_to']
      }
    ]
  },

  editForm: {
    tabName: 'Edit Case',
    sections: [
      {
        name: 'Case Information',
        fields: ['number', 'short_description', 'description', 'state', 'priority']
      },
      {
        name: 'Customer',
        fields: ['customer_account', 'customer_contact', 'customer_email', 'customer_phone']
      },
      {
        name: 'Classification',
        fields: ['category', 'subcategory']
      },
      {
        name: 'Assignment',
        fields: ['assignment_group', 'assigned_to', 'assigned_to_date']
      },
      {
        name: 'SLA',
        fields: ['sla_policy', 'sla_due_date', 'sla_status']
      },
      {
        name: 'Notes & Communication',
        fields: ['work_notes', 'comments']
      }
    ]
  },

  resolveForm: {
    tabName: 'Resolve Case',
    sections: [
      {
        name: 'Resolution',
        fields: ['state', 'resolution_code', 'resolution_notes']
      },
      {
        name: 'Escalation',
        fields: ['is_escalated', 'escalation_reason']
      }
    ]
  },

  closeForm: {
    tabName: 'Close Case',
    sections: [
      {
        name: 'Closure Information',
        fields: ['state', 'closure_code', 'resolution_notes', 'customer_satisfaction']
      }
    ]
  }
};

// ============================================================
// DEFAULT VALUES & INITIALIZATION
// ============================================================

export const FIELD_DEFAULTS = {
  priority: '3',
  state: 'new',
  opened_at: () => new Date(),
  created_on: () => new Date(),
  reopened_count: 0,
  is_escalated: false,
  feedback_provided: false,
  sla_status: 'active'
};

// ============================================================
// VALIDATION RULES
// ============================================================

export const VALIDATION_RULES = {
  short_description: {
    required: true,
    minLength: 5,
    maxLength: 160,
    pattern: null,
    errorMessage: 'Short description is required and must be between 5 and 160 characters'
  },
  
  customer_email: {
    required: true,
    format: 'email',
    errorMessage: 'Valid customer email is required'
  },
  
  priority: {
    required: true,
    values: ['1', '2', '3', '4', '5'],
    errorMessage: 'Valid priority level is required'
  },
  
  category: {
    required: true,
    errorMessage: 'Case category is required'
  },
  
  state: {
    required: true,
    values: ['new', 'open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed', 'cancelled'],
    errorMessage: 'Valid state is required'
  },
  
  resolution_notes: {
    required: {
      when: 'state = resolved OR state = closed',
      errorMessage: 'Resolution notes are required for resolved or closed cases'
    }
  },
  
  customer_satisfaction: {
    required: {
      when: 'state = closed',
      errorMessage: 'Customer satisfaction rating is required for closed cases'
    }
  }
};

// ============================================================
// FIELD DEPENDENCIES
// ============================================================

export const FIELD_DEPENDENCIES = {
  customer_contact: {
    dependsOn: 'customer_account',
    filter: 'customer_account = {customer_account}',
    description: 'Only show contacts from selected account'
  },

  subcategory: {
    dependsOn: 'category',
    filter: 'parent = {category}',
    description: 'Show subcategories based on selected category'
  },

  assigned_to: {
    dependsOn: 'assignment_group',
    filter: 'groups = {assignment_group}',
    description: 'Show users in selected assignment group'
  },

  sla_policy: {
    dependsOn: 'category',
    autoPopulate: true,
    description: 'Automatically set SLA based on category'
  },

  resolution_notes: {
    visibleWhen: 'state = resolved OR state = closed',
    requiredWhen: 'state = resolved OR state = closed',
    description: 'Show and require resolution notes when case is resolved or closed'
  },

  closure_code: {
    visibleWhen: 'state = closed',
    requiredWhen: 'state = closed',
    description: 'Show and require closure code when case is closed'
  },

  customer_satisfaction: {
    visibleWhen: 'state = closed',
    requiredWhen: 'state = closed',
    description: 'Show and require satisfaction rating when case is closed'
  },

  escalation_reason: {
    visibleWhen: 'is_escalated = true',
    requiredWhen: 'is_escalated = true',
    description: 'Show and require reason when case is escalated'
  }
};

export default {
  CUSTOMER_CASE_FIELDS,
  FIELD_SUMMARY,
  FIELD_GROUPS,
  FORM_LAYOUTS,
  FIELD_DEFAULTS,
  VALIDATION_RULES,
  FIELD_DEPENDENCIES
};
