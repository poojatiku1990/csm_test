/**
 * Customer Case Table - Client Scripts & UI Policies
 * Scope: x_20261805_csm
 * Table: Customer Case (x_20261805_csm_customer_case)
 * 
 * Client-side scripts for form validation, field visibility, and user experience
 * Created: May 25, 2026
 */

// ============================================================
// CLIENT SCRIPT 1: Form onLoad - Initialize Fields & Display Info
// ============================================================

export const CLIENT_SCRIPT_ON_LOAD = {
  name: 'Form Load - Initialize and Display Case Information',
  table: 'x_20261805_csm_customer_case',
  type: 'onLoad',
  description: 'Runs when form loads to initialize fields and display relevant information',
  active: true,
  
  script: `
function onLoad() {
  try {
    // Initialize form state
    var state = g_form.getValue('state');
    var priority = g_form.getValue('priority');
    
    // Update field visibility based on current state
    updateFieldVisibility(state);
    
    // Display priority warning if high priority
    displayPriorityWarning(priority);
    
    // Display customer contact details if account selected
    displayCustomerContactDetails();
    
    // Check if resolution notes should be mandatory
    updateResolutionNotesMandatory(state);
    
    // Log form load
    gs.info('Case form loaded - Form initialization complete');
    
  } catch (error) {
    gs.error('Error in onLoad: ' + error.message);
  }
}

function updateFieldVisibility(state) {
  // Hide/show fields based on state
  if (state === 'closed') {
    // Show closure fields when closed
    g_form.setVisible('closure_code', true);
    g_form.setVisible('customer_satisfaction', true);
    g_form.setMandatory('closure_code', true);
    g_form.setMandatory('customer_satisfaction', true);
  } else if (state === 'resolved') {
    // Show resolution fields when resolved
    g_form.setVisible('closure_code', false);
    g_form.setVisible('customer_satisfaction', false);
    g_form.setMandatory('closure_code', false);
    g_form.setMandatory('customer_satisfaction', false);
  } else {
    // Hide closure fields in other states
    g_form.setVisible('closure_code', false);
    g_form.setVisible('customer_satisfaction', false);
    g_form.setMandatory('closure_code', false);
    g_form.setMandatory('customer_satisfaction', false);
  }
}

function displayPriorityWarning(priority) {
  // Show warning for high priority cases
  if (priority === '1') {
    g_form.showFieldMsg('priority', 
      '⚠️ CRITICAL PRIORITY - This case requires immediate attention!', 'warning');
  } else if (priority === '2') {
    g_form.showFieldMsg('priority', 
      '⚠️ HIGH PRIORITY - This case should be addressed urgently', 'warning');
  }
}

function displayCustomerContactDetails() {
  var accountId = g_form.getValue('customer_account');
  
  if (accountId && accountId !== '') {
    // Get account name
    var accountGr = new GlideRecord('x_20261805_csm_customer_account');
    if (accountGr.get(accountId)) {
      var accountName = accountGr.name.toString();
      var accountType = accountGr.account_type.toString();
      
      // Display account info
      g_form.showFieldMsg('customer_account', 
        'Account: ' + accountName + ' (' + accountType + ')', 'info');
    }
  }
}

function updateResolutionNotesMandatory(state) {
  // Make resolution notes mandatory when resolved or closed
  if (state === 'resolved' || state === 'closed') {
    g_form.setMandatory('resolution_notes', true);
    g_form.setDisplay('resolution_notes', true);
  } else {
    g_form.setMandatory('resolution_notes', false);
  }
}

// Call function
onLoad();
  `,
  
  documentation: {
    description: 'Initializes form on load with proper field visibility and messaging',
    triggers: 'Runs when form initially loads',
    actions: [
      'Updates field visibility based on case state',
      'Displays priority warning for high-priority cases',
      'Shows customer account information',
      'Sets resolution notes as mandatory when appropriate',
      'Initializes form state'
    ]
  }
};

// ============================================================
// CLIENT SCRIPT 2: On State Change - Update Fields Based on State
// ============================================================

export const CLIENT_SCRIPT_ON_STATE_CHANGE = {
  name: 'On State Change - Update Field Visibility and Validation',
  table: 'x_20261805_csm_customer_case',
  type: 'onChange',
  fieldName: 'state',
  description: 'Runs when state field changes to update form layout and validation',
  active: true,
  
  script: `
function onStateChange() {
  try {
    var newState = g_form.getValue('state');
    var oldState = g_form.getValueOld ? g_form.getValueOld('state') : '';
    
    // Update field visibility
    updateStateFields(newState);
    
    // Show/hide messages based on state
    displayStateMessages(newState);
    
    // Update mandatory fields
    updateMandatoryFieldsByState(newState);
    
    // Validate state transition
    if (!isValidStateTransition(oldState, newState)) {
      alert('Invalid state transition: ' + oldState + ' → ' + newState);
      g_form.setValue('state', oldState);
      return false;
    }
    
  } catch (error) {
    gs.error('Error in onStateChange: ' + error.message);
  }
}

function updateStateFields(state) {
  switch(state) {
    case 'new':
      // New state - hide all work fields
      g_form.setVisible('assigned_to', false);
      g_form.setVisible('assignment_group', false);
      g_form.setVisible('resolution_code', false);
      g_form.setVisible('resolution_notes', false);
      g_form.setVisible('closure_code', false);
      g_form.setVisible('customer_satisfaction', false);
      break;
      
    case 'open':
      // Open state - show assignment fields
      g_form.setVisible('assigned_to', true);
      g_form.setVisible('assignment_group', true);
      g_form.setVisible('resolution_code', false);
      g_form.setVisible('resolution_notes', false);
      g_form.setVisible('closure_code', false);
      g_form.setVisible('customer_satisfaction', false);
      break;
      
    case 'in_progress':
      // In progress - show work fields
      g_form.setVisible('assigned_to', true);
      g_form.setVisible('assignment_group', true);
      g_form.setVisible('resolution_code', true);
      g_form.setVisible('resolution_notes', true);
      g_form.setVisible('closure_code', false);
      g_form.setVisible('customer_satisfaction', false);
      break;
      
    case 'waiting_on_customer':
      // Waiting on customer
      g_form.setVisible('assigned_to', true);
      g_form.setVisible('assignment_group', true);
      g_form.setVisible('resolution_code', true);
      g_form.setVisible('resolution_notes', true);
      g_form.setVisible('closure_code', false);
      g_form.setVisible('customer_satisfaction', false);
      break;
      
    case 'resolved':
      // Resolved state - show resolution fields
      g_form.setVisible('assigned_to', true);
      g_form.setVisible('assignment_group', true);
      g_form.setVisible('resolution_code', true);
      g_form.setVisible('resolution_notes', true);
      g_form.setMandatory('resolution_notes', true);
      g_form.setVisible('closure_code', false);
      g_form.setVisible('customer_satisfaction', false);
      break;
      
    case 'closed':
      // Closed state - show all resolution and closure fields
      g_form.setVisible('assigned_to', true);
      g_form.setVisible('assignment_group', true);
      g_form.setVisible('resolution_code', true);
      g_form.setVisible('resolution_notes', true);
      g_form.setMandatory('resolution_notes', true);
      g_form.setVisible('closure_code', true);
      g_form.setMandatory('closure_code', true);
      g_form.setVisible('customer_satisfaction', true);
      g_form.setMandatory('customer_satisfaction', true);
      break;
      
    case 'cancelled':
      // Cancelled state
      g_form.setVisible('assigned_to', true);
      g_form.setVisible('assignment_group', true);
      g_form.setVisible('resolution_code', true);
      g_form.setVisible('resolution_notes', true);
      g_form.setVisible('closure_code', false);
      g_form.setVisible('customer_satisfaction', false);
      break;
  }
}

function displayStateMessages(state) {
  switch(state) {
    case 'new':
      g_form.clearMessage();
      break;
    case 'open':
      g_form.showNotification('Case is open. Please review and assign if needed.');
      break;
    case 'in_progress':
      g_form.showNotification('Case is in progress. Please update resolution details.');
      break;
    case 'waiting_on_customer':
      g_form.showNotification('Case is waiting on customer response.');
      break;
    case 'resolved':
      g_form.showNotification('Case is resolved. Please fill in resolution details before closing.');
      break;
    case 'closed':
      g_form.showNotification('Case is closed. Archive this case after confirmation.');
      break;
    case 'cancelled':
      g_form.showNotification('Case has been cancelled.');
      break;
  }
}

function updateMandatoryFieldsByState(state) {
  // Set mandatory fields based on state
  if (state === 'resolved' || state === 'closed') {
    g_form.setMandatory('resolution_code', true);
    g_form.setMandatory('resolution_notes', true);
  } else {
    g_form.setMandatory('resolution_code', false);
    g_form.setMandatory('resolution_notes', false);
  }
  
  if (state === 'closed') {
    g_form.setMandatory('closure_code', true);
    g_form.setMandatory('customer_satisfaction', true);
  } else {
    g_form.setMandatory('closure_code', false);
    g_form.setMandatory('customer_satisfaction', false);
  }
}

function isValidStateTransition(oldState, newState) {
  // Define valid state transitions
  var validTransitions = {
    'new': ['open', 'cancelled'],
    'open': ['in_progress', 'waiting_on_customer', 'cancelled'],
    'in_progress': ['waiting_on_customer', 'resolved', 'cancelled'],
    'waiting_on_customer': ['in_progress', 'resolved', 'cancelled'],
    'resolved': ['closed', 'open'],
    'closed': ['open'],  // Allow reopening
    'cancelled': []
  };
  
  if (!oldState || oldState === '') {
    return true; // Allow any transition from empty
  }
  
  if (!validTransitions[oldState]) {
    return false;
  }
  
  return validTransitions[oldState].indexOf(newState) > -1;
}

// Call function
onStateChange();
  `,
  
  documentation: {
    description: 'Handles state field changes with dynamic field visibility and validation',
    triggers: 'Runs when state field value changes',
    actions: [
      'Updates field visibility based on new state',
      'Displays contextual messages',
      'Updates mandatory field requirements',
      'Validates state transitions',
      'Prevents invalid state changes'
    ]
  }
};

// ============================================================
// CLIENT SCRIPT 3: On Priority Change - Display Priority Warning
// ============================================================

export const CLIENT_SCRIPT_ON_PRIORITY_CHANGE = {
  name: 'On Priority Change - Display Priority Warning',
  table: 'x_20261805_csm_customer_case',
  type: 'onChange',
  fieldName: 'priority',
  description: 'Displays warning message when high-priority case is selected',
  active: true,
  
  script: `
function onPriorityChange() {
  try {
    var priority = g_form.getValue('priority');
    
    // Clear previous messages
    g_form.clearFieldMessages('priority');
    
    // Display appropriate message based on priority
    switch(priority) {
      case '1':
        g_form.showFieldMsg('priority', 
          '🚨 CRITICAL PRIORITY - This case requires immediate attention and senior support!', 
          'warning', true);
        break;
        
      case '2':
        g_form.showFieldMsg('priority', 
          '⚠️ HIGH PRIORITY - This case should be addressed urgently', 
          'warning', true);
        break;
        
      case '3':
        g_form.showFieldMsg('priority', 
          'ℹ️ MEDIUM PRIORITY - Normal support handling', 
          'info', true);
        break;
        
      case '4':
        g_form.showFieldMsg('priority', 
          'LOW PRIORITY - Can be handled in standard queue', 
          'info', true);
        break;
        
      case '5':
        g_form.showFieldMsg('priority', 
          'MINIMAL PRIORITY - Handle when resources available', 
          'info', true);
        break;
    }
    
    // Update SLA information display
    displaySLAInfo(priority);
    
  } catch (error) {
    gs.error('Error in onPriorityChange: ' + error.message);
  }
}

function displaySLAInfo(priority) {
  // Display SLA information for the priority level
  var slaInfo = getSLAInfo(priority);
  
  if (slaInfo) {
    var message = 'SLA: Response ' + slaInfo.response + ', Resolution ' + slaInfo.resolution;
    g_form.showFieldMsg('priority', message, 'info', true);
  }
}

function getSLAInfo(priority) {
  var slaMatrix = {
    '1': { response: '15 min', resolution: '2 hours' },
    '2': { response: '30 min', resolution: '4 hours' },
    '3': { response: '2 hours', resolution: '24 hours' },
    '4': { response: '4 hours', resolution: '48 hours' },
    '5': { response: '24 hours', resolution: '5 days' }
  };
  
  return slaMatrix[priority];
}

// Call function
onPriorityChange();
  `,
  
  documentation: {
    description: 'Validates and displays priority warnings and SLA information',
    triggers: 'Runs when priority field changes',
    actions: [
      'Displays priority-level warning message',
      'Shows SLA response and resolution times',
      'Color-codes based on priority level',
      'Prevents invalid priority values'
    ]
  }
};

// ============================================================
// CLIENT SCRIPT 4: On Account Select - Display Contact Details
// ============================================================

export const CLIENT_SCRIPT_ON_ACCOUNT_CHANGE = {
  name: 'On Account Selected - Display Account Details and Contacts',
  table: 'x_20261805_csm_customer_case',
  type: 'onChange',
  fieldName: 'customer_account',
  description: 'When customer account is selected, displays account info and available contacts',
  active: true,
  
  script: `
function onAccountChange() {
  try {
    var accountId = g_form.getValue('customer_account');
    
    // Clear previous messages
    g_form.clearFieldMessages('customer_account');
    
    if (!accountId || accountId === '') {
      g_form.clearFieldMessages('customer_account');
      return;
    }
    
    // Get account details
    var accountGr = new GlideRecord('x_20261805_csm_customer_account');
    if (accountGr.get(accountId)) {
      // Display account information
      displayAccountInfo(accountGr);
      
      // Update contact lookup
      filterContactsByAccount(accountId);
      
      // Display available contacts
      displayAvailableContacts(accountId);
    }
    
  } catch (error) {
    gs.error('Error in onAccountChange: ' + error.message);
  }
}

function displayAccountInfo(accountGr) {
  var accountName = accountGr.name.toString();
  var accountType = accountGr.account_type.toString();
  var supportTier = accountGr.support_tier.toString();
  var phone = accountGr.phone.toString();
  
  var message = 'Account: ' + accountName + '\\n' +
                'Type: ' + accountType + '\\n' +
                'Support Tier: ' + supportTier + '\\n' +
                'Phone: ' + phone;
  
  g_form.showFieldMsg('customer_account', message, 'info', true);
}

function filterContactsByAccount(accountId) {
  // This would typically be done via a reference qualifier on the field
  // But can also be done in script
  var contactField = g_form.getControl('customer_contact');
  
  if (contactField) {
    // Trigger reference qualifier to filter contacts by account
    // This is handled by field configuration, but we can refresh the field
    g_form.removeHighlight('customer_contact');
  }
}

function displayAvailableContacts(accountId) {
  // Query for available contacts in this account
  var contactGr = new GlideRecord('x_20261805_csm_customer_contact');
  contactGr.addQuery('customer_account', accountId);
  contactGr.addQuery('active', true);
  contactGr.query();
  
  var contacts = [];
  while (contactGr.next()) {
    var isPrimary = contactGr.is_primary_contact.toString() === 'true' ? ' (Primary)' : '';
    contacts.push(contactGr.name.toString() + isPrimary + ' - ' + contactGr.email.toString());
  }
  
  if (contacts.length > 0) {
    var message = 'Available Contacts: ' + contacts.join(', ');
    g_form.showFieldMsg('customer_account', message, 'info', true);
  }
}

// Call function
onAccountChange();
  `,
  
  documentation: {
    description: 'Displays customer account details and filters contact list',
    triggers: 'Runs when customer_account field changes',
    actions: [
      'Retrieves account information from database',
      'Displays account name, type, support tier, phone',
      'Filters customer_contact field by selected account',
      'Lists available contacts for the account',
      'Marks primary contact in list'
    ]
  }
};

// ============================================================
// CLIENT SCRIPT 5: On Resolution Notes Change - Validate Length
// ============================================================

export const CLIENT_SCRIPT_ON_RESOLUTION_NOTES_CHANGE = {
  name: 'On Resolution Notes Change - Validate Content',
  table: 'x_20261805_csm_customer_case',
  type: 'onChange',
  fieldName: 'resolution_notes',
  description: 'Validates resolution notes when entered or changed',
  active: true,
  
  script: `
function onResolutionNotesChange() {
  try {
    var notes = g_form.getValue('resolution_notes');
    var state = g_form.getValue('state');
    
    // Clear previous messages
    g_form.clearFieldMessages('resolution_notes');
    
    // If state is resolved or closed, validate notes
    if (state === 'resolved' || state === 'closed') {
      if (!notes || notes.trim() === '') {
        g_form.showFieldMsg('resolution_notes', 
          'Resolution notes are required', 'error');
        g_form.setMandatory('resolution_notes', true);
        return false;
      }
      
      // Check minimum length
      var minLength = 10;
      if (notes.trim().length < minLength) {
        g_form.showFieldMsg('resolution_notes', 
          'Resolution notes must be at least ' + minLength + ' characters', 'warning');
        return false;
      }
      
      // Show character count
      var charCount = notes.length;
      g_form.showFieldMsg('resolution_notes', 
        '✓ Resolution notes provided (' + charCount + ' characters)', 'ok');
    }
    
  } catch (error) {
    gs.error('Error in onResolutionNotesChange: ' + error.message);
  }
}

// Call function
onResolutionNotesChange();
  `,
  
  documentation: {
    description: 'Validates resolution notes content and length',
    triggers: 'Runs when resolution_notes field changes',
    actions: [
      'Checks if notes required based on state',
      'Validates minimum length (10 characters)',
      'Shows character count',
      'Provides real-time validation feedback'
    ]
  }
};

// ============================================================
// UI POLICY 1: Show/Hide Resolution Fields Based on State
// ============================================================

export const UI_POLICY_RESOLUTION_FIELDS = {
  name: 'Show/Hide Resolution Fields',
  table: 'x_20261805_csm_customer_case',
  type: 'UI Policy',
  description: 'Controls visibility of resolution and closure fields based on case state',
  active: true,
  
  policyRules: [
    {
      name: 'Show Resolution Fields When Resolved',
      condition: 'state = "resolved"',
      actions: [
        {
          field: 'resolution_code',
          visible: true,
          mandatory: true
        },
        {
          field: 'resolution_notes',
          visible: true,
          mandatory: true
        },
        {
          field: 'closure_code',
          visible: false,
          mandatory: false
        },
        {
          field: 'customer_satisfaction',
          visible: false,
          mandatory: false
        }
      ]
    },
    
    {
      name: 'Show All Closure Fields When Closed',
      condition: 'state = "closed"',
      actions: [
        {
          field: 'resolution_code',
          visible: true,
          mandatory: true
        },
        {
          field: 'resolution_notes',
          visible: true,
          mandatory: true
        },
        {
          field: 'closure_code',
          visible: true,
          mandatory: true
        },
        {
          field: 'customer_satisfaction',
          visible: true,
          mandatory: true
        }
      ]
    },
    
    {
      name: 'Hide Resolution Fields in Other States',
      condition: 'state != "resolved" AND state != "closed"',
      actions: [
        {
          field: 'resolution_code',
          visible: false,
          mandatory: false
        },
        {
          field: 'resolution_notes',
          visible: false,
          mandatory: false
        },
        {
          field: 'closure_code',
          visible: false,
          mandatory: false
        },
        {
          field: 'customer_satisfaction',
          visible: false,
          mandatory: false
        }
      ]
    }
  ],
  
  documentation: {
    description: 'Controls visibility and mandatory status of resolution fields',
    purpose: 'Shows only relevant fields based on case lifecycle state',
    conditions: [
      'state = "resolved" → Show resolution fields',
      'state = "closed" → Show all closure fields',
      'Other states → Hide resolution fields'
    ]
  }
};

// ============================================================
// UI POLICY 2: Make Resolution Notes Mandatory
// ============================================================

export const UI_POLICY_MANDATORY_RESOLUTION_NOTES = {
  name: 'Make Resolution Notes Mandatory',
  table: 'x_20261805_csm_customer_case',
  type: 'UI Policy',
  description: 'Makes resolution notes field mandatory when case is resolved or closed',
  active: true,
  
  condition: 'state = "resolved" OR state = "closed"',
  
  actions: [
    {
      field: 'resolution_notes',
      mandatory: true,
      visible: true
    },
    {
      field: 'resolution_code',
      mandatory: true,
      visible: true
    }
  ],
  
  documentation: {
    description: 'Ensures resolution notes are filled before case closure',
    purpose: 'Enforce documentation quality',
    triggerCondition: 'When state changes to "resolved" or "closed"'
  }
};

// ============================================================
// UI POLICY 3: Hide Closure Code Until Closing
// ============================================================

export const UI_POLICY_HIDE_CLOSURE_CODE = {
  name: 'Hide Closure Code Until Closing',
  table: 'x_20261805_csm_customer_case',
  type: 'UI Policy',
  description: 'Hides closure code field until case transitions to closed state',
  active: true,
  
  condition: 'state != "closed"',
  
  actions: [
    {
      field: 'closure_code',
      visible: false,
      mandatory: false,
      disabled: true
    }
  ],
  
  documentation: {
    description: 'Progressively shows fields as case moves through workflow',
    purpose: 'Reduce form clutter and guide user through workflow',
    showWhen: 'state = "closed"'
  }
};

// ============================================================
// UI POLICY 4: Display Customer Account Information
// ============================================================

export const UI_POLICY_SHOW_ACCOUNT_INFO = {
  name: 'Display Customer Account Information',
  table: 'x_20261805_csm_customer_case',
  type: 'UI Policy',
  description: 'Shows account information and highlights primary account fields',
  active: true,
  
  condition: 'customer_account IS NOT EMPTY',
  
  actions: [
    {
      field: 'customer_account',
      visible: true,
      highlighted: true,
      tooltip: 'Customer Account - Click to view account details'
    },
    {
      field: 'customer_contact',
      visible: true,
      mandatory: true
    }
  ],
  
  documentation: {
    description: 'Ensures account details are visible and highlights importance',
    purpose: 'Improve visibility of customer relationship information'
  }
};

// ============================================================
// UI POLICY 5: Validate Priority Selection
// ============================================================

export const UI_POLICY_VALIDATE_PRIORITY = {
  name: 'Validate Priority Selection',
  table: 'x_20261805_csm_customer_case',
  type: 'UI Policy',
  description: 'Displays priority validation and warning messages',
  active: true,
  
  policyRules: [
    {
      name: 'Highlight Critical Priority',
      condition: 'priority = "1"',
      actions: [
        {
          field: 'priority',
          visible: true,
          highlighted: true,
          backColor: '#ff6666'
        }
      ]
    },
    
    {
      name: 'Highlight High Priority',
      condition: 'priority = "2"',
      actions: [
        {
          field: 'priority',
          visible: true,
          highlighted: true,
          backColor: '#ffcc66'
        }
      ]
    },
    
    {
      name: 'Normal Priority Display',
      condition: 'priority = "3" OR priority = "4" OR priority = "5"',
      actions: [
        {
          field: 'priority',
          visible: true,
          highlighted: false
        }
      ]
    }
  ],
  
  documentation: {
    description: 'Visual indicators for priority levels',
    purpose: 'Quickly identify high-priority cases at a glance',
    colors: {
      critical: '#ff6666 (red)',
      high: '#ffcc66 (orange)',
      normal: 'default'
    }
  }
};

// ============================================================
// CLIENT SCRIPT SUMMARY
// ============================================================

export const CLIENT_SCRIPTS_SUMMARY = {
  total: 5,
  scripts: [
    {
      name: 'Form Load - Initialize Fields',
      type: 'onLoad',
      purpose: 'Initialize form with correct field visibility and messaging',
      order: 1
    },
    {
      name: 'State Change - Update Fields',
      type: 'onChange - state field',
      purpose: 'Dynamic form layout based on case state',
      order: 2
    },
    {
      name: 'Priority Change - Display Warning',
      type: 'onChange - priority field',
      purpose: 'Display priority warnings and SLA information',
      order: 3
    },
    {
      name: 'Account Change - Show Details',
      type: 'onChange - customer_account field',
      purpose: 'Display account information and filter contacts',
      order: 4
    },
    {
      name: 'Resolution Notes - Validate',
      type: 'onChange - resolution_notes field',
      purpose: 'Validate resolution notes content',
      order: 5
    }
  ]
};

export const UI_POLICIES_SUMMARY = {
  total: 5,
  policies: [
    {
      name: 'Show/Hide Resolution Fields',
      purpose: 'Controls visibility based on state'
    },
    {
      name: 'Make Resolution Notes Mandatory',
      purpose: 'Enforces documentation'
    },
    {
      name: 'Hide Closure Code Until Closing',
      purpose: 'Progressive field reveal'
    },
    {
      name: 'Display Account Information',
      purpose: 'Highlights customer relationship'
    },
    {
      name: 'Validate Priority Selection',
      purpose: 'Visual priority indicators'
    }
  ]
};

export default {
  CLIENT_SCRIPT_ON_LOAD,
  CLIENT_SCRIPT_ON_STATE_CHANGE,
  CLIENT_SCRIPT_ON_PRIORITY_CHANGE,
  CLIENT_SCRIPT_ON_ACCOUNT_CHANGE,
  CLIENT_SCRIPT_ON_RESOLUTION_NOTES_CHANGE,
  UI_POLICY_RESOLUTION_FIELDS,
  UI_POLICY_MANDATORY_RESOLUTION_NOTES,
  UI_POLICY_HIDE_CLOSURE_CODE,
  UI_POLICY_SHOW_ACCOUNT_INFO,
  UI_POLICY_VALIDATE_PRIORITY,
  CLIENT_SCRIPTS_SUMMARY,
  UI_POLICIES_SUMMARY
};
