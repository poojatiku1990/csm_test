/**
 * Script Include: SLA Manager
 * Scope: x_20261805_csm
 * 
 * Provides utilities for SLA policy attachment, calculation, and tracking
 * for customer service cases.
 */

export class CSMSLAManager {
  /**
   * Attach SLA policy to a case based on priority and category
   */
  static attachSLAPolicy(caseId: string): string {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return null;
    }
    
    const priority = caseGR.getValue('priority');
    const category = caseGR.getValue('category');
    
    // Determine SLA policy based on priority and category
    const policyName = this.determineSLAPolicy(priority, category);
    
    // Get SLA policy record
    const slaGR = new GlideRecord('sla');
    slaGR.addQuery('name', policyName);
    slaGR.addQuery('active', true);
    slaGR.query();
    
    if (!slaGR.next()) {
      gs.warn(`SLA policy not found: ${policyName}`);
      return null;
    }
    
    // Update case with SLA policy
    caseGR.setValue('sla_policy', slaGR.getValue('sys_id'));
    caseGR.update();
    
    // Attach SLA instance
    const slaInstance = this.createSLAInstance(caseGR, slaGR);
    
    return slaGR.getValue('sys_id');
  }
  
  /**
   * Determine appropriate SLA policy based on case characteristics
   */
  private static determineSLAPolicy(priority: string, category: string): string {
    const priorityLevel = parseInt(priority);
    
    // Critical cases get premium SLA
    if (priorityLevel === 1) {
      return 'x_20261805_csm_sla_critical';
    }
    
    // High priority cases
    if (priorityLevel === 2) {
      return 'x_20261805_csm_sla_high';
    }
    
    // Category-based SLA selection for medium priority
    if (priorityLevel === 3) {
      if (category === 'Technical') {
        return 'x_20261805_csm_sla_technical_medium';
      } else if (category === 'Billing') {
        return 'x_20261805_csm_sla_billing_medium';
      }
      return 'x_20261805_csm_sla_standard';
    }
    
    // Low priority cases
    return 'x_20261805_csm_sla_standard';
  }
  
  /**
   * Create SLA instance for case
   */
  private static createSLAInstance(caseRecord: GlideRecord, slaPolicy: GlideRecord): string {
    const slaInstanceGR = new GlideRecord('sla_instance');
    slaInstanceGR.setValue('table_name', caseRecord.getTableName());
    slaInstanceGR.setValue('task_id', caseRecord.getValue('sys_id'));
    slaInstanceGR.setValue('stage', 'response');
    slaInstanceGR.setValue('active', true);
    slaInstanceGR.setValue('start_time', gs.now());
    
    const sysId = slaInstanceGR.insert();
    return sysId;
  }
  
  /**
   * Calculate SLA health percentage
   */
  static calculateSLAHealth(caseId: string): number {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return 0;
    }
    
    const createdTime = new GlideDateTime(caseGR.getValue('sys_created_on'));
    const currentTime = new GlideDateTime();
    const elapsedMs = currentTime.getNumericValue() - createdTime.getNumericValue();
    
    const slaPolicy = caseGR.getValue('sla_policy');
    if (!slaPolicy) {
      return 100;
    }
    
    // Get SLA policy details
    const slaGR = new GlideRecord('sla');
    if (!slaGR.get(slaPolicy)) {
      return 100;
    }
    
    // Get resolution time in milliseconds
    const resolutionMinutes = parseInt(slaGR.getValue('duration'));
    const totalMs = resolutionMinutes * 60 * 1000;
    
    // Calculate percentage (higher = better)
    const healthPercent = 100 - ((elapsedMs / totalMs) * 100);
    
    return Math.max(0, Math.min(100, healthPercent));
  }
  
  /**
   * Check if SLA is breached
   */
  static isSLABreached(caseId: string): boolean {
    return this.calculateSLAHealth(caseId) <= 0;
  }
  
  /**
   * Get time remaining before SLA breach
   */
  static getTimeRemaining(caseId: string): string {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return 'Unknown';
    }
    
    const createdTime = new GlideDateTime(caseGR.getValue('sys_created_on'));
    const currentTime = new GlideDateTime();
    
    const slaPolicy = caseGR.getValue('sla_policy');
    if (!slaPolicy) {
      return 'No SLA';
    }
    
    const slaGR = new GlideRecord('sla');
    if (!slaGR.get(slaPolicy)) {
      return 'SLA Not Found';
    }
    
    const resolutionMinutes = parseInt(slaGR.getValue('duration'));
    const deadlineMs = createdTime.getNumericValue() + (resolutionMinutes * 60 * 1000);
    const remainingMs = deadlineMs - currentTime.getNumericValue();
    
    if (remainingMs <= 0) {
      return 'Breached';
    }
    
    // Convert to human readable format
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }
  
  /**
   * Get SLA policy details for case
   */
  static getSLAPolicyDetails(caseId: string): { [key: string]: string } {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return {};
    }
    
    const slaPolicy = caseGR.getValue('sla_policy');
    if (!slaPolicy) {
      return {};
    }
    
    const slaGR = new GlideRecord('sla');
    if (!slaGR.get(slaPolicy)) {
      return {};
    }
    
    return {
      name: slaGR.getValue('name'),
      duration: slaGR.getValue('duration'),
      description: slaGR.getValue('description'),
      active: slaGR.getValue('active')
    };
  }
  
  /**
   * Escalate case if SLA is at risk
   */
  static escalateIfAtRisk(caseId: string): void {
    const health = this.calculateSLAHealth(caseId);
    
    // Escalate if health drops below 20%
    if (health < 20 && health > 0) {
      const caseGR = new GlideRecord('x_20261805_csm_customer_case');
      if (!caseGR.get(caseId)) {
        return;
      }
      
      // Mark as escalated
      caseGR.setValue('is_escalated', true);
      caseGR.setValue('escalation_reason', 'SLA At Risk - ${health}% remaining');
      caseGR.update();
      
      // Send escalation notification
      this.sendEscalationNotification(caseGR);
    }
  }
  
  /**
   * Send escalation notification
   */
  private static sendEscalationNotification(caseRecord: GlideRecord): void {
    try {
      // Get assignment group manager
      const groupId = caseRecord.getValue('assignment_group');
      const groupGR = new GlideRecord('sys_user_group');
      if (!groupGR.get(groupId)) {
        return;
      }
      
      // Get group manager
      const managerEmail = groupGR.getValue('manager.email');
      if (!managerEmail) {
        return;
      }
      
      const subject = `ESCALATION: SLA at Risk for Case ${caseRecord.getValue('number')}`;
      const body = `The following case has been escalated due to SLA risk:\n\nCase: ${caseRecord.getValue('number')}\nCustomer: ${caseRecord.getValue('customer.name')}\nPriority: ${caseRecord.getValue('priority')}\n\nPlease review and take action immediately.`;
      
      const mail = new GlideEmailMessage();
      mail.setSubject(subject);
      mail.setBody(body);
      mail.addRecipient(managerEmail);
      mail.send();
    } catch (e) {
      gs.error('Error sending escalation notification: ' + e);
    }
  }
}

// Export for use in other scripts
export default CSMSLAManager;
