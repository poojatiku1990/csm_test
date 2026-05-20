/**
 * CSM Configuration and Setup Guide
 * This file demonstrates how to configure and test the CSM application
 */

/**
 * 1. PRIORITY CONFIGURATION
 * Configure SLA times based on priority levels
 */
export const PRIORITY_CONFIG = {
  // Priority 1: Critical - 2 hour SLA
  1: {
    name: 'Critical',
    slaHours: 2,
    autoRoute: true,
    notificationGroup: 'high_priority_support_group'
  },
  // Priority 2: High - 2 hour SLA
  2: {
    name: 'High',
    slaHours: 2,
    autoRoute: true,
    notificationGroup: 'high_priority_support_group'
  },
  // Priority 3: Medium - 4 hour SLA
  3: {
    name: 'Medium',
    slaHours: 4,
    autoRoute: false,
    notificationGroup: 'general_support_group'
  },
  // Priority 4: Low - 8 hour SLA
  4: {
    name: 'Low',
    slaHours: 8,
    autoRoute: true,
    notificationGroup: 'high_priority_support_group'
  },
  // Priority 5: Minimal - 8 hour SLA
  5: {
    name: 'Minimal',
    slaHours: 8,
    autoRoute: true,
    notificationGroup: 'high_priority_support_group'
  }
};

/**
 * 2. FLOW ROUTING RULES
 * Configure routing thresholds and queues
 */
export const FLOW_RULES = {
  highPriorityThreshold: 4,  // Priority >= 4 triggers high-priority flow
  highPriorityQueue: 'high_priority_support_queue',
  notificationEnabled: true,
  autoStateTransition: 'in_progress'
};

/**
 * 3. VALIDATION RULES
 * Client-side and server-side validation configuration
 */
export const VALIDATION_RULES = {
  priority: {
    min: 1,
    max: 5,
    required: true,
    errorMessage: 'Priority must be between 1 and 5'
  },
  caseNumber: {
    required: true,
    pattern: /^CSE-\d{6}$/,
    errorMessage: 'Case number must match format: CSE-XXXXXX'
  },
  shortDescription: {
    required: true,
    minLength: 10,
    maxLength: 255,
    errorMessage: 'Description must be between 10 and 255 characters'
  },
  state: {
    required: true,
    allowedValues: ['open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed'],
    errorMessage: 'Invalid case state'
  }
};

/**
 * 4. EXAMPLE TEST CASES
 * Sample data for testing the CSM application
 */
export const TEST_CASES = [
  {
    case_number: 'CSE-000001',
    short_description: 'User cannot access customer portal - critical issue blocking business',
    priority: 1,
    state: 'open',
    assigned_to: null  // Will be auto-assigned
  },
  {
    case_number: 'CSE-000002',
    short_description: 'API timeout errors during peak hours',
    priority: 2,
    state: 'open',
    assigned_to: null  // Will be auto-assigned
  },
  {
    case_number: 'CSE-000003',
    short_description: 'Dashboard report taking longer to load',
    priority: 3,
    state: 'open',
    assigned_to: null
  },
  {
    case_number: 'CSE-000004',
    short_description: 'Typo in help documentation',
    priority: 5,
    state: 'open',
    assigned_to: null
  }
];

/**
 * 5. AUTOMATED WORKFLOWS
 * Expected workflow when a case is created
 */
export const WORKFLOW_SEQUENCE = {
  onCaseCreate: [
    '1. Case inserted into x_20261805_csm_customer_case table',
    '2. Business rule executes: assigned_to is assigned to current user',
    '3. Case state set to "open"',
    '4. SLA deadline calculated and stored'
  ],
  
  onHighPriority: [
    '1. Case created with priority >= 4',
    '2. Flow condition evaluates to true',
    '3. Case state auto-transitioned to "in_progress"',
    '4. Case added to high_priority_support_queue',
    '5. Notification sent to high_priority_support_group',
    '6. Activity logged for audit trail'
  ],
  
  onClientUpdate: [
    '1. User modifies priority field on form',
    '2. Client script onChange triggers validation',
    '3. Validates priority is between 1-5',
    '4. Shows error if invalid, clears if valid',
    '5. User submits form',
    '6. onSubmit client script re-validates priority',
    '7. Form submission blocked if priority invalid'
  ]
};

/**
 * 6. SLA CALCULATION EXAMPLES
 */
export const SLA_EXAMPLES = [
  {
    priority: 1,
    createdDate: '2026-05-20 09:00:00',
    slaHours: 2,
    deadline: '2026-05-20 11:00:00'
  },
  {
    priority: 3,
    createdDate: '2026-05-20 09:00:00',
    slaHours: 4,
    deadline: '2026-05-20 13:00:00'
  },
  {
    priority: 5,
    createdDate: '2026-05-20 09:00:00',
    slaHours: 8,
    deadline: '2026-05-20 17:00:00'
  }
];

/**
 * 7. INTEGRATION POINTS
 * Where CSM connects with other ServiceNow modules
 */
export const INTEGRATION_POINTS = {
  systemUsers: {
    table: 'sys_user',
    field: 'assigned_to',
    purpose: 'Auto-assign and display assigned user information'
  },
  
  notificationQueues: {
    name: 'high_priority_support_queue',
    purpose: 'Route high-priority cases (priority >= 4)'
  },
  
  userGroups: {
    names: [
      'high_priority_support_group',
      'general_support_group'
    ],
    purpose: 'Send notifications to relevant support teams'
  },
  
  auditLog: {
    purpose: 'Track case routing and state transitions'
  }
};

/**
 * 8. TESTING CHECKLIST
 */
export const TESTING_CHECKLIST = {
  'Auto-Assignment': [
    '□ Create case without assigned_to',
    '□ Verify case is assigned to current user after insert',
    '□ Verify log message appears in business rule log',
    '□ Update case without changing assigned_to',
    '□ Verify assigned_to is not overwritten'
  ],
  
  'Priority Validation': [
    '□ Attempt to set priority to 0 on form',
    '□ Verify error message appears',
    '□ Attempt to set priority to 6 on form',
    '□ Verify error message appears',
    '□ Set priority to 1-5 values',
    '□ Verify no error messages',
    '□ Try to submit form with invalid priority',
    '□ Verify submission is blocked'
  ],
  
  'High-Priority Routing': [
    '□ Create case with priority 1',
    '□ Verify case state changed to in_progress',
    '□ Verify case appears in high_priority_support_queue',
    '□ Verify notification sent to support group',
    '□ Check activity log for routing entry',
    '□ Create case with priority 3',
    '□ Verify flow does NOT trigger (no routing)'
  ],
  
  'SLA Calculation': [
    '□ Create case with priority 1',
    '□ Verify SLA deadline is 2 hours from creation',
    '□ Create case with priority 3',
    '□ Verify SLA deadline is 4 hours from creation',
    '□ Create case with priority 5',
    '□ Verify SLA deadline is 8 hours from creation',
    '□ Check getSLAStatus for case',
    '□ Verify status shows ON_TRACK/CRITICAL/OVERDUE correctly'
  ],
  
  'Bulk Operations': [
    '□ Create multiple cases without SLA deadlines',
    '□ Call bulkUpdateSLADeadlines',
    '□ Verify all cases now have SLA deadlines',
    '□ Check response statistics'
  ]
};

/**
 * 9. TROUBLESHOOTING GUIDE
 */
export const TROUBLESHOOTING = {
  'Case not auto-assigned': {
    causes: [
      'Business rule not active',
      'Business rule filter condition wrong',
      'Current user not recognized',
      'assigned_to field is not empty'
    ],
    solutions: [
      'Check business rule active flag',
      'Review filter condition syntax',
      'Verify gs.getUserID() returns valid value',
      'Clear assigned_to field before insert'
    ]
  },
  
  'Priority validation not working': {
    causes: [
      'Client script not active',
      'Client script not associated with field',
      'Browser cache issue',
      'Incorrect field name'
    ],
    solutions: [
      'Enable client script and reload page',
      'Verify field_name is exactly "priority"',
      'Clear browser cache Ctrl+Shift+Delete',
      'Check form field name against table schema'
    ]
  },
  
  'SLA deadline not calculated': {
    causes: [
      'Script include not loaded',
      'Priority field not populated',
      'created_date not set',
      'SLA calculator script syntax error'
    ],
    solutions: [
      'Verify script include exists and compiles',
      'Ensure priority field has valid value 1-5',
      'Check created_date field is populated',
      'Review error logs in browser console'
    ]
  }
};
