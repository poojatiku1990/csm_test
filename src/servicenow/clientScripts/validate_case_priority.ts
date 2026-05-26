/**
 * Client Script: Validate Case Priority
 * Scope: x_20261805_csm
 * Table: x_20261805_csm_customer_case
 * Events: onLoad, onChange (priority field)
 * 
 * Provides client-side validation for case priority assignment
 * and displays relevant SLA information
 */

declare var g_form: GlideForm;

export class CaseValidation {
  /**
   * Run on form load to validate and display SLA information
   */
  static onLoad(): void {
    const priorityField = g_form.getValue('priority');
    if (priorityField) {
      this.displaySLAInfo(priorityField);
      this.validatePriorityAssignment();
    }
  }
  
  /**
   * Validate priority change when user modifies the field
   */
  static onPriorityChange(): void {
    const priority = g_form.getValue('priority');
    
    // Validate priority is within acceptable range
    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum) || priorityNum < 1 || priorityNum > 5) {
      g_form.setFieldValue('priority', '3'); // Reset to Medium
      alert('Priority must be between 1 (Critical) and 5 (Minimal)');
      return;
    }
    
    // Display SLA information for selected priority
    this.displaySLAInfo(priority);
    
    // Show escalation warning for critical cases
    if (priorityNum <= 2) {
      this.showCriticalWarning(priority);
    } else {
      this.hideCriticalWarning();
    }
    
    // Auto-set urgency and impact based on priority
    this.autoSetUrgencyAndImpact(priorityNum);
  }
  
  /**
   * Display SLA information based on priority
   */
  private static displaySLAInfo(priority: string): void {
    const slaConfig = this.getSLAConfig(priority);
    
    if (!slaConfig) {
      return;
    }
    
    // Create or update SLA info section
    const htmlContent = `
      <div style="background-color: #e8f4f8; border-left: 4px solid #0066cc; padding: 10px; margin: 10px 0; border-radius: 4px;">
        <strong>SLA Information</strong><br>
        <span style="font-size: 12px;">
          <strong>Priority:</strong> ${slaConfig.name}<br>
          <strong>Resolution Time:</strong> ${slaConfig.resolutionTime}<br>
          <strong>Response Time:</strong> ${slaConfig.responseTime}<br>
          <strong>Status:</strong> <span style="color: ${slaConfig.statusColor};">${slaConfig.status}</span>
        </span>
      </div>
    `;
    
    // Append to form header
    const infoDiv = document.getElementById('sla-info-container');
    if (infoDiv) {
      infoDiv.innerHTML = htmlContent;
    }
  }
  
  /**
   * Validate that only authorized roles can set critical priority
   */
  private static validatePriorityAssignment(): void {
    const priority = g_form.getValue('priority');
    const userRole = g_user.getRole();
    
    // Check if user is trying to set critical priority without authorization
    if (priority === '1' || priority === '2') {
      const authorizedRoles = ['csm_admin', 'csm_manager', 'csm_team_lead'];
      
      if (!this.userHasRole(authorizedRoles)) {
        g_form.setFieldValue('priority', '3'); // Reset to Medium
        g_form.setFieldReadOnly('priority', true);
        alert('You do not have permission to assign Critical or High priority cases.');
      }
    }
  }
  
  /**
   * Show warning for critical priority cases
   */
  private static showCriticalWarning(priority: string): void {
    const warningDiv = document.getElementById('priority-warning');
    if (!warningDiv) {
      const container = document.createElement('div');
      container.id = 'priority-warning';
      container.style.backgroundColor = '#fff3cd';
      container.style.color = '#856404';
      container.style.padding = '10px';
      container.style.marginTop = '10px';
      container.style.borderRadius = '4px';
      container.style.border = '1px solid #ffc107';
      container.innerHTML = `
        <strong>⚠️ Critical Case Alert</strong><br>
        This case has been marked as high priority. 
        Immediate action is required. Please assign to appropriate team immediately.
      `;
      document.querySelector('.form_header')?.appendChild(container);
    }
  }
  
  /**
   * Hide critical warning
   */
  private static hideCriticalWarning(): void {
    const warningDiv = document.getElementById('priority-warning');
    if (warningDiv) {
      warningDiv.remove();
    }
  }
  
  /**
   * Auto-set Urgency and Impact based on Priority
   */
  private static autoSetUrgencyAndImpact(priority: number): void {
    let urgency: string;
    let impact: string;
    
    switch (priority) {
      case 1: // Critical
        urgency = '1';
        impact = '1';
        break;
      case 2: // High
        urgency = '2';
        impact = '2';
        break;
      case 3: // Medium
        urgency = '3';
        impact = '3';
        break;
      case 4: // Low
        urgency = '4';
        impact = '4';
        break;
      case 5: // Minimal
        urgency = '5';
        impact = '5';
        break;
      default:
        urgency = '3';
        impact = '3';
    }
    
    g_form.setFieldValue('urgency', urgency);
    g_form.setFieldValue('impact', impact);
  }
  
  /**
   * Get SLA configuration for priority level
   */
  private static getSLAConfig(priority: string): any {
    const configs: { [key: string]: any } = {
      '1': {
        name: 'Critical',
        resolutionTime: '2 hours',
        responseTime: '15 minutes',
        status: 'Active',
        statusColor: '#d32f2f'
      },
      '2': {
        name: 'High',
        resolutionTime: '4 hours',
        responseTime: '30 minutes',
        status: 'Active',
        statusColor: '#f57c00'
      },
      '3': {
        name: 'Medium',
        resolutionTime: '24 hours',
        responseTime: '2 hours',
        status: 'Active',
        statusColor: '#fbc02d'
      },
      '4': {
        name: 'Low',
        resolutionTime: '48 hours',
        responseTime: '4 hours',
        status: 'Active',
        statusColor: '#388e3c'
      },
      '5': {
        name: 'Minimal',
        resolutionTime: '5 days',
        responseTime: '24 hours',
        status: 'Standard',
        statusColor: '#1976d2'
      }
    };
    
    return configs[priority] || null;
  }
  
  /**
   * Check if user has required role
   */
  private static userHasRole(roles: string[]): boolean {
    for (const role of roles) {
      if (g_user.hasRole(role)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Validate before form submission
   */
  static onSubmit(): boolean {
    // Validate required fields
    const shortDesc = g_form.getValue('short_description');
    if (!shortDesc || shortDesc.trim().length < 10) {
      alert('Description must be at least 10 characters long');
      return false;
    }
    
    const priority = g_form.getValue('priority');
    if (!priority) {
      alert('Priority is required');
      return false;
    }
    
    const customer = g_form.getValue('customer');
    if (!customer) {
      alert('Customer is required');
      return false;
    }
    
    return true;
  }
}

// Attach event handlers
if (typeof window !== 'undefined') {
  // These will be attached through ServiceNow form configuration
  // onLoad: CaseValidation.onLoad()
  // onChange for priority field: CaseValidation.onPriorityChange()
  // onSubmit: CaseValidation.onSubmit()
}
