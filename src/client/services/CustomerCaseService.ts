/**
 * Updated Incident Service for CSM - handles customer case operations
 */

import type { CustomerCase, SLAStatus, UpdateSLAResponse, BulkUpdateResponse } from './CustomerCaseTypes';

export class CustomerCaseService {
  private static readonly TABLE_NAME = 'x_20261805_csm_customer_case';
  private static readonly SLA_CALCULATOR = 'x_20261805_csmSLACalculator';

  /**
   * Fetch all customer cases
   */
  static async getCases(): Promise<CustomerCase[]> {
    try {
      const response = await fetch(`/api/now/table/${this.TABLE_NAME}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cases: ${response.statusText}`);
      }
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  }

  /**
   * Fetch a single customer case by ID
   */
  static async getCaseById(caseId: string): Promise<CustomerCase> {
    try {
      const response = await fetch(`/api/now/table/${this.TABLE_NAME}/${caseId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch case: ${response.statusText}`);
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching case:', error);
      throw error;
    }
  }

  /**
   * Create a new customer case
   */
  static async createCase(caseData: Partial<CustomerCase>): Promise<CustomerCase> {
    try {
      const response = await fetch(`/api/now/table/${this.TABLE_NAME}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(caseData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create case: ${response.statusText}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  }

  /**
   * Update an existing customer case
   */
  static async updateCase(caseId: string, updates: Partial<CustomerCase>): Promise<CustomerCase> {
    try {
      const response = await fetch(`/api/now/table/${this.TABLE_NAME}/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update case: ${response.statusText}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  }

  /**
   * Delete a customer case
   */
  static async deleteCase(caseId: string): Promise<void> {
    try {
      const response = await fetch(`/api/now/table/${this.TABLE_NAME}/${caseId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete case: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    }
  }

  /**
   * Get SLA status for a case
   */
  static async getSLAStatus(caseId: string): Promise<SLAStatus> {
    try {
      const response = await fetch(`/api/now/sp/x_20261805_csm?action=getSLAStatus&caseId=${caseId}`);
      if (!response.ok) {
        throw new Error(`Failed to get SLA status: ${response.statusText}`);
      }
      const data = await response.json();
      return JSON.parse(data.result);
    } catch (error) {
      console.error('Error getting SLA status:', error);
      throw error;
    }
  }

  /**
   * Update SLA deadline for a case
   */
  static async updateSLADeadline(caseId: string): Promise<UpdateSLAResponse> {
    try {
      const response = await fetch(`/api/now/sp/x_20261805_csm?action=updateCaseSLADeadline&caseId=${caseId}`);
      if (!response.ok) {
        throw new Error(`Failed to update SLA deadline: ${response.statusText}`);
      }
      const data = await response.json();
      return JSON.parse(data.result);
    } catch (error) {
      console.error('Error updating SLA deadline:', error);
      throw error;
    }
  }

  /**
   * Bulk update SLA deadlines for all active cases
   */
  static async bulkUpdateSLADeadlines(): Promise<BulkUpdateResponse> {
    try {
      const response = await fetch(`/api/now/sp/x_20261805_csm?action=bulkUpdateSLADeadlines`);
      if (!response.ok) {
        throw new Error(`Failed to bulk update SLA deadlines: ${response.statusText}`);
      }
      const data = await response.json();
      return JSON.parse(data.result);
    } catch (error) {
      console.error('Error bulk updating SLA deadlines:', error);
      throw error;
    }
  }

  /**
   * Search cases by priority
   */
  static async getCasesByPriority(priority: number): Promise<CustomerCase[]> {
    try {
      const response = await fetch(
        `/api/now/table/${this.TABLE_NAME}?sysparm_query=priority=${priority}&sysparm_display_value=true`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch cases by priority: ${response.statusText}`);
      }
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching cases by priority:', error);
      throw error;
    }
  }

  /**
   * Search cases by state
   */
  static async getCasesByState(state: string): Promise<CustomerCase[]> {
    try {
      const response = await fetch(
        `/api/now/table/${this.TABLE_NAME}?sysparm_query=state=${state}&sysparm_display_value=true`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch cases by state: ${response.statusText}`);
      }
      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching cases by state:', error);
      throw error;
    }
  }
}

export default CustomerCaseService;
