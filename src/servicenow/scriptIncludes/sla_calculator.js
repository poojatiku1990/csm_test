/**
 * SLA Calculator Script Include
 * Calculates SLA deadlines for customer cases based on priority and creation date
 * Scope: x_20261805_csm
 */

var x_20261805_csmSLACalculator = Class.create();

x_20261805_csmSLACalculator.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  
  /**
   * Calculate SLA deadline based on case priority
   * Priority 1-2: 2 hours, Priority 3: 4 hours, Priority 4-5: 8 hours
   * 
   * @param {GlideRecord} caseRecord - The customer case record
   * @returns {object} Object containing deadline and SLA hours
   */
  calculateSLADeadline: function(caseRecord) {
    var createdDate = new GlideDateTime(caseRecord.created_date);
    var priority = parseInt(caseRecord.priority);
    var slaHours = 0;
    
    // Determine SLA hours based on priority
    if (priority <= 2) {
      slaHours = 2;
    } else if (priority === 3) {
      slaHours = 4;
    } else if (priority >= 4) {
      slaHours = 8;
    } else {
      slaHours = 24; // Default to 24 hours
    }
    
    // Calculate deadline by adding SLA hours to created date
    var deadline = new GlideDateTime(createdDate);
    deadline.addSeconds(slaHours * 3600);
    
    return {
      deadline: deadline.getDisplayValue(),
      slaHours: slaHours,
      priority: priority,
      createdDate: createdDate.getDisplayValue()
    };
  },
  
  /**
   * Update SLA deadline on a case record
   * 
   * @param {string} caseId - The case sys_id
   * @returns {string} JSON response with success status
   */
  updateCaseSLADeadline: function(caseId) {
    var caseRecord = new GlideRecord('x_20261805_csm_customer_case');
    
    if (!caseRecord.get(caseId)) {
      return JSON.stringify({
        success: false,
        error: 'Case record not found'
      });
    }
    
    try {
      var slaInfo = this.calculateSLADeadline(caseRecord);
      caseRecord.sla_deadline = slaInfo.deadline;
      caseRecord.update();
      
      return JSON.stringify({
        success: true,
        message: 'SLA deadline updated successfully',
        slaInfo: slaInfo
      });
    } catch (e) {
      return JSON.stringify({
        success: false,
        error: 'Error updating SLA deadline: ' + e.message
      });
    }
  },
  
  /**
   * Get SLA status for a case
   * 
   * @param {string} caseId - The case sys_id
   * @returns {string} JSON response with SLA status
   */
  getSLAStatus: function(caseId) {
    var caseRecord = new GlideRecord('x_20261805_csm_customer_case');
    
    if (!caseRecord.get(caseId)) {
      return JSON.stringify({
        success: false,
        error: 'Case record not found'
      });
    }
    
    try {
      var slaInfo = this.calculateSLADeadline(caseRecord);
      var currentTime = new GlideDateTime();
      var deadline = new GlideDateTime(slaInfo.deadline);
      var isOverdue = currentTime > deadline;
      var minutesRemaining = Math.round((deadline - currentTime) / 1000 / 60);
      
      return JSON.stringify({
        success: true,
        caseNumber: caseRecord.case_number,
        slaInfo: slaInfo,
        isOverdue: isOverdue,
        minutesRemaining: minutesRemaining,
        status: isOverdue ? 'OVERDUE' : (minutesRemaining < 60 ? 'CRITICAL' : 'ON_TRACK')
      });
    } catch (e) {
      return JSON.stringify({
        success: false,
        error: 'Error retrieving SLA status: ' + e.message
      });
    }
  },
  
  /**
   * Bulk update SLA deadlines for all active cases
   * 
   * @returns {string} JSON response with bulk update results
   */
  bulkUpdateSLADeadlines: function() {
    var caseQuery = new GlideRecord('x_20261805_csm_customer_case');
    caseQuery.addQuery('state', '!=', 'closed');
    caseQuery.addQuery('sla_deadline', 'EMPTY');
    caseQuery.query();
    
    var updatedCount = 0;
    var errorCount = 0;
    
    while (caseQuery.next()) {
      try {
        var slaInfo = this.calculateSLADeadline(caseQuery);
        caseQuery.sla_deadline = slaInfo.deadline;
        caseQuery.update();
        updatedCount++;
      } catch (e) {
        gs.error('Error updating case ' + caseQuery.case_number + ': ' + e.message);
        errorCount++;
      }
    }
    
    return JSON.stringify({
      success: true,
      message: 'Bulk SLA deadline update completed',
      updated: updatedCount,
      errors: errorCount,
      total: updatedCount + errorCount
    });
  },
  
  type: 'x_20261805_csmSLACalculator'
});
