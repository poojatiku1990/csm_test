/**
 * Communication Manager
 * Scope: x_20261805_csm
 * 
 * Manages all customer communication, notes, and updates for cases
 */

export interface CommunicationRecord {
  sys_id: string;
  case_id: string;
  communication_type: 'note' | 'comment' | 'email' | 'phone' | 'chat';
  sender_type: 'agent' | 'customer' | 'system';
  sender_name: string;
  sender_email: string;
  content: string;
  visibility: 'internal' | 'customer' | 'both';
  created_at: string;
  created_by: string;
  attachment_ids: string[];
}

export class CommunicationManager {
  /**
   * Add work notes (internal only)
   */
  static addInternalNote(caseId: string, noteContent: string, noteType: string = 'work_note'): string {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return null;
    }
    
    // Append to work notes
    const existingNotes = caseGR.getValue('work_notes');
    const timestamp = new GlideDateTime().toString();
    const userName = gs.getUser().getName();
    
    const newNote = `\n[${timestamp}] ${userName}: ${noteContent}`;
    const updatedNotes = (existingNotes || '') + newNote;
    
    caseGR.setValue('work_notes', updatedNotes);
    caseGR.update();
    
    // Log to communication table
    this.logCommunication({
      caseId: caseId,
      type: noteType,
      content: noteContent,
      visibility: 'internal'
    });
    
    return caseId;
  }
  
  /**
   * Add customer-visible comment
   */
  static addCustomerComment(caseId: string, commentContent: string, isPublic: boolean = true): string {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return null;
    }
    
    // Create comment record
    const commentGR = new GlideRecord('sys_comment');
    commentGR.setValue('table_name', 'x_20261805_csm_customer_case');
    commentGR.setValue('element_id', caseId);
    commentGR.setValue('comments', commentContent);
    commentGR.setValue('element', isPublic ? 'comments' : 'work_notes');
    
    const commentId = commentGR.insert();
    
    // If customer-visible, also update case comments field
    if (isPublic) {
      const existingComments = caseGR.getValue('comments');
      const timestamp = new GlideDateTime().toString();
      const userName = gs.getUser().getName();
      
      const newComment = `\n[${timestamp}] ${userName}: ${commentContent}`;
      const updatedComments = (existingComments || '') + newComment;
      
      caseGR.setValue('comments', updatedComments);
      caseGR.update();
    }
    
    // Log communication
    this.logCommunication({
      caseId: caseId,
      type: 'comment',
      content: commentContent,
      visibility: isPublic ? 'customer' : 'internal'
    });
    
    return commentId;
  }
  
  /**
   * Send email communication to customer
   */
  static sendCustomerEmail(caseId: string, subject: string, body: string, attachmentIds: string[] = []): boolean {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return false;
    }
    
    try {
      const customerEmail = caseGR.getValue('customer_email');
      if (!customerEmail) {
        gs.warn('No customer email found for case ' + caseId);
        return false;
      }
      
      const mail = new GlideEmailMessage();
      mail.setSubject(subject);
      mail.setBody(body);
      mail.addRecipient(customerEmail);
      
      // Add attachments
      for (const attachmentId of attachmentIds) {
        mail.addAttachmentId(attachmentId);
      }
      
      mail.send();
      
      // Log communication
      this.logCommunication({
        caseId: caseId,
        type: 'email',
        content: body,
        visibility: 'customer',
        attachments: attachmentIds
      });
      
      return true;
    } catch (e) {
      gs.error('Error sending customer email for case ' + caseId + ': ' + e);
      return false;
    }
  }
  
  /**
   * Update resolution notes before closure
   */
  static setResolutionNotes(caseId: string, resolutionCode: string, resolutionNotes: string): boolean {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return false;
    }
    
    // Validate resolution code
    const validCodes = ['Resolved', 'Unable to Resolve', 'Duplicate', 'No Further Action', 'Customer Request'];
    if (!validCodes.includes(resolutionCode)) {
      gs.warn('Invalid resolution code: ' + resolutionCode);
      return false;
    }
    
    caseGR.setValue('resolution_code', resolutionCode);
    caseGR.setValue('resolution_notes', resolutionNotes);
    caseGR.setValue('resolved_at', new GlideDateTime().toString());
    caseGR.update();
    
    // Log internal note
    this.addInternalNote(caseId, `Case resolved with code: ${resolutionCode}`, 'resolution');
    
    return true;
  }
  
  /**
   * Request customer feedback/survey
   */
  static requestCustomerFeedback(caseId: string): boolean {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return false;
    }
    
    const customerEmail = caseGR.getValue('customer_email');
    if (!customerEmail) {
      return false;
    }
    
    try {
      const surveyLink = this.generateSurveyLink(caseId);
      const subject = `How did we do? - Feedback for Case ${caseGR.getValue('number')}`;
      const body = `
We appreciate your business! Please take a moment to rate your experience with our support team:

${surveyLink}

Your feedback helps us improve our service.

Thank you!
Support Team
      `;
      
      return this.sendCustomerEmail(caseId, subject, body);
    } catch (e) {
      gs.error('Error requesting customer feedback: ' + e);
      return false;
    }
  }
  
  /**
   * Generate customer survey link
   */
  private static generateSurveyLink(caseId: string): string {
    const instanceUrl = gs.getProperty('glide.servlet.uri');
    const surveyParam = btoa(caseId); // Base64 encode case ID
    return `${instanceUrl}/sp?id=csm_survey&case=${surveyParam}`;
  }
  
  /**
   * Log communication in audit table
   */
  private static logCommunication(data: any): void {
    try {
      const logGR = new GlideRecord('x_20261805_csm_communication_log');
      logGR.setValue('case_id', data.caseId);
      logGR.setValue('communication_type', data.type);
      logGR.setValue('content', data.content);
      logGR.setValue('visibility', data.visibility);
      logGR.setValue('sender_type', 'agent');
      logGR.setValue('sender_name', gs.getUser().getName());
      logGR.setValue('created_at', new GlideDateTime().toString());
      
      if (data.attachments && data.attachments.length > 0) {
        logGR.setValue('attachment_count', data.attachments.length);
      }
      
      logGR.insert();
    } catch (e) {
      gs.error('Error logging communication: ' + e);
    }
  }
  
  /**
   * Get all communications for a case
   */
  static getCommunicationHistory(caseId: string): Array<any> {
    const communications: Array<any> = [];
    
    const logGR = new GlideRecord('x_20261805_csm_communication_log');
    logGR.addQuery('case_id', caseId);
    logGR.orderBy('-created_at');
    logGR.query();
    
    while (logGR.next()) {
      communications.push({
        type: logGR.getValue('communication_type'),
        sender: logGR.getValue('sender_name'),
        content: logGR.getValue('content'),
        timestamp: logGR.getValue('created_at'),
        visibility: logGR.getValue('visibility')
      });
    }
    
    return communications;
  }
  
  /**
   * Generate case summary for customer communication
   */
  static generateCaseSummary(caseId: string): string {
    const caseGR = new GlideRecord('x_20261805_csm_customer_case');
    if (!caseGR.get(caseId)) {
      return '';
    }
    
    const summary = `
Case Number: ${caseGR.getValue('number')}
Customer: ${caseGR.getValue('customer.name')}
Status: ${caseGR.getValue('state')}
Priority: ${caseGR.getValue('priority')}
Opened: ${caseGR.getValue('opened_at')}
Last Updated: ${caseGR.getValue('updated_at')}
Description: ${caseGR.getValue('short_description')}

Resolution Status: ${caseGR.getValue('resolution_code') || 'In Progress'}
    `;
    
    return summary;
  }
}

export default CommunicationManager;
