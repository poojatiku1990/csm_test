/**
 * Case Closure and Resolution Workflow
 * Scope: x_20261805_csm
 * 
 * Manages the process of resolving and closing customer service cases
 * including validation, documentation, and customer notification
 */

export class CaseClosureWorkflow {
  /**
   * Validate case is ready for resolution
   */
  static validateForResolution(caseId: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    
    if (!caseGR.get(caseId)) {
      errors.push('Case not found');
      return { valid: false, errors };
    }
    
    // Check required fields for resolution
    if (!caseGR.getValue('resolution_code')) {
      errors.push('Resolution code is required');
    }
    
    if (!caseGR.getValue('resolution_notes') || caseGR.getValue('resolution_notes').length < 20) {
      errors.push('Resolution notes must be at least 20 characters');
    }
    
    if (!caseGR.getValue('assigned_to')) {
      errors.push('Case must be assigned before resolution');
    }
    
    // Check if customer has been notified
    if (!this.hasCustomerBeenNotified(caseGR)) {
      errors.push('Customer must be notified before closure');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
  
  /**
   * Check if customer has been contacted
   */
  private static hasCustomerBeenNotified(caseRecord: GlideRecord): boolean {
    // Look for recent customer-visible communication
    const logGR = new GlideRecord('x_20261805_csm_communication_log');
    logGR.addQuery('case_id', caseRecord.getValue('sys_id'));
    logGR.addQuery('visibility', 'customer');
    logGR.addQuery('created_at', '>', new GlideDateTime().addDaysUTC(-7));
    logGR.query();
    
    return logGR.getRowCount() > 0;
  }
  
  /**
   * Resolve a case
   */
  static resolveCase(caseId: string, resolutionData: {
    code: string;
    notes: string;
    notifyCustomer?: boolean;
  }): { success: boolean; message: string } {
    
    const validation = this.validateForResolution(caseId);
    if (!validation.valid) {
      return {
        success: false,
        message: 'Case validation failed: ' + validation.errors.join(', ')
      };
    }
    
    try {
      const caseGR = new GlideRecord('x_20261805_csm_customer_case');
      if (!caseGR.get(caseId)) {
        return { success: false, message: 'Case not found' };
      }
      
      const resolutionTime = new GlideDateTime();
      caseGR.setValue('resolution_code', resolutionData.code);
      caseGR.setValue('resolution_notes', resolutionData.notes);
      caseGR.setValue('resolved_at', resolutionTime.toString());
      caseGR.setValue('state', 'resolved');
      caseGR.update();
      
      // Log resolution
      this.logResolution(caseGR, resolutionData);
      
      // Notify customer if requested
      if (resolutionData.notifyCustomer !== false) {
        this.notifyCustomerOfResolution(caseGR);
      }
      
      return {
        success: true,
        message: 'Case resolved successfully'
      };
    } catch (e) {
      return {
        success: false,
        message: 'Error resolving case: ' + e
      };
    }
  }
  
  /**
   * Close a case after resolution verification
   */
  static closeCase(caseId: string, closureData: {
    feedbackRequested?: boolean;
  }): { success: boolean; message: string } {
    
    try {
      const caseGR = new GlideRecord('x_20261805_csm_customer_case');
      if (!caseGR.get(caseId)) {
        return { success: false, message: 'Case not found' };
      }
      
      // Case must be in resolved state before closing
      if (caseGR.getValue('state') !== 'resolved') {
        return {
          success: false,
          message: 'Case must be resolved before closure'
        };
      }
      
      const closureTime = new GlideDateTime();
      caseGR.setValue('state', 'closed');
      caseGR.setValue('closed_at', closureTime.toString());
      caseGR.update();
      
      // Request feedback
      if (closureData.feedbackRequested !== false) {
        this.requestCustomerFeedback(caseGR);
      }
      
      // Archive case data
      this.archiveCaseData(caseGR);
      
      // Generate closure report
      this.generateClosureReport(caseGR);
      
      return {
        success: true,
        message: 'Case closed successfully'
      };
    } catch (e) {
      return {
        success: false,
        message: 'Error closing case: ' + e
      };
    }
  }
  
  /**
   * Reopen a closed case
   */
  static reopenCase(caseId: string, reason: string): { success: boolean; message: string } {
    try {
      const caseGR = new GlideRecord('x_20261805_csm_customer_case');
      if (!caseGR.get(caseId)) {
        return { success: false, message: 'Case not found' };
      }
      
      if (caseGR.getValue('state') !== 'closed') {
        return {
          success: false,
          message: 'Only closed cases can be reopened'
        };
      }
      
      // Increment reopen counter
      const reopenCount = parseInt(caseGR.getValue('reopened_count')) || 0;
      
      caseGR.setValue('state', 'open');
      caseGR.setValue('reopened_count', reopenCount + 1);
      caseGR.setValue('reopened_at', new GlideDateTime().toString());
      caseGR.setValue('reopened_reason', reason);
      caseGR.update();
      
      // Log reopening
      this.logReopening(caseGR, reason);
      
      // Notify assignment group
      this.notifyGroupOfReopening(caseGR);
      
      return {
        success: true,
        message: 'Case reopened successfully'
      };
    } catch (e) {
      return {
        success: false,
        message: 'Error reopening case: ' + e
      };
    }
  }
  
  /**
   * Log case resolution
   */
  private static logResolution(caseRecord: GlideRecord, resolutionData: any): void {
    try {
      const logGR = new GlideRecord('x_20261805_csm_resolution_log');
      logGR.setValue('case_id', caseRecord.getValue('sys_id'));
      logGR.setValue('case_number', caseRecord.getValue('number'));
      logGR.setValue('resolution_code', resolutionData.code);
      logGR.setValue('resolution_notes', resolutionData.notes);
      logGR.setValue('resolved_by', gs.getUser().getID());
      logGR.setValue('resolved_at', new GlideDateTime().toString());
      logGR.insert();
    } catch (e) {
      gs.error('Error logging resolution: ' + e);
    }
  }
  
  /**
   * Log case reopening
   */
  private static logReopening(caseRecord: GlideRecord, reason: string): void {
    try {
      const logGR = new GlideRecord('x_20261805_csm_reopening_log');
      logGR.setValue('case_id', caseRecord.getValue('sys_id'));
      logGR.setValue('reason', reason);
      logGR.setValue('reopened_by', gs.getUser().getID());
      logGR.setValue('reopened_at', new GlideDateTime().toString());
      logGR.insert();
    } catch (e) {
      gs.error('Error logging reopening: ' + e);
    }
  }
  
  /**
   * Notify customer of case resolution
   */
  private static notifyCustomerOfResolution(caseRecord: GlideRecord): void {
    try {
      const customerEmail = caseRecord.getValue('customer_email');
      if (!customerEmail) {
        return;
      }
      
      const subject = `Your Case ${caseRecord.getValue('number')} Has Been Resolved`;
      const body = `
Hello ${caseRecord.getValue('customer_contact.first_name')},

Your support case has been successfully resolved.

Case Number: ${caseRecord.getValue('number')}
Issue: ${caseRecord.getValue('short_description')}
Resolution: ${caseRecord.getValue('resolution_notes')}

Please review the resolution and let us know if you have any further questions.

Thank you for your business!
Support Team
      `;
      
      const mail = new GlideEmailMessage();
      mail.setSubject(subject);
      mail.setBody(body);
      mail.addRecipient(customerEmail);
      mail.send();
    } catch (e) {
      gs.error('Error notifying customer of resolution: ' + e);
    }
  }
  
  /**
   * Request customer feedback via survey
   */
  private static requestCustomerFeedback(caseRecord: GlideRecord): void {
    try {
      const customerEmail = caseRecord.getValue('customer_email');
      if (!customerEmail) {
        return;
      }
      
      const surveyToken = gs.generateGUID();
      const surveyLink = gs.getProperty('glide.servlet.uri') + 
        `/sp?id=csm_feedback_survey&case=${caseRecord.getValue('sys_id')}&token=${surveyToken}`;
      
      const subject = `We'd love your feedback on Case ${caseRecord.getValue('number')}`;
      const body = `
Hello,

Your support case has been closed. We would appreciate your feedback on your experience.

Please take 2 minutes to complete our survey:
${surveyLink}

Your feedback helps us improve our support service.

Thank you!
Support Team
      `;
      
      const mail = new GlideEmailMessage();
      mail.setSubject(subject);
      mail.setBody(body);
      mail.addRecipient(customerEmail);
      mail.send();
      
      // Record feedback request
      caseRecord.setValue('feedback_provided', false);
      caseRecord.update();
    } catch (e) {
      gs.error('Error requesting customer feedback: ' + e);
    }
  }
  
  /**
   * Archive case data for compliance
   */
  private static archiveCaseData(caseRecord: GlideRecord): void {
    try {
      const archiveGR = new GlideRecord('x_20261805_csm_case_archive');
      archiveGR.setValue('case_id', caseRecord.getValue('sys_id'));
      archiveGR.setValue('case_number', caseRecord.getValue('number'));
      archiveGR.setValue('customer', caseRecord.getValue('customer'));
      archiveGR.setValue('priority', caseRecord.getValue('priority'));
      archiveGR.setValue('resolution_code', caseRecord.getValue('resolution_code'));
      archiveGR.setValue('resolution_notes', caseRecord.getValue('resolution_notes'));
      archiveGR.setValue('opened_at', caseRecord.getValue('opened_at'));
      archiveGR.setValue('closed_at', caseRecord.getValue('closed_at'));
      archiveGR.setValue('archived_at', new GlideDateTime().toString());
      archiveGR.insert();
    } catch (e) {
      gs.error('Error archiving case data: ' + e);
    }
  }
  
  /**
   * Generate closure report
   */
  private static generateClosureReport(caseRecord: GlideRecord): void {
    try {
      const reportGR = new GlideRecord('x_20261805_csm_closure_report');
      reportGR.setValue('case_id', caseRecord.getValue('sys_id'));
      reportGR.setValue('customer', caseRecord.getValue('customer'));
      reportGR.setValue('days_to_resolution', this.calculateDaysToResolution(caseRecord));
      reportGR.setValue('reopened_count', caseRecord.getValue('reopened_count'));
      reportGR.setValue('sla_met', caseRecord.getValue('sla_status') === 'success');
      reportGR.setValue('closed_at', new GlideDateTime().toString());
      reportGR.insert();
    } catch (e) {
      gs.error('Error generating closure report: ' + e);
    }
  }
  
  /**
   * Notify assignment group of case reopening
   */
  private static notifyGroupOfReopening(caseRecord: GlideRecord): void {
    try {
      const groupId = caseRecord.getValue('assignment_group');
      const groupGR = new GlideRecord('sys_user_group');
      if (!groupGR.get(groupId)) {
        return;
      }
      
      const subject = `ALERT: Case ${caseRecord.getValue('number')} Has Been Reopened`;
      const body = `
A previously closed case has been reopened and requires attention:

Case: ${caseRecord.getValue('number')}
Customer: ${caseRecord.getValue('customer.name')}
Reopen Reason: ${caseRecord.getValue('reopened_reason')}

Please log into ServiceNow to review this case.
      `;
      
      const members = groupGR.getMembers();
      for (let i = 0; i < members.length; i++) {
        const memberGR = new GlideRecord('sys_user');
        if (memberGR.get(members[i])) {
          const mail = new GlideEmailMessage();
          mail.setSubject(subject);
          mail.setBody(body);
          mail.addRecipient(memberGR.getValue('email'));
          mail.send();
        }
      }
    } catch (e) {
      gs.error('Error notifying group of reopening: ' + e);
    }
  }
  
  /**
   * Calculate days to resolution
   */
  private static calculateDaysToResolution(caseRecord: GlideRecord): number {
    const createdTime = new GlideDateTime(caseRecord.getValue('sys_created_on'));
    const resolvedTime = new GlideDateTime(caseRecord.getValue('resolved_at'));
    const diffMs = resolvedTime.getNumericValue() - createdTime.getNumericValue();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
}

export default CaseClosureWorkflow;
