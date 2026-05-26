/**
 * Flow: Route High Priority Case
 * Scope: x_20261805_csm
 * Type: Process Flow
 * 
 * This flow handles the routing and escalation of high-priority customer cases
 * to appropriate teams with notifications and SLA tracking.
 * 
 * Can be configured in ServiceNow Flow Designer with the following steps:
 */

export const FLOW_CONFIG = {
  name: 'Route High Priority Customer Case',
  tableName: 'x_20261805_csm_customer_case',
  isActive: true,
  triggerType: 'record_updated',
  triggerConditions: {
    table: 'x_20261805_csm_customer_case',
    condition: "priority IN 1,2 ^ORstate = 'new'"
  },
  
  steps: [
    {
      step: 1,
      name: 'Check Priority Level',
      type: 'condition',
      description: 'Determine if case is high priority (1 or 2)',
      conditions: {
        if: "{{trigger.priority}} < 3",
        then: 'route_to_senior_team',
        else: 'route_to_standard_team'
      }
    },
    {
      step: 2,
      name: 'Route to Senior Team',
      type: 'assignment',
      description: 'Assign to senior support group',
      assignmentGroup: 'x_20261805_csm_senior_support',
      condition: 'route_to_senior_team',
      parallel: false
    },
    {
      step: 3,
      name: 'Route to Standard Team',
      type: 'assignment',
      description: 'Assign to standard support group based on category',
      condition: 'route_to_standard_team',
      routing: {
        'Technical': 'x_20261805_csm_technical_support',
        'Billing': 'x_20261805_csm_billing_support',
        'Account': 'x_20261805_csm_account_support',
        'default': 'x_20261805_csm_general_support'
      }
    },
    {
      step: 4,
      name: 'Attach SLA Policy',
      type: 'script',
      description: 'Attach appropriate SLA policy based on priority',
      scriptInclude: 'CSMSLAManager',
      scriptMethod: 'attachSLAPolicy',
      parameters: {
        caseId: '{{trigger.sys_id}}'
      }
    },
    {
      step: 5,
      name: 'Send Notification',
      type: 'notification',
      description: 'Notify assignment group of new case',
      notificationType: 'case_assignment',
      recipients: '{{assignment_group.members}}',
      template: 'case_assignment_notification',
      condition: 'priority < 3'
    },
    {
      step: 6,
      name: 'Set Case State',
      type: 'update_record',
      description: 'Update case state to open',
      recordUpdates: {
        state: 'open',
        assigned_to_date: 'now'
      }
    },
    {
      step: 7,
      name: 'Log Routing Action',
      type: 'audit',
      description: 'Create audit log entry for routing',
      auditTable: 'x_20261805_csm_routing_log',
      auditData: {
        case_id: '{{trigger.sys_id}}',
        assigned_group: '{{assignment_group}}',
        priority: '{{trigger.priority}}',
        timestamp: 'now',
        action: 'routed_to_team'
      }
    }
  ],
  
  parallelSteps: [
    {
      name: 'Update Dashboard',
      type: 'async_action',
      description: 'Update team dashboard in real-time'
    },
    {
      name: 'Send Customer Confirmation',
      type: 'notification',
      description: 'Send case acknowledgment to customer'
    }
  ]
};

/**
 * Flow Step Implementation Helpers
 */

export class HighPriorityCaseFlow {
  /**
   * Check if case meets high-priority criteria for routing
   */
  static isHighPriority(caseRecord: GlideRecord): boolean {
    const priority = parseInt(caseRecord.getValue('priority'));
    return priority <= 2;
  }
  
  /**
   * Route case to appropriate team based on category
   */
  static routeToTeam(caseRecord: GlideRecord): string {
    const category = caseRecord.getValue('category');
    const priority = parseInt(caseRecord.getValue('priority'));
    
    // Critical cases always go to senior team
    if (priority === 1) {
      return this.assignToGroup(caseRecord, 'x_20261805_csm_senior_support');
    }
    
    // Route by category for other priorities
    const categoryRoutes: { [key: string]: string } = {
      'Technical': 'x_20261805_csm_technical_support',
      'Billing': 'x_20261805_csm_billing_support',
      'Account': 'x_20261805_csm_account_support'
    };
    
    const teamId = categoryRoutes[category] || 'x_20261805_csm_general_support';
    return this.assignToGroup(caseRecord, teamId);
  }
  
  /**
   * Assign case to group with automatic individual assignment
   */
  private static assignToGroup(caseRecord: GlideRecord, groupId: string): string {
    const groupGR = new GlideRecord('sys_user_group');
    if (!groupGR.get(groupId)) {
      return null;
    }
    
    caseRecord.setValue('assignment_group', groupId);
    
    // Get least busy team member
    const agentGR = new GlideRecord('sys_user');
    agentGR.addQuery('groups.sys_id', groupId);
    agentGR.addQuery('active', true);
    agentGR.addQuery('state', 'available');
    agentGR.orderBy('u_current_workload');
    agentGR.setLimit(1);
    agentGR.query();
    
    if (agentGR.next()) {
      caseRecord.setValue('assigned_to', agentGR.getValue('sys_id'));
    }
    
    caseRecord.setValue('state', 'open');
    caseRecord.update();
    
    return groupId;
  }
  
  /**
   * Send case assignment notification
   */
  static sendAssignmentNotification(caseRecord: GlideRecord): void {
    try {
      const groupId = caseRecord.getValue('assignment_group');
      const assignedTo = caseRecord.getValue('assigned_to');
      
      if (!assignedTo) {
        return;
      }
      
      // Get assigned agent details
      const agentGR = new GlideRecord('sys_user');
      agentGR.get(assignedTo);
      
      const subject = `New Case: ${caseRecord.getValue('number')} - ${caseRecord.getValue('short_description').substring(0, 50)}`;
      const priority = caseRecord.getValue('priority');
      const priorityLabel = this.getPriorityLabel(priority);
      
      const body = `
A new customer case has been assigned to you:

Case Number: ${caseRecord.getValue('number')}
Priority: ${priorityLabel}
Customer: ${caseRecord.getValue('customer.name')}
Description: ${caseRecord.getValue('short_description')}

Please log into ServiceNow to review and respond to this case.

View Case: ${this.getCaseURL(caseRecord)}
      `;
      
      const mail = new GlideEmailMessage();
      mail.setSubject(subject);
      mail.setBody(body);
      mail.addRecipient(agentGR.getValue('email'));
      mail.send();
    } catch (e) {
      gs.error('Error sending assignment notification in flow: ' + e);
    }
  }
  
  /**
   * Send customer acknowledgment
   */
  static sendCustomerAcknowledgment(caseRecord: GlideRecord): void {
    try {
      const customerEmail = caseRecord.getValue('customer_email');
      if (!customerEmail) {
        return;
      }
      
      const subject = `We've Received Your Case: ${caseRecord.getValue('number')}`;
      const body = `
Hello,

Thank you for contacting our support team. We have received your case and assigned it to our ${caseRecord.getValue('assignment_group.name')} team.

Case Number: ${caseRecord.getValue('number')}
Description: ${caseRecord.getValue('short_description')}

Your case is now in progress. We will keep you updated on the status.

Best regards,
Customer Support Team
      `;
      
      const mail = new GlideEmailMessage();
      mail.setSubject(subject);
      mail.setBody(body);
      mail.addRecipient(customerEmail);
      mail.send();
    } catch (e) {
      gs.error('Error sending customer acknowledgment: ' + e);
    }
  }
  
  /**
   * Convert priority to label
   */
  private static getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      '1': 'Critical',
      '2': 'High',
      '3': 'Medium',
      '4': 'Low',
      '5': 'Minimal'
    };
    return labels[priority] || 'Unknown';
  }
  
  /**
   * Get case URL for notification links
   */
  private static getCaseURL(caseRecord: GlideRecord): string {
    return `${gs.getProperty('glide.servlet.uri')}/nav_to.do?uri=${caseRecord.getTableName()}.do?sys_id=${caseRecord.getValue('sys_id')}`;
  }
}

export default HighPriorityCaseFlow;
