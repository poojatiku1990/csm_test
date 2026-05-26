/**
 * Business Rule: Auto Assign Customer Cases
 * Scope: x_20261805_csm
 * Event: After insert; After update
 * Filter: Priority is less than or equal to 2 (Critical or High)
 * 
 * This business rule automatically assigns high-priority cases to the appropriate
 * support group and individual agent based on availability and workload.
 */

export class AutoAssignCaseRule {
  /**
   * Main execution method called by ServiceNow when rule conditions are met
   */
  execute(): void {
    const gr = new GlideRecord('x_20261805_csm_customer_case');
    
    // Get the priority threshold (1=Critical, 2=High)
    const highPriorityThreshold = 2;
    
    // Check if case meets auto-assignment criteria
    if (this.shouldAutoAssign(gr, highPriorityThreshold)) {
      const assignmentGroup = this.getOptimalAssignmentGroup(gr);
      const assignedAgent = this.getAvailableAgent(assignmentGroup, gr);
      
      if (assignedAgent) {
        // Update case with assignment
        gr.assignment_group = assignmentGroup.sys_id;
        gr.assigned_to = assignedAgent.sys_id;
        gr.assigned_to_date = new GlideDateTime().toString();
        gr.state = 'open'; // Set to open when assigned
        gr.update();
        
        // Log assignment for audit trail
        this.logAssignment(gr.sys_id, assignmentGroup.name, assignedAgent.name);
        
        // Send notification to assigned agent
        this.notifyAssignedAgent(gr, assignedAgent);
      }
    }
  }
  
  /**
   * Determine if case should be auto-assigned
   */
  private shouldAutoAssign(caseRecord: GlideRecord, threshold: number): boolean {
    // Check if priority meets threshold
    if (parseInt(caseRecord.getValue('priority')) > threshold) {
      return false;
    }
    
    // Don't re-assign if already assigned
    if (caseRecord.getValue('assigned_to')) {
      return false;
    }
    
    // Check if case is in valid state for assignment
    const validStates = ['new', 'open'];
    if (!validStates.includes(caseRecord.getValue('state'))) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Get optimal assignment group based on case category and priority
   */
  private getOptimalAssignmentGroup(caseRecord: GlideRecord): GlideRecord {
    const category = caseRecord.getValue('category');
    const priority = caseRecord.getValue('priority');
    
    let groupName: string;
    
    // Routing logic based on category
    switch (category) {
      case 'Billing':
        groupName = 'x_20261805_csm_billing_support';
        break;
      case 'Technical':
        groupName = 'x_20261805_csm_technical_support';
        break;
      case 'Account':
        groupName = 'x_20261805_csm_account_support';
        break;
      default:
        groupName = 'x_20261805_csm_general_support';
    }
    
    // For critical priority, route to senior group
    if (priority === '1') {
      groupName = 'x_20261805_csm_senior_support';
    }
    
    const groupGR = new GlideRecord('sys_user_group');
    groupGR.addQuery('name', groupName);
    groupGR.query();
    
    if (groupGR.next()) {
      return groupGR;
    }
    
    // Fallback to general support if group not found
    groupGR.addQuery('name', 'x_20261805_csm_general_support');
    groupGR.query();
    groupGR.next();
    return groupGR;
  }
  
  /**
   * Get available agent with lowest workload
   */
  private getAvailableAgent(assignmentGroup: GlideRecord, caseRecord: GlideRecord): GlideRecord | null {
    const agentGR = new GlideRecord('sys_user');
    agentGR.addQuery('active', true);
    agentGR.addQuery('groups.sys_id', assignmentGroup.getValue('sys_id'));
    agentGR.addQuery('state', 'available');
    agentGR.orderBy('u_workload'); // Custom field: current workload
    agentGR.setLimit(1);
    agentGR.query();
    
    if (agentGR.next()) {
      return agentGR;
    }
    
    // If no available agent found, return team lead
    const leadGR = new GlideRecord('sys_user');
    leadGR.addQuery('roles', 'contains', 'csm_team_lead');
    leadGR.addQuery('groups.sys_id', assignmentGroup.getValue('sys_id'));
    leadGR.addQuery('active', true);
    leadGR.orderBy('name');
    leadGR.setLimit(1);
    leadGR.query();
    
    if (leadGR.next()) {
      return leadGR;
    }
    
    return null;
  }
  
  /**
   * Log assignment action to audit table
   */
  private logAssignment(caseId: string, groupName: string, agentName: string): void {
    const logGR = new GlideRecord('x_20261805_csm_assignment_log');
    logGR.setValue('case_id', caseId);
    logGR.setValue('assignment_group', groupName);
    logGR.setValue('assigned_agent', agentName);
    logGR.setValue('assignment_timestamp', new GlideDateTime().toString());
    logGR.setValue('assignment_reason', 'Auto-assignment - High priority case');
    logGR.insert();
  }
  
  /**
   * Send email notification to assigned agent
   */
  private notifyAssignedAgent(caseRecord: GlideRecord, agent: GlideRecord): void {
    try {
      const email = agent.getValue('email');
      if (!email) {
        return;
      }
      
      const subject = `New Customer Case Assigned: ${caseRecord.getValue('number')}`;
      const body = this.buildNotificationEmail(caseRecord, agent);
      
      const mail = new GlideEmailMessage();
      mail.setSubject(subject);
      mail.setBody(body);
      mail.addRecipient(email);
      mail.send();
    } catch (e) {
      gs.error('Error sending assignment notification: ' + e);
    }
  }
  
  /**
   * Build HTML email for assignment notification
   */
  private buildNotificationEmail(caseRecord: GlideRecord, agent: GlideRecord): string {
    const caseNumber = caseRecord.getValue('number');
    const description = caseRecord.getValue('short_description');
    const priority = this.getPriorityLabel(caseRecord.getValue('priority'));
    const customer = caseRecord.getValue('customer.name');
    const caseUrl = `${gs.getProperty('glide.servlet.uri')}/nav_to.do?uri=${caseRecord.getTableName()}.do?sys_id=${caseRecord.getValue('sys_id')}`;
    
    return `
<html>
  <body>
    <h2>New Case Assignment</h2>
    <p>Hello ${agent.getValue('first_name')},</p>
    <p>A new customer case has been assigned to you:</p>
    
    <table style="border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 8px; font-weight: bold;">Case Number:</td>
        <td style="padding: 8px;">${caseNumber}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Customer:</td>
        <td style="padding: 8px;">${customer}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Priority:</td>
        <td style="padding: 8px;">${priority}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Description:</td>
        <td style="padding: 8px;">${description}</td>
      </tr>
    </table>
    
    <p><a href="${caseUrl}">View Case in ServiceNow</a></p>
    
    <p>Please review this case and update the status as needed.</p>
  </body>
</html>
    `;
  }
  
  /**
   * Convert priority number to label
   */
  private getPriorityLabel(priority: string): string {
    const labels: { [key: string]: string } = {
      '1': 'Critical',
      '2': 'High',
      '3': 'Medium',
      '4': 'Low',
      '5': 'Minimal'
    };
    return labels[priority] || 'Unknown';
  }
}

/**
 * Script include for reuse across application
 */
export const BUSINESS_RULE_CONFIG = {
  name: 'Auto Assign Customer Case',
  tableName: 'x_20261805_csm_customer_case',
  when: 'after',
  insertAndUpdate: true,
  filter: "priority <= '2' ^ORpriority = '1'",
  scriptInclude: 'x_20261805_csm_auto_assign_utils',
  active: true
};
