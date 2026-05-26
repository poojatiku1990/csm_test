/**
 * Customer Service Management (CSM) Application - Roles & ACLs
 * Scope: x_20261805_csm
 * 
 * Role-Based Access Control Configuration
 * Defines permissions for csm_agent, csm_manager, csm_admin, and customer_user
 * 
 * Created: May 25, 2026
 */

// ============================================================
// ROLE DEFINITIONS
// ============================================================

export const ROLES = {
  CSM_AGENT: 'x_20261805_csm.csm_agent',
  CSM_MANAGER: 'x_20261805_csm.csm_manager',
  CSM_ADMIN: 'x_20261805_csm.csm_admin',
  CUSTOMER_USER: 'x_20261805_csm.customer_user'
};

// ============================================================
// ROLE 1: CSM AGENT
// ============================================================

export const CSM_AGENT_ROLE = {
  name: 'CSM Agent',
  roleId: 'x_20261805_csm.csm_agent',
  description: 'Front-line support staff who work on customer cases',
  
  permissions: {
    overview: {
      description: 'Can view and work on customer cases',
      capabilities: [
        'Read customer cases',
        'Create customer cases',
        'Update assigned cases',
        'Cannot delete cases',
        'Read customer accounts',
        'Read customer contacts',
        'Create communications',
        'Cannot view reports'
      ]
    },
    
    tables: {
      customer_case: {
        read: true,
        create: true,
        update: {
          enabled: true,
          conditions: [
            'assigned_to = current_user OR created_by = current_user'
          ],
          allowedFields: [
            'short_description',
            'description',
            'state',
            'priority',
            'resolution_code',
            'resolution_notes',
            'impact',
            'urgency',
            'category',
            'customer_contact',
            'is_escalated',
            'escalation_reason'
          ],
          restrictedFields: [
            'number',
            'created_at',
            'opened_at',
            'resolved_at',
            'closed_at',
            'customer_account'
          ]
        },
        delete: false,
        conditions: []
      },
      
      customer_account: {
        read: true,
        create: false,
        update: false,
        delete: false,
        conditions: [],
        allowedFields: [
          'name',
          'account_type',
          'support_tier',
          'phone',
          'email'
        ]
      },
      
      customer_contact: {
        read: true,
        create: false,
        update: false,
        delete: false,
        conditions: [],
        allowedFields: [
          'name',
          'email',
          'phone',
          'title',
          'is_primary_contact'
        ]
      },
      
      communication: {
        read: {
          enabled: true,
          conditions: ['case_id.assigned_to = current_user']
        },
        create: {
          enabled: true,
          conditions: ['case_id.assigned_to = current_user']
        },
        update: {
          enabled: true,
          conditions: [
            'case_id.assigned_to = current_user',
            'created_by = current_user'
          ]
        },
        delete: false
      },
      
      sla_policy: {
        read: true,
        create: false,
        update: false,
        delete: false
      },
      
      knowledge_article: {
        read: true,
        create: false,
        update: false,
        delete: false
      }
    }
  },
  
  businessRules: {
    allowed: [
      'Auto-generate case number',
      'Calculate priority',
      'Auto-assign case'
    ],
    canBypass: []
  },
  
  canDelegate: false,
  canViewReports: false,
  canConfigureRules: false,
  canManageUsers: false
};

// ============================================================
// ROLE 2: CSM MANAGER
// ============================================================

export const CSM_MANAGER_ROLE = {
  name: 'CSM Manager',
  roleId: 'x_20261805_csm.csm_manager',
  description: 'Team leads who oversee CSM agents and manage case escalations',
  
  permissions: {
    overview: {
      description: 'Can manage cases, view team performance, and escalate issues',
      capabilities: [
        'Read all customer cases in team',
        'Create customer cases',
        'Update all customer cases',
        'Delete customer cases (archived only)',
        'Read customer accounts',
        'Read customer contacts',
        'Create communications',
        'View team reports',
        'Escalate cases to admin',
        'Manage team assignments',
        'Create knowledge articles'
      ]
    },
    
    tables: {
      customer_case: {
        read: {
          enabled: true,
          conditions: [
            'assignment_group IN (manager_groups)',
            'OR created_by = current_user'
          ]
        },
        create: true,
        update: true,
        delete: {
          enabled: true,
          conditions: ['state = "closed" OR state = "cancelled"'],
          description: 'Can only delete closed or cancelled cases'
        },
        allowedFields: [
          'short_description',
          'description',
          'state',
          'priority',
          'resolution_code',
          'resolution_notes',
          'impact',
          'urgency',
          'category',
          'customer_contact',
          'customer_account',
          'is_escalated',
          'escalation_reason',
          'assigned_to',
          'assignment_group',
          'closure_code',
          'customer_satisfaction'
        ],
        restrictedFields: [
          'number',
          'created_at',
          'opened_at'
        ]
      },
      
      customer_account: {
        read: true,
        create: false,
        update: false,
        delete: false,
        allowedFields: [
          'name',
          'account_type',
          'support_tier',
          'phone',
          'email',
          'address'
        ]
      },
      
      customer_contact: {
        read: true,
        create: false,
        update: false,
        delete: false
      },
      
      communication: {
        read: true,
        create: true,
        update: {
          enabled: true,
          conditions: ['created_by = current_user']
        },
        delete: {
          enabled: true,
          conditions: ['created_by = current_user'],
          description: 'Can only delete own communications'
        }
      },
      
      sla_policy: {
        read: true,
        create: false,
        update: false,
        delete: false
      },
      
      knowledge_article: {
        read: true,
        create: true,
        update: {
          enabled: true,
          conditions: ['created_by = current_user']
        },
        delete: {
          enabled: true,
          conditions: ['created_by = current_user']
        }
      },
      
      assignment_group: {
        read: true,
        create: false,
        update: false,
        delete: false
      }
    }
  },
  
  businessRules: {
    allowed: [
      'All business rules'
    ],
    canBypass: [
      'Can bypass auto-assignment for escalations'
    ]
  },
  
  canDelegate: true,
  canViewReports: true,
  canConfigureRules: false,
  canManageUsers: true,
  canManageTeam: true,
  canViewAnalytics: true
};

// ============================================================
// ROLE 3: CSM ADMIN
// ============================================================

export const CSM_ADMIN_ROLE = {
  name: 'CSM Administrator',
  roleId: 'x_20261805_csm.csm_admin',
  description: 'System administrators who configure and maintain the CSM application',
  
  permissions: {
    overview: {
      description: 'Full access to all CSM system components',
      capabilities: [
        'Full read/write/delete on all tables',
        'Manage business rules',
        'Configure SLA policies',
        'Manage users and roles',
        'Configure assignment rules',
        'View all reports and analytics',
        'System administration',
        'Can bypass all access restrictions',
        'Create system configurations'
      ]
    },
    
    tables: {
      customer_case: {
        read: true,
        create: true,
        update: true,
        delete: true,
        allowedFields: 'all'
      },
      
      customer_account: {
        read: true,
        create: true,
        update: true,
        delete: {
          enabled: true,
          conditions: ['no active cases'],
          description: 'Cannot delete accounts with active cases'
        },
        allowedFields: 'all'
      },
      
      customer_contact: {
        read: true,
        create: true,
        update: true,
        delete: {
          enabled: true,
          conditions: ['no active cases'],
          description: 'Cannot delete contacts with active cases'
        },
        allowedFields: 'all'
      },
      
      communication: {
        read: true,
        create: true,
        update: true,
        delete: true,
        allowedFields: 'all'
      },
      
      sla_policy: {
        read: true,
        create: true,
        update: true,
        delete: {
          enabled: true,
          conditions: ['not in use'],
          description: 'Cannot delete active policies'
        },
        allowedFields: 'all'
      },
      
      knowledge_article: {
        read: true,
        create: true,
        update: true,
        delete: true,
        allowedFields: 'all'
      },
      
      assignment_group: {
        read: true,
        create: true,
        update: true,
        delete: false,
        allowedFields: 'all'
      },
      
      business_rule: {
        read: true,
        create: true,
        update: true,
        delete: {
          enabled: true,
          conditions: ['not in use'],
          description: 'Cannot delete active business rules'
        },
        allowedFields: 'all'
      },
      
      sys_user: {
        read: true,
        create: true,
        update: {
          enabled: true,
          allowedFields: [
            'roles',
            'active',
            'user_name',
            'first_name',
            'last_name',
            'email'
          ]
        },
        delete: false,
        description: 'Cannot delete users, only deactivate'
      },
      
      sys_user_role: {
        read: true,
        create: true,
        update: true,
        delete: true,
        allowedFields: 'all'
      }
    }
  },
  
  businessRules: {
    allowed: ['all'],
    canBypass: ['all']
  },
  
  canDelegate: true,
  canViewReports: true,
  canConfigureRules: true,
  canManageUsers: true,
  canManageTeam: true,
  canViewAnalytics: true,
  canConfigureSLA: true,
  canConfigureAssignment: true,
  isSuperAdmin: true
};

// ============================================================
// ROLE 4: CUSTOMER USER (Portal/Customer-Facing)
// ============================================================

export const CUSTOMER_USER_ROLE = {
  name: 'Customer User',
  roleId: 'x_20261805_csm.customer_user',
  description: 'External customer users who can view and create their own cases via service portal',
  
  permissions: {
    overview: {
      description: 'Limited access to own cases and account information',
      capabilities: [
        'Read own customer cases (as created_by)',
        'Create customer cases',
        'Cannot update cases directly',
        'Cannot delete cases',
        'Read own customer account info',
        'Read own customer contact info',
        'Cannot access other customers data',
        'Cannot view reports',
        'Cannot see internal notes',
        'Can add communications/comments'
      ]
    },
    
    tables: {
      customer_case: {
        read: {
          enabled: true,
          conditions: [
            'created_by = current_user',
            'OR customer_account IN (user_accounts)'
          ],
          description: 'Can only see their own cases'
        },
        create: {
          enabled: true,
          conditions: ['via service portal only']
        },
        update: false,
        delete: false,
        allowedFields: [
          'short_description',
          'description',
          'priority'
        ],
        readOnlyFields: [
          'number',
          'state',
          'assigned_to',
          'assignment_group',
          'resolution_notes',
          'created_at',
          'updated_at'
        ]
      },
      
      customer_account: {
        read: {
          enabled: true,
          conditions: ['account IN (user_accounts)']
        },
        create: false,
        update: false,
        delete: false,
        allowedFields: [
          'name',
          'account_type',
          'support_tier'
        ]
      },
      
      customer_contact: {
        read: {
          enabled: true,
          conditions: ['contact IN (user_contacts)']
        },
        create: false,
        update: false,
        delete: false,
        allowedFields: [
          'name',
          'email',
          'phone'
        ]
      },
      
      communication: {
        read: {
          enabled: true,
          conditions: ['case_id.created_by = current_user'],
          excludeFields: ['internal_notes', 'agent_only_notes']
        },
        create: {
          enabled: true,
          conditions: ['case_id.created_by = current_user']
        },
        update: false,
        delete: false
      },
      
      sla_policy: {
        read: false,
        create: false,
        update: false,
        delete: false
      },
      
      knowledge_article: {
        read: {
          enabled: true,
          conditions: ['published = true AND visible_to_portal = true']
        },
        create: false,
        update: false,
        delete: false
      }
    }
  },
  
  businessRules: {
    allowed: []
  },
  
  canDelegate: false,
  canViewReports: false,
  canConfigureRules: false,
  canManageUsers: false,
  accessLevel: 'portal_only',
  isExternal: true
};

// ============================================================
// ACL RECOMMENDATIONS BY TABLE
// ============================================================

export const TABLE_ACL_RECOMMENDATIONS = {
  
  customer_case: {
    tableName: 'Customer Case (x_20261805_csm_customer_case)',
    description: 'Main case tracking table - highest security',
    
    acls: [
      {
        name: 'CSM Agent - Read',
        role: 'x_20261805_csm.csm_agent',
        operation: 'read',
        condition: 'assignment_group IN (agent_groups) OR assigned_to = current_user OR created_by = current_user',
        canDelegate: false
      },
      {
        name: 'CSM Agent - Create',
        role: 'x_20261805_csm.csm_agent',
        operation: 'create',
        condition: 'none',
        canDelegate: false
      },
      {
        name: 'CSM Agent - Update',
        role: 'x_20261805_csm.csm_agent',
        operation: 'write',
        condition: 'assigned_to = current_user OR created_by = current_user',
        canDelegate: false
      },
      {
        name: 'CSM Manager - Read',
        role: 'x_20261805_csm.csm_manager',
        operation: 'read',
        condition: 'assignment_group IN (manager_groups) OR created_by = current_user',
        canDelegate: false
      },
      {
        name: 'CSM Manager - Write',
        role: 'x_20261805_csm.csm_manager',
        operation: 'write',
        condition: 'assignment_group IN (manager_groups)',
        canDelegate: false
      },
      {
        name: 'CSM Manager - Delete',
        role: 'x_20261805_csm.csm_manager',
        operation: 'delete',
        condition: 'state = "closed" OR state = "cancelled"',
        canDelegate: false
      },
      {
        name: 'CSM Admin - All',
        role: 'x_20261805_csm.csm_admin',
        operation: 'all',
        condition: 'none',
        canDelegate: true
      },
      {
        name: 'Customer User - Read Own',
        role: 'x_20261805_csm.customer_user',
        operation: 'read',
        condition: 'created_by = current_user OR customer_account IN (user_accounts)',
        canDelegate: false
      },
      {
        name: 'Customer User - Create',
        role: 'x_20261805_csm.customer_user',
        operation: 'create',
        condition: 'via_service_portal = true',
        canDelegate: false
      }
    ],
    
    fieldACLs: {
      number: {
        read: ['all'],
        write: []
      },
      state: {
        read: ['all'],
        write: ['x_20261805_csm.csm_agent', 'x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      },
      assigned_to: {
        read: ['all'],
        write: ['x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      },
      assignment_group: {
        read: ['all'],
        write: ['x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      },
      resolution_notes: {
        read: ['x_20261805_csm.csm_agent', 'x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin'],
        write: ['x_20261805_csm.csm_agent', 'x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      },
      closure_code: {
        read: ['x_20261805_csm.csm_agent', 'x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin'],
        write: ['x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      },
      customer_satisfaction: {
        read: ['x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin'],
        write: ['x_20261805_csm.csm_agent', 'x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      }
    }
  },
  
  customer_account: {
    tableName: 'Customer Account (x_20261805_csm_customer_account)',
    description: 'Customer organization records - sensitive data',
    
    acls: [
      {
        name: 'CSM Agent - Read',
        role: 'x_20261805_csm.csm_agent',
        operation: 'read',
        condition: 'none'
      },
      {
        name: 'CSM Manager - Read/Write',
        role: 'x_20261805_csm.csm_manager',
        operation: 'read,write',
        condition: 'account IN (manager_accounts)'
      },
      {
        name: 'CSM Admin - All',
        role: 'x_20261805_csm.csm_admin',
        operation: 'all',
        condition: 'none'
      },
      {
        name: 'Customer User - Read Own Account',
        role: 'x_20261805_csm.customer_user',
        operation: 'read',
        condition: 'account IN (user_accounts)'
      }
    ],
    
    fieldACLs: {
      name: {
        read: ['all'],
        write: ['x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      },
      account_type: {
        read: ['all'],
        write: ['x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      },
      support_tier: {
        read: ['all'],
        write: ['x_20261805_csm.csm_admin']
      },
      phone: {
        read: ['all'],
        write: ['x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin']
      },
      financial_data: {
        read: ['x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin'],
        write: ['x_20261805_csm.csm_admin']
      }
    }
  },
  
  customer_contact: {
    tableName: 'Customer Contact (x_20261805_csm_customer_contact)',
    description: 'Customer contact person records',
    
    acls: [
      {
        name: 'CSM Agent - Read',
        role: 'x_20261805_csm.csm_agent',
        operation: 'read',
        condition: 'none'
      },
      {
        name: 'CSM Manager - Read/Write',
        role: 'x_20261805_csm.csm_manager',
        operation: 'read,write',
        condition: 'customer_account IN (manager_accounts)'
      },
      {
        name: 'CSM Admin - All',
        role: 'x_20261805_csm.csm_admin',
        operation: 'all',
        condition: 'none'
      },
      {
        name: 'Customer User - Read Own Contacts',
        role: 'x_20261805_csm.customer_user',
        operation: 'read',
        condition: 'contact IN (user_contacts)'
      }
    ],
    
    canDelete: {
      csm_agent: false,
      csm_manager: false,
      csm_admin: 'only_if_no_active_cases',
      customer_user: false
    }
  },
  
  communication: {
    tableName: 'Communication (x_20261805_csm_communication)',
    description: 'Case communications - attachments, notes, and messages',
    
    acls: [
      {
        name: 'CSM Agent - Read/Create Own',
        role: 'x_20261805_csm.csm_agent',
        operation: 'read,create',
        condition: 'case_id.assigned_to = current_user OR case_id.created_by = current_user'
      },
      {
        name: 'CSM Manager - Read/Create/Update/Delete',
        role: 'x_20261805_csm.csm_manager',
        operation: 'read,create,write,delete',
        condition: 'case_id.assignment_group IN (manager_groups)'
      },
      {
        name: 'CSM Admin - All',
        role: 'x_20261805_csm.csm_admin',
        operation: 'all',
        condition: 'none'
      },
      {
        name: 'Customer User - Read External Communications',
        role: 'x_20261805_csm.customer_user',
        operation: 'read',
        condition: 'case_id.created_by = current_user AND type = "external"'
      }
    ],
    
    fieldACLs: {
      internal_notes: {
        read: ['x_20261805_csm.csm_agent', 'x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin'],
        write: ['x_20261805_csm.csm_agent', 'x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin'],
        visible_to_customer: false
      },
      message_body: {
        read: ['all'],
        write: ['creator', 'x_20261805_csm.csm_manager', 'x_20261805_csm.csm_admin'],
        visible_to_customer: true
      }
    }
  },
  
  sla_policy: {
    tableName: 'SLA Policy (x_20261805_csm_sla_policy)',
    description: 'System configuration - very restricted',
    
    acls: [
      {
        name: 'CSM Agent - Read Only',
        role: 'x_20261805_csm.csm_agent',
        operation: 'read',
        condition: 'none'
      },
      {
        name: 'CSM Manager - Read Only',
        role: 'x_20261805_csm.csm_manager',
        operation: 'read',
        condition: 'none'
      },
      {
        name: 'CSM Admin - All',
        role: 'x_20261805_csm.csm_admin',
        operation: 'all',
        condition: 'none'
      }
    ]
  },
  
  knowledge_article: {
    tableName: 'Knowledge Article (x_20261805_csm_knowledge_article)',
    description: 'Knowledge base articles',
    
    acls: [
      {
        name: 'CSM Agent - Read Published',
        role: 'x_20261805_csm.csm_agent',
        operation: 'read',
        condition: 'published = true'
      },
      {
        name: 'CSM Manager - Read/Create/Update Own',
        role: 'x_20261805_csm.csm_manager',
        operation: 'read,create,write',
        condition: 'published = true OR created_by = current_user'
      },
      {
        name: 'CSM Admin - All',
        role: 'x_20261805_csm.csm_admin',
        operation: 'all',
        condition: 'none'
      },
      {
        name: 'Customer User - Read Published Portal',
        role: 'x_20261805_csm.customer_user',
        operation: 'read',
        condition: 'published = true AND visible_to_portal = true'
      }
    ]
  }
};

// ============================================================
// ROLE HIERARCHY & INHERITANCE
// ============================================================

export const ROLE_HIERARCHY = {
  csm_admin: {
    level: 4,
    inherits: ['csm_manager'],
    description: 'Highest privilege level - system administrator'
  },
  csm_manager: {
    level: 3,
    inherits: ['csm_agent'],
    description: 'Team lead - manages cases and agents'
  },
  csm_agent: {
    level: 2,
    inherits: [],
    description: 'Standard user - works on assigned cases'
  },
  customer_user: {
    level: 1,
    inherits: [],
    description: 'External user - portal access only',
    special: 'external_user'
  }
};

// ============================================================
// SECURITY POLICIES
// ============================================================

export const SECURITY_POLICIES = {
  
  dataOwnership: {
    description: 'Users can only modify data they own or have delegation',
    rules: [
      'Agents can only update cases assigned to them',
      'Managers can update cases in their groups',
      'Admins can update any data',
      'Customers can only view own cases'
    ]
  },
  
  fieldLevelSecurity: {
    description: 'Certain fields have restricted access',
    rules: [
      'Auto-generated fields (number, timestamps) are read-only',
      'Sensitive fields (closure_code) restricted to managers/admins',
      'Internal notes hidden from external users',
      'Financial data visible only to managers and above'
    ]
  },
  
  delegationRules: {
    description: 'Who can delegate permissions',
    rules: [
      'Managers can delegate case ownership to other managers',
      'Admins can delegate any permission',
      'Agents cannot delegate',
      'Customers cannot delegate'
    ]
  },
  
  auditingRequirements: {
    description: 'Track all access and modifications',
    rules: [
      'Log all read operations on sensitive data',
      'Log all write operations on all tables',
      'Log all delete operations',
      'Log all role changes',
      'Retain audit logs for minimum 90 days'
    ]
  },
  
  passwordPolicy: {
    description: 'Authentication requirements',
    rules: [
      'Minimum 12 characters',
      'Must include uppercase, lowercase, numbers, special characters',
      'Must be changed every 90 days',
      'Cannot reuse last 5 passwords',
      'Account locked after 5 failed attempts'
    ]
  }
};

// ============================================================
// REPORT ACCESS MATRIX
// ============================================================

export const REPORT_ACCESS = {
  
  'Case Volume by Priority': {
    csm_agent: false,
    csm_manager: true,
    csm_admin: true,
    customer_user: false
  },
  
  'Agent Workload Distribution': {
    csm_agent: false,
    csm_manager: true,
    csm_admin: true,
    customer_user: false
  },
  
  'SLA Compliance Report': {
    csm_agent: false,
    csm_manager: true,
    csm_admin: true,
    customer_user: false
  },
  
  'Mean Time to Resolution': {
    csm_agent: false,
    csm_manager: true,
    csm_admin: true,
    customer_user: false
  },
  
  'Customer Satisfaction Scores': {
    csm_agent: false,
    csm_manager: true,
    csm_admin: true,
    customer_user: true
  },
  
  'My Cases': {
    csm_agent: true,
    csm_manager: true,
    csm_admin: true,
    customer_user: true
  },
  
  'System Audit Log': {
    csm_agent: false,
    csm_manager: false,
    csm_admin: true,
    customer_user: false
  }
};

// ============================================================
// ROLE ASSIGNMENT GUIDELINES
// ============================================================

export const ROLE_ASSIGNMENT_GUIDELINES = {
  
  csm_agent: {
    who: 'New support staff, tier 1 technicians',
    training: '8 hours - system basics, case handling',
    startDate: 'Day 1',
    supervision: 'Required - manager oversight',
    certification: 'Optional',
    description: 'Entry-level support role'
  },
  
  csm_manager: {
    who: 'Senior support staff with 1+ years experience',
    training: '16 hours - team management, escalations, reporting',
    startDate: 'After 12 months as agent',
    supervision: 'None - self-managed',
    certification: 'Recommended - management certification',
    description: 'Leadership and team coordination role'
  },
  
  csm_admin: {
    who: 'IT administrators, system owners',
    training: '24 hours - system administration, security, configuration',
    startDate: 'After vetting and approval',
    supervision: 'None - system owner authority',
    certification: 'Required - ServiceNow admin certification',
    description: 'System administration and maintenance role'
  },
  
  customer_user: {
    who: 'External customers, end users',
    training: '2 hours - portal usage, case creation, tracking',
    startDate: 'Immediate on account creation',
    supervision: 'None - self-service',
    certification: 'None',
    description: 'External portal access role'
  }
};

export default {
  ROLES,
  CSM_AGENT_ROLE,
  CSM_MANAGER_ROLE,
  CSM_ADMIN_ROLE,
  CUSTOMER_USER_ROLE,
  TABLE_ACL_RECOMMENDATIONS,
  ROLE_HIERARCHY,
  SECURITY_POLICIES,
  REPORT_ACCESS,
  ROLE_ASSIGNMENT_GUIDELINES
};
