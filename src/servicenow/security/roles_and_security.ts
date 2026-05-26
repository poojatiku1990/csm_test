/**
 * CSM Application Security and Roles
 * Scope: x_20261805_csm
 * 
 * Defines role-based access control and permissions for the CSM application
 */

export const CSM_ROLES = {
  admin: {
    name: 'csm_admin',
    description: 'CSM Application Administrator - Full access',
    permissions: [
      'read', 'write', 'delete', 'admin',
      'manage_users', 'manage_sla', 'view_reports',
      'configure_routing', 'manage_escalations'
    ],
    can: {
      createCases: true,
      updateCases: true,
      deleteCases: true,
      manageSLA: true,
      assignCases: true,
      closeAndResolve: true,
      requestFeedback: true,
      viewAllCases: true,
      generateReports: true,
      escalateUnlimited: true
    }
  },
  
  manager: {
    name: 'csm_manager',
    description: 'CSM Manager - Team management and oversight',
    permissions: [
      'read', 'write', 'assign', 'escalate',
      'view_reports', 'manage_team'
    ],
    can: {
      createCases: true,
      updateCases: true,
      deleteCases: false,
      manageSLA: false,
      assignCases: true,
      closeAndResolve: true,
      requestFeedback: true,
      viewAllCases: true,
      generateReports: true,
      escalateUnlimited: true,
      viewTeamMetrics: true
    }
  },
  
  teamLead: {
    name: 'csm_team_lead',
    description: 'CSM Team Lead - Team coordination',
    permissions: [
      'read', 'write', 'assign', 'escalate'
    ],
    can: {
      createCases: true,
      updateCases: true,
      deleteCases: false,
      manageSLA: false,
      assignCases: true,
      closeAndResolve: true,
      requestFeedback: true,
      viewTeamCases: true,
      generateReports: false,
      escalateUnlimited: false
    }
  },
  
  agent: {
    name: 'csm_agent',
    description: 'CSM Support Agent - Case handling',
    permissions: [
      'read', 'write', 'comment'
    ],
    can: {
      createCases: true,
      updateCases: true,
      deleteCases: false,
      manageSLA: false,
      assignCases: false,
      closeAndResolve: true,
      requestFeedback: true,
      viewOwnCases: true,
      generateReports: false,
      escalateUnlimited: false,
      viewPersonalMetrics: true
    }
  },
  
  viewer: {
    name: 'csm_viewer',
    description: 'CSM Viewer - Read-only access',
    permissions: [
      'read'
    ],
    can: {
      createCases: false,
      updateCases: false,
      deleteCases: false,
      manageSLA: false,
      assignCases: false,
      closeAndResolve: false,
      requestFeedback: false,
      viewAllCases: true,
      generateReports: true,
      escalateUnlimited: false
    }
  }
};

/**
 * Access Control Rules
 */
export const ACL_RULES = {
  // Customer Case Table ACLs
  customer_case: {
    create: {
      requiresRole: ['csm_admin', 'csm_manager', 'csm_agent'],
      condition: null
    },
    read: {
      requiresRole: ['csm_admin', 'csm_manager', 'csm_agent', 'csm_viewer'],
      condition: 'assigned_to = current_user OR created_by = current_user OR assignment_group IN (current_user_groups)'
    },
    write: {
      requiresRole: ['csm_admin', 'csm_manager', 'csm_agent'],
      condition: 'assigned_to = current_user OR created_by = current_user OR assignment_group IN (current_user_groups)'
    },
    delete: {
      requiresRole: ['csm_admin'],
      condition: null
    }
  },
  
  // SLA Table ACLs
  sla: {
    read: {
      requiresRole: ['csm_admin', 'csm_manager', 'csm_agent', 'csm_viewer'],
      condition: null
    },
    write: {
      requiresRole: ['csm_admin'],
      condition: null
    }
  },
  
  // Reports ACLs
  reports: {
    read: {
      requiresRole: ['csm_admin', 'csm_manager', 'csm_viewer'],
      condition: null
    },
    create: {
      requiresRole: ['csm_admin', 'csm_manager'],
      condition: null
    }
  }
};

/**
 * Field-level Security
 */
export const FIELD_LEVEL_SECURITY = {
  customer_case: {
    // Sensitive fields restricted to admins
    sla_policy: {
      read: ['csm_admin', 'csm_manager', 'csm_agent'],
      write: ['csm_admin']
    },
    is_escalated: {
      read: ['csm_admin', 'csm_manager', 'csm_team_lead'],
      write: ['csm_admin', 'csm_manager']
    },
    escalation_reason: {
      read: ['csm_admin', 'csm_manager', 'csm_team_lead'],
      write: ['csm_admin', 'csm_manager']
    },
    customer_satisfaction: {
      read: ['csm_admin', 'csm_manager'],
      write: ['csm_admin', 'csm_agent']
    },
    // Work notes visible only to agents and up
    work_notes: {
      read: ['csm_admin', 'csm_manager', 'csm_agent', 'csm_team_lead'],
      write: ['csm_admin', 'csm_manager', 'csm_agent', 'csm_team_lead']
    },
    // Comments visible to all
    comments: {
      read: ['csm_admin', 'csm_manager', 'csm_agent', 'csm_team_lead', 'csm_viewer'],
      write: ['csm_admin', 'csm_manager', 'csm_agent', 'csm_team_lead']
    }
  }
};

/**
 * Verification helper methods
 */
export class SecurityManager {
  /**
   * Check if user has required role
   */
  static userHasRole(userId: string, requiredRoles: string[]): boolean {
    const userGR = new GlideRecord('sys_user');
    if (!userGR.get(userId)) {
      return false;
    }
    
    for (const role of requiredRoles) {
      if (userGR.hasRole(role)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Verify user can perform action
   */
  static canPerformAction(userId: string, action: string): boolean {
    const userGR = new GlideRecord('sys_user');
    if (!userGR.get(userId)) {
      return false;
    }
    
    const roles = userGR.getRoles().split(',');
    
    for (const role of roles) {
      const roleConfig = Object.values(CSM_ROLES).find(r => r.name === role.trim());
      if (roleConfig && roleConfig.permissions.includes(action)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Check field-level access
   */
  static canAccessField(userId: string, tableName: string, fieldName: string, operation: 'read' | 'write'): boolean {
    const userGR = new GlideRecord('sys_user');
    if (!userGR.get(userId)) {
      return false;
    }
    
    const userRoles = userGR.getRoles().split(',').map(r => r.trim());
    const fieldSecurity = FIELD_LEVEL_SECURITY[tableName]?.[fieldName];
    
    if (!fieldSecurity) {
      return true; // No restrictions
    }
    
    const allowedRoles = fieldSecurity[operation];
    return userRoles.some(role => allowedRoles.includes(role));
  }
  
  /**
   * Get user capabilities
   */
  static getUserCapabilities(userId: string): { [key: string]: boolean } {
    const userGR = new GlideRecord('sys_user');
    if (!userGR.get(userId)) {
      return {};
    }
    
    const userRoles = userGR.getRoles().split(',').map(r => r.trim());
    const capabilities: { [key: string]: boolean } = {};
    
    // Get all capabilities from all roles user has
    for (const roleKey of Object.keys(CSM_ROLES)) {
      const roleConfig = CSM_ROLES[roleKey];
      if (userRoles.includes(roleConfig.name)) {
        Object.assign(capabilities, roleConfig.can);
      }
    }
    
    return capabilities;
  }
  
  /**
   * Audit security action
   */
  static auditSecurityAction(action: string, userId: string, details: string): void {
    try {
      const auditGR = new GlideRecord('x_20261805_csm_security_audit');
      auditGR.setValue('action', action);
      auditGR.setValue('user_id', userId);
      auditGR.setValue('details', details);
      auditGR.setValue('timestamp', new GlideDateTime().toString());
      auditGR.setValue('ip_address', gs.getRemoteAddr());
      auditGR.insert();
    } catch (e) {
      gs.error('Error creating security audit: ' + e);
    }
  }
}

export default SecurityManager;
