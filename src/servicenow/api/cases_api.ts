/**
 * REST API: Customer Case Management
 * Scope: x_20261805_csm
 * Base Path: /api/now/csm/v1
 * 
 * Provides REST API endpoints for external systems and mobile apps
 * to integrate with the CSM application
 */

export const API_ENDPOINTS = {
  base: '/api/now/csm/v1',
  resources: {
    cases: '/cases',
    caseById: '/cases/{id}',
    caseStatus: '/cases/{id}/status',
    caseNotes: '/cases/{id}/notes',
    caseHistory: '/cases/{id}/history',
    caseSLA: '/cases/{id}/sla',
    assignments: '/assignments',
    search: '/cases/search'
  }
};

/**
 * Get all cases with filters and pagination
 * GET /api/now/csm/v1/cases
 * Query Parameters:
 *   - limit: number (default 10, max 100)
 *   - offset: number (default 0)
 *   - state: string (open, closed, etc.)
 *   - priority: string (1-5)
 *   - customer: string (sys_id)
 *   - assigned_to: string (sys_id)
 */
export class CasesAPI {
  static getAllCases(queryParams: any): any {
    const limit = Math.min(parseInt(queryParams.limit) || 10, 100);
    const offset = parseInt(queryParams.offset) || 0;
    
    const gr = new GlideRecord('x_20261805_csm_customer_case');
    
    // Add filters
    if (queryParams.state) {
      gr.addQuery('state', queryParams.state);
    }
    if (queryParams.priority) {
      gr.addQuery('priority', queryParams.priority);
    }
    if (queryParams.customer) {
      gr.addQuery('customer', queryParams.customer);
    }
    if (queryParams.assigned_to) {
      gr.addQuery('assigned_to', queryParams.assigned_to);
    }
    if (queryParams.search) {
      gr.addQuery('short_description', 'contains', queryParams.search);
    }
    
    // Ordering
    gr.orderBy('-opened_at');
    
    // Set query limits
    gr.setLimit(limit);
    gr.setOffset(offset);
    
    // Get total count
    const totalCount = gr.getRowCount();
    
    gr.query();
    
    const cases: any[] = [];
    while (gr.next()) {
      cases.push(this.formatCaseResponse(gr));
    }
    
    return {
      success: true,
      data: cases,
      pagination: {
        limit: limit,
        offset: offset,
        total: totalCount
      }
    };
  }
  
  /**
   * Get single case by ID
   * GET /api/now/csm/v1/cases/{id}
   */
  static getCaseById(caseId: string): any {
    const gr = new GlideRecord('x_20261805_csm_customer_case');
    if (!gr.get(caseId)) {
      return {
        success: false,
        error: 'Case not found',
        statusCode: 404
      };
    }
    
    return {
      success: true,
      data: this.formatCaseResponse(gr)
    };
  }
  
  /**
   * Create new case
   * POST /api/now/csm/v1/cases
   * Request Body:
   * {
   *   short_description: string,
   *   description: string,
   *   customer: string (sys_id),
   *   customer_contact: string (sys_id),
   *   customer_email: string,
   *   category: string,
   *   priority: string (1-5)
   * }
   */
  static createCase(data: any): any {
    // Validate required fields
    if (!data.short_description || !data.customer || !data.customer_email) {
      return {
        success: false,
        error: 'Missing required fields: short_description, customer, customer_email',
        statusCode: 400
      };
    }
    
    try {
      const gr = new GlideRecord('x_20261805_csm_customer_case');
      gr.setValue('short_description', data.short_description);
      gr.setValue('description', data.description || '');
      gr.setValue('customer', data.customer);
      gr.setValue('customer_contact', data.customer_contact);
      gr.setValue('customer_email', data.customer_email);
      gr.setValue('customer_phone', data.customer_phone || '');
      gr.setValue('category', data.category || 'Other');
      gr.setValue('priority', data.priority || '3');
      gr.setValue('state', 'new');
      
      const caseId = gr.insert();
      
      return {
        success: true,
        data: {
          sys_id: caseId,
          number: gr.getValue('number')
        },
        statusCode: 201
      };
    } catch (e) {
      return {
        success: false,
        error: 'Error creating case: ' + e,
        statusCode: 500
      };
    }
  }
  
  /**
   * Update case status
   * PATCH /api/now/csm/v1/cases/{id}/status
   * Request Body:
   * {
   *   state: string
   * }
   */
  static updateCaseStatus(caseId: string, data: any): any {
    const gr = new GlideRecord('x_20261805_csm_customer_case');
    if (!gr.get(caseId)) {
      return {
        success: false,
        error: 'Case not found',
        statusCode: 404
      };
    }
    
    const validStates = ['new', 'open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed'];
    if (!validStates.includes(data.state)) {
      return {
        success: false,
        error: 'Invalid state: ' + data.state,
        statusCode: 400
      };
    }
    
    gr.setValue('state', data.state);
    if (data.state === 'resolved') {
      gr.setValue('resolved_at', new GlideDateTime().toString());
    }
    if (data.state === 'closed') {
      gr.setValue('closed_at', new GlideDateTime().toString());
    }
    
    gr.update();
    
    return {
      success: true,
      data: { state: data.state }
    };
  }
  
  /**
   * Add note to case
   * POST /api/now/csm/v1/cases/{id}/notes
   */
  static addCaseNote(caseId: string, data: any): any {
    const gr = new GlideRecord('x_20261805_csm_customer_case');
    if (!gr.get(caseId)) {
      return {
        success: false,
        error: 'Case not found',
        statusCode: 404
      };
    }
    
    if (!data.note) {
      return {
        success: false,
        error: 'Note content is required',
        statusCode: 400
      };
    }
    
    const visibility = data.visibility || 'internal';
    if (visibility === 'customer') {
      gr.setValue('comments', (gr.getValue('comments') || '') + '\n' + data.note);
    } else {
      gr.setValue('work_notes', (gr.getValue('work_notes') || '') + '\n' + data.note);
    }
    
    gr.update();
    
    return {
      success: true,
      data: { note_added: true }
    };
  }
  
  /**
   * Get case SLA information
   * GET /api/now/csm/v1/cases/{id}/sla
   */
  static getCaseSLA(caseId: string): any {
    const gr = new GlideRecord('x_20261805_csm_customer_case');
    if (!gr.get(caseId)) {
      return {
        success: false,
        error: 'Case not found',
        statusCode: 404
      };
    }
    
    const slaPolicy = gr.getValue('sla_policy');
    if (!slaPolicy) {
      return {
        success: true,
        data: {
          sla_policy: null,
          status: 'no_sla_assigned'
        }
      };
    }
    
    const slaGR = new GlideRecord('sla');
    slaGR.get(slaPolicy);
    
    return {
      success: true,
      data: {
        sla_policy: slaGR.getValue('name'),
        resolution_time: slaGR.getValue('duration') + ' minutes',
        status: gr.getValue('sla_status'),
        created_at: gr.getValue('sys_created_on')
      }
    };
  }
  
  /**
   * Get case update history
   * GET /api/now/csm/v1/cases/{id}/history
   */
  static getCaseHistory(caseId: string): any {
    const history: any[] = [];
    
    // Get audit records
    const auditGR = new GlideRecord('sys_audit');
    auditGR.addQuery('tablename', 'x_20261805_csm_customer_case');
    auditGR.addQuery('documentkey', caseId);
    auditGR.orderBy('-sys_created_on');
    auditGR.query();
    
    while (auditGR.next()) {
      history.push({
        change_type: auditGR.getValue('fieldname'),
        old_value: auditGR.getValue('oldvalue'),
        new_value: auditGR.getValue('newvalue'),
        changed_by: auditGR.getValue('user'),
        changed_at: auditGR.getValue('sys_created_on')
      });
    }
    
    return {
      success: true,
      data: history
    };
  }
  
  /**
   * Format case record for API response
   */
  private static formatCaseResponse(gr: GlideRecord): any {
    return {
      sys_id: gr.getValue('sys_id'),
      number: gr.getValue('number'),
      short_description: gr.getValue('short_description'),
      description: gr.getValue('description'),
      customer: gr.getValue('customer.name'),
      customer_id: gr.getValue('customer'),
      priority: gr.getValue('priority'),
      state: gr.getValue('state'),
      assigned_to: gr.getValue('assigned_to.name'),
      assignment_group: gr.getValue('assignment_group.name'),
      opened_at: gr.getValue('opened_at'),
      updated_at: gr.getValue('updated_at'),
      resolved_at: gr.getValue('resolved_at'),
      resolution_code: gr.getValue('resolution_code'),
      sla_status: gr.getValue('sla_status')
    };
  }
}

/**
 * Search API
 * GET /api/now/csm/v1/cases/search
 */
export class CaseSearchAPI {
  static search(queryParams: any): any {
    const query = queryParams.q || '';
    if (!query || query.length < 3) {
      return {
        success: false,
        error: 'Search query must be at least 3 characters',
        statusCode: 400
      };
    }
    
    const gr = new GlideRecord('x_20261805_csm_customer_case');
    gr.addQuery('short_description', 'contains', query);
    gr.orQuery('description', 'contains', query);
    gr.orQuery('number', 'contains', query);
    gr.orderBy('-opened_at');
    gr.setLimit(50);
    gr.query();
    
    const results: any[] = [];
    while (gr.next()) {
      results.push({
        sys_id: gr.getValue('sys_id'),
        number: gr.getValue('number'),
        short_description: gr.getValue('short_description'),
        priority: gr.getValue('priority'),
        state: gr.getValue('state')
      });
    }
    
    return {
      success: true,
      data: results,
      count: results.length
    };
  }
}
