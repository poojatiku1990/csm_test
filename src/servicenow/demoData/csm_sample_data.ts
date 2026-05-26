/**
 * Customer Service Management (CSM) Application - Sample Demo Data
 * Scope: x_20261805_csm
 * 
 * Sample data for testing, demonstration, and training
 * Includes: 5 customer accounts, 10 customer contacts, 10 customer cases
 * 
 * Created: May 26, 2026
 */

// ============================================================
// SAMPLE CUSTOMER ACCOUNTS (5 Total)
// ============================================================

export const SAMPLE_ACCOUNTS = [
  {
    id: 'CSE-ACC-001',
    name: 'Acme Corporation',
    account_type: 'Enterprise',
    support_tier: 'Premium',
    phone: '555-0100',
    email: 'support@acme.com',
    address: '123 Business Park Drive, New York, NY 10001',
    industry: 'Technology',
    annual_revenue: '$500M+',
    employee_count: '5000+',
    contract_start: '2020-01-15',
    contract_end: '2025-12-31',
    status: 'active',
    notes: 'Key enterprise customer, critical systems'
  },
  
  {
    id: 'CSE-ACC-002',
    name: 'Global Tech Solutions',
    account_type: 'Enterprise',
    support_tier: 'Premium',
    phone: '555-0200',
    email: 'support@globaltechsolutions.com',
    address: '456 Innovation Avenue, San Francisco, CA 94025',
    industry: 'Technology',
    annual_revenue: '$250M+',
    employee_count: '2000+',
    contract_start: '2021-06-01',
    contract_end: '2026-05-31',
    status: 'active',
    notes: 'Large account, multiple departments'
  },
  
  {
    id: 'CSE-ACC-003',
    name: 'CloudFirst Systems',
    account_type: 'SMB',
    support_tier: 'Standard',
    phone: '555-0300',
    email: 'support@cloudfirst.com',
    address: '789 Cloud Street, Austin, TX 78701',
    industry: 'Software',
    annual_revenue: '$10M-$50M',
    employee_count: '100-500',
    contract_start: '2022-03-10',
    contract_end: '2024-03-09',
    status: 'active',
    notes: 'Growing SMB customer'
  },
  
  {
    id: 'CSE-ACC-004',
    name: 'StartupHub Inc',
    account_type: 'Startup',
    support_tier: 'Basic',
    phone: '555-0400',
    email: 'support@startuphub.io',
    address: '321 Innovation Way, Seattle, WA 98101',
    industry: 'Fintech',
    annual_revenue: '$1M-$10M',
    employee_count: '50-100',
    contract_start: '2023-09-01',
    contract_end: '2024-08-31',
    status: 'active',
    notes: 'Early-stage startup, cost-sensitive'
  },
  
  {
    id: 'CSE-ACC-005',
    name: 'Enterprise Solutions LLC',
    account_type: 'Enterprise',
    support_tier: 'Premium',
    phone: '555-0500',
    email: 'support@entsol.com',
    address: '654 Corporate Boulevard, Chicago, IL 60601',
    industry: 'Finance',
    annual_revenue: '$1B+',
    employee_count: '10000+',
    contract_start: '2019-01-01',
    contract_end: '2026-12-31',
    status: 'active',
    notes: 'Flagship customer, mission-critical'
  }
];

// ============================================================
// SAMPLE CUSTOMER CONTACTS (10 Total)
// ============================================================

export const SAMPLE_CONTACTS = [
  {
    id: 'CSE-CON-001',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '555-0101',
    title: 'IT Manager',
    customer_account: 'CSE-ACC-001',
    is_primary_contact: true,
    department: 'Information Technology',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@acme.com',
    phone: '555-0102',
    title: 'Operations Director',
    customer_account: 'CSE-ACC-001',
    is_primary_contact: false,
    department: 'Operations',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-003',
    name: 'Michael Chen',
    email: 'michael.chen@globaltechsolutions.com',
    phone: '555-0201',
    title: 'Technical Lead',
    customer_account: 'CSE-ACC-002',
    is_primary_contact: true,
    department: 'Engineering',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-004',
    name: 'Emily Rodriguez',
    email: 'emily.r@globaltechsolutions.com',
    phone: '555-0202',
    title: 'Support Coordinator',
    customer_account: 'CSE-ACC-002',
    is_primary_contact: false,
    department: 'Support',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-005',
    name: 'David Park',
    email: 'david.park@cloudfirst.com',
    phone: '555-0301',
    title: 'System Administrator',
    customer_account: 'CSE-ACC-003',
    is_primary_contact: true,
    department: 'IT',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-006',
    name: 'Lisa Anderson',
    email: 'lisa.a@startuphub.io',
    phone: '555-0401',
    title: 'DevOps Engineer',
    customer_account: 'CSE-ACC-004',
    is_primary_contact: true,
    department: 'Engineering',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-007',
    name: 'Thomas Martinez',
    email: 'thomas.m@entsol.com',
    phone: '555-0501',
    title: 'CTO',
    customer_account: 'CSE-ACC-005',
    is_primary_contact: true,
    department: 'Technology',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-008',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@entsol.com',
    phone: '555-0502',
    title: 'Infrastructure Manager',
    customer_account: 'CSE-ACC-005',
    is_primary_contact: false,
    department: 'Operations',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-009',
    name: 'Robert Williams',
    email: 'robert.w@acme.com',
    phone: '555-0103',
    title: 'Database Administrator',
    customer_account: 'CSE-ACC-001',
    is_primary_contact: false,
    department: 'Database Team',
    status: 'active'
  },
  
  {
    id: 'CSE-CON-010',
    name: 'Amanda Foster',
    email: 'amanda.foster@cloudfirst.com',
    phone: '555-0302',
    title: 'Project Manager',
    customer_account: 'CSE-ACC-003',
    is_primary_contact: false,
    department: 'Project Management',
    status: 'active'
  }
];

// ============================================================
// SAMPLE CUSTOMER CASES (10 Total)
// ============================================================

export const SAMPLE_CASES = [
  {
    number: 'CSE-1000001',
    short_description: 'System experiencing performance degradation during peak hours',
    description: 'Customer reports significant slowdown in application response times during business hours. Affecting multiple departments. Started yesterday morning.',
    customer_account: 'CSE-ACC-001',
    customer_contact: 'CSE-CON-001',
    customer_email: 'john.smith@acme.com',
    category: 'Performance',
    priority: '1',
    impact: '1',
    urgency: '1',
    state: 'in_progress',
    assigned_to: 'Agent Smith',
    assignment_group: 'Senior Support Team',
    opened_at: '2026-05-24T09:30:00Z',
    created_by: 'John Smith',
    is_escalated: true,
    escalation_reason: 'Critical impact to production',
    resolution_code: null,
    resolution_notes: null,
    resolved_at: null,
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000002',
    short_description: 'Database connection timeout errors in production environment',
    description: 'Intermittent database connection failures causing application errors. Occurs randomly throughout the day. No specific pattern identified yet.',
    customer_account: 'CSE-ACC-005',
    customer_contact: 'CSE-CON-007',
    customer_email: 'thomas.m@entsol.com',
    category: 'Database',
    priority: '1',
    impact: '1',
    urgency: '1',
    state: 'in_progress',
    assigned_to: 'Agent Johnson',
    assignment_group: 'Senior Support Team',
    opened_at: '2026-05-25T14:15:00Z',
    created_by: 'Thomas Martinez',
    is_escalated: true,
    escalation_reason: 'Mission-critical system down',
    resolution_code: null,
    resolution_notes: null,
    resolved_at: null,
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000003',
    short_description: 'Feature request: Multi-factor authentication support',
    description: 'Customer requesting addition of MFA support for enhanced security. Wants to understand implementation timeline and compatibility with existing systems.',
    customer_account: 'CSE-ACC-002',
    customer_contact: 'CSE-CON-003',
    customer_email: 'michael.chen@globaltechsolutions.com',
    category: 'Enhancement',
    priority: '3',
    impact: '3',
    urgency: '3',
    state: 'open',
    assigned_to: null,
    assignment_group: null,
    opened_at: '2026-05-26T10:00:00Z',
    created_by: 'Michael Chen',
    is_escalated: false,
    escalation_reason: null,
    resolution_code: null,
    resolution_notes: null,
    resolved_at: null,
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000004',
    short_description: 'API documentation unclear for OAuth2 implementation',
    description: 'Customer having difficulty implementing OAuth2 based on current documentation. Examples are outdated. Needs clarification on token refresh mechanism.',
    customer_account: 'CSE-ACC-003',
    customer_contact: 'CSE-CON-005',
    customer_email: 'david.park@cloudfirst.com',
    category: 'Documentation',
    priority: '2',
    impact: '2',
    urgency: '2',
    state: 'in_progress',
    assigned_to: 'Agent Lee',
    assignment_group: 'Technical Support',
    opened_at: '2026-05-25T11:20:00Z',
    created_by: 'David Park',
    is_escalated: false,
    escalation_reason: null,
    resolution_code: null,
    resolution_notes: null,
    resolved_at: null,
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000005',
    short_description: 'Unable to update user profile information',
    description: 'When attempting to update profile with new address and phone number, system returns generic error. Same happens on multiple browsers and devices. Account appears locked.',
    customer_account: 'CSE-ACC-004',
    customer_contact: 'CSE-CON-006',
    customer_email: 'lisa.a@startuphub.io',
    category: 'Bug',
    priority: '2',
    impact: '2',
    urgency: '2',
    state: 'resolved',
    assigned_to: 'Agent Miller',
    assignment_group: 'Technical Support',
    opened_at: '2026-05-23T15:45:00Z',
    created_by: 'Lisa Anderson',
    is_escalated: false,
    escalation_reason: null,
    resolution_code: 'Fixed in Code',
    resolution_notes: 'Identified and fixed database trigger conflict preventing profile updates. Deployed hotfix to production. Customer verified issue resolved.',
    resolved_at: '2026-05-25T09:00:00Z',
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000006',
    short_description: 'License renewal inquiry for additional seats',
    description: 'Customer needs to expand their license to add 50 new users. Inquiring about current pricing, volume discounts, and renewal terms.',
    customer_account: 'CSE-ACC-001',
    customer_contact: 'CSE-CON-002',
    customer_email: 'sarah.johnson@acme.com',
    category: 'Billing',
    priority: '3',
    impact: '3',
    urgency: '3',
    state: 'waiting_on_customer',
    assigned_to: 'Agent Brown',
    assignment_group: 'Sales Support',
    opened_at: '2026-05-24T13:00:00Z',
    created_by: 'Sarah Johnson',
    is_escalated: false,
    escalation_reason: null,
    resolution_code: null,
    resolution_notes: null,
    resolved_at: null,
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000007',
    short_description: 'Training request: Advanced admin features',
    description: 'New admin team members need comprehensive training on advanced system administration features. Requesting on-site or virtual training session with certification.',
    customer_account: 'CSE-ACC-005',
    customer_contact: 'CSE-CON-008',
    customer_email: 'jennifer.lee@entsol.com',
    category: 'Training',
    priority: '3',
    impact: '2',
    urgency: '3',
    state: 'open',
    assigned_to: null,
    assignment_group: null,
    opened_at: '2026-05-26T08:30:00Z',
    created_by: 'Jennifer Lee',
    is_escalated: false,
    escalation_reason: null,
    resolution_code: null,
    resolution_notes: null,
    resolved_at: null,
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000008',
    short_description: 'Email notification not being received from system',
    description: 'Customer not receiving any automated email notifications from the system. Verified email address in profile is correct. No notifications in spam folder.',
    customer_account: 'CSE-ACC-003',
    customer_contact: 'CSE-CON-010',
    customer_email: 'amanda.foster@cloudfirst.com',
    category: 'Email',
    priority: '2',
    impact: '2',
    urgency: '2',
    state: 'resolved',
    assigned_to: 'Agent Davis',
    assignment_group: 'Technical Support',
    opened_at: '2026-05-22T10:15:00Z',
    created_by: 'Amanda Foster',
    is_escalated: false,
    escalation_reason: null,
    resolution_code: 'Configuration Fixed',
    resolution_notes: 'Email notification settings were disabled in system configuration. Re-enabled notifications and reset customer email preferences. All notifications now being received.',
    resolved_at: '2026-05-24T14:30:00Z',
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000009',
    short_description: 'Integration with third-party analytics platform failing',
    description: 'Customer attempting to configure integration with Google Analytics but API authentication continues to fail. Followed documentation steps but still getting 401 errors.',
    customer_account: 'CSE-ACC-002',
    customer_contact: 'CSE-CON-004',
    customer_email: 'emily.r@globaltechsolutions.com',
    category: 'Integration',
    priority: '2',
    impact: '2',
    urgency: '2',
    state: 'in_progress',
    assigned_to: 'Agent Wilson',
    assignment_group: 'Technical Support',
    opened_at: '2026-05-25T16:45:00Z',
    created_by: 'Emily Rodriguez',
    is_escalated: false,
    escalation_reason: null,
    resolution_code: null,
    resolution_notes: null,
    resolved_at: null,
    closed_at: null,
    customer_satisfaction: null,
    closure_code: null
  },
  
  {
    number: 'CSE-1000010',
    short_description: 'Scheduled maintenance completed successfully',
    description: 'Monthly maintenance window completed on schedule. All systems back online and functioning normally. No customer impact.',
    customer_account: 'CSE-ACC-001',
    customer_contact: 'CSE-CON-001',
    customer_email: 'john.smith@acme.com',
    category: 'Maintenance',
    priority: '4',
    impact: '4',
    urgency: '4',
    state: 'closed',
    assigned_to: 'Agent Garcia',
    assignment_group: 'Operations',
    opened_at: '2026-05-20T22:00:00Z',
    created_by: 'Support System',
    is_escalated: false,
    escalation_reason: null,
    resolution_code: 'Completed',
    resolution_notes: 'Scheduled maintenance window executed successfully. Database backups completed. System patches applied. All services verified operational.',
    resolved_at: '2026-05-21T06:00:00Z',
    closed_at: '2026-05-21T06:15:00Z',
    customer_satisfaction: '5',
    closure_code: 'Resolved'
  }
];

// ============================================================
// CASE DISTRIBUTION BY CATEGORY
// ============================================================

export const CASE_DISTRIBUTION = {
  categories: {
    'Performance': 1,
    'Database': 1,
    'Enhancement': 1,
    'Documentation': 1,
    'Bug': 1,
    'Billing': 1,
    'Training': 1,
    'Email': 1,
    'Integration': 1,
    'Maintenance': 1
  },
  
  priorities: {
    '1 - Critical': 2,
    '2 - High': 4,
    '3 - Medium': 3,
    '4 - Low': 1
  },
  
  states: {
    'new': 0,
    'open': 2,
    'in_progress': 4,
    'waiting_on_customer': 1,
    'resolved': 2,
    'closed': 1,
    'cancelled': 0
  },
  
  accountTypes: {
    'Enterprise': 3,
    'SMB': 1,
    'Startup': 1,
    'Other': 0
  }
};

// ============================================================
// SAMPLE ASSIGNMENT GROUPS
// ============================================================

export const SAMPLE_ASSIGNMENT_GROUPS = [
  {
    name: 'Senior Support Team',
    description: 'Expert support team for critical issues',
    members: ['Agent Smith', 'Agent Johnson'],
    queue_type: 'priority_based',
    sla_level: 'Premium'
  },
  {
    name: 'Technical Support',
    description: 'General technical support team',
    members: ['Agent Lee', 'Agent Miller', 'Agent Davis', 'Agent Wilson'],
    queue_type: 'round_robin',
    sla_level: 'Standard'
  },
  {
    name: 'Sales Support',
    description: 'Sales and billing support team',
    members: ['Agent Brown'],
    queue_type: 'priority_based',
    sla_level: 'Standard'
  },
  {
    name: 'Operations',
    description: 'System operations and maintenance',
    members: ['Agent Garcia'],
    queue_type: 'fifo',
    sla_level: 'Standard'
  }
];

// ============================================================
// DEMO DATA LOADING SCRIPT
// ============================================================

export const DEMO_DATA_LOADER = {
  name: 'CSM Demo Data Loader',
  description: 'Loads sample data into CSM tables for testing and demonstration',
  
  loadOrder: [
    'customer_account',
    'customer_contact',
    'customer_case'
  ],
  
  totalRecords: {
    accounts: 5,
    contacts: 10,
    cases: 10,
    total: 25
  },
  
  script: `
    /**
     * Load Demo Data Script
     * Execute this in ServiceNow to populate demo data
     */
    
    function loadDemoData() {
      gs.log('Starting CSM Demo Data Load');
      
      // 1. Load Customer Accounts
      loadAccounts();
      
      // 2. Load Customer Contacts
      loadContacts();
      
      // 3. Load Customer Cases
      loadCases();
      
      gs.log('CSM Demo Data Load Complete');
    }
    
    function loadAccounts() {
      var accounts = SAMPLE_ACCOUNTS;
      for (var i = 0; i < accounts.length; i++) {
        var gr = new GlideRecord('x_20261805_csm_customer_account');
        gr.name = accounts[i].name;
        gr.account_type = accounts[i].account_type;
        gr.support_tier = accounts[i].support_tier;
        gr.phone = accounts[i].phone;
        gr.email = accounts[i].email;
        gr.insert();
      }
      gs.log('Loaded ' + accounts.length + ' accounts');
    }
    
    function loadContacts() {
      var contacts = SAMPLE_CONTACTS;
      for (var i = 0; i < contacts.length; i++) {
        var gr = new GlideRecord('x_20261805_csm_customer_contact');
        gr.name = contacts[i].name;
        gr.email = contacts[i].email;
        gr.phone = contacts[i].phone;
        gr.title = contacts[i].title;
        gr.customer_account = getAccountId(contacts[i].customer_account);
        gr.is_primary_contact = contacts[i].is_primary_contact;
        gr.insert();
      }
      gs.log('Loaded ' + contacts.length + ' contacts');
    }
    
    function loadCases() {
      var cases = SAMPLE_CASES;
      for (var i = 0; i < cases.length; i++) {
        var gr = new GlideRecord('x_20261805_csm_customer_case');
        gr.short_description = cases[i].short_description;
        gr.description = cases[i].description;
        gr.customer_account = getAccountId(cases[i].customer_account);
        gr.customer_contact = getContactId(cases[i].customer_contact);
        gr.customer_email = cases[i].customer_email;
        gr.category = cases[i].category;
        gr.priority = cases[i].priority;
        gr.impact = cases[i].impact;
        gr.urgency = cases[i].urgency;
        gr.state = cases[i].state;
        gr.opened_at = cases[i].opened_at;
        gr.insert();
      }
      gs.log('Loaded ' + cases.length + ' cases');
    }
    
    function getAccountId(accountName) {
      var gr = new GlideRecord('x_20261805_csm_customer_account');
      gr.addQuery('name', accountName);
      gr.query();
      if (gr.next()) {
        return gr.sys_id;
      }
      return null;
    }
    
    function getContactId(contactName) {
      var gr = new GlideRecord('x_20261805_csm_customer_contact');
      gr.addQuery('name', contactName);
      gr.query();
      if (gr.next()) {
        return gr.sys_id;
      }
      return null;
    }
    
    // Execute
    loadDemoData();
  `
};

// ============================================================
// SUMMARY & STATISTICS
// ============================================================

export const DEMO_DATA_SUMMARY = {
  description: 'Sample demo data for CSM application testing and training',
  
  accounts: {
    total: 5,
    breakdown: {
      enterprise: 3,
      smb: 1,
      startup: 1
    }
  },
  
  contacts: {
    total: 10,
    breakdown: {
      primary_contacts: 5,
      secondary_contacts: 5
    },
    distribution: {
      acme_corporation: 3,
      global_tech_solutions: 2,
      cloudfirst_systems: 2,
      startuphub_inc: 1,
      enterprise_solutions: 2
    }
  },
  
  cases: {
    total: 10,
    breakdown: {
      by_priority: {
        critical: 2,
        high: 4,
        medium: 3,
        low: 1
      },
      by_state: {
        open: 2,
        in_progress: 4,
        waiting_on_customer: 1,
        resolved: 2,
        closed: 1
      },
      by_category: {
        performance: 1,
        database: 1,
        enhancement: 1,
        documentation: 1,
        bug: 1,
        billing: 1,
        training: 1,
        email: 1,
        integration: 1,
        maintenance: 1
      }
    }
  },
  
  averageMetrics: {
    cases_per_account: 2,
    contacts_per_account: 2,
    critical_cases_percentage: 20,
    open_case_percentage: 20,
    resolved_case_percentage: 20,
    closed_case_percentage: 10
  }
};

export default {
  SAMPLE_ACCOUNTS,
  SAMPLE_CONTACTS,
  SAMPLE_CASES,
  SAMPLE_ASSIGNMENT_GROUPS,
  CASE_DISTRIBUTION,
  DEMO_DATA_LOADER,
  DEMO_DATA_SUMMARY
};
