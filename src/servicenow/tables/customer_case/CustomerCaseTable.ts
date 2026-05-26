/**
 * Customer Case Table - TypeScript SDK Definition
 * Scope: x_20261805_csm
 * Table: x_20261805_customer_case
 */

import { Table, Field, Reference } from '@servicenow/sdk';

/**
 * Customer Case Table Definition for ServiceNow SDK
 * Extends the Task table with case management fields
 */
@Table({
  name: 'x_20261805_customer_case',
  label: 'Customer Case',
  extends: 'task',
  scope: 'x_20261805_csm',
  description: 'Customer Service Management table for tracking and managing customer support cases'
})
export class CustomerCaseTable {
  
  /**
   * Case Number - Unique auto-incrementing identifier
   * @type {string}
   * @unique true
   * @mandatory true
   */
  @Field({
    name: 'number',
    type: 'string',
    label: 'Number',
    length: 40,
    unique: true,
    mandatory: true,
    readOnly: true,
    autoIncrement: true
  })
  number: string;
  
  /**
   * Short Description - Brief summary of the case
   * @type {string}
   * @mandatory true
   * @maxLength 255
   */
  @Field({
    name: 'short_description',
    type: 'string',
    label: 'Short Description',
    length: 255,
    mandatory: true,
    readOnly: false
  })
  shortDescription: string;
  
  /**
   * Description - Detailed case information
   * @type {text}
   * @mandatory false
   * @maxLength 8000
   */
  @Field({
    name: 'description',
    type: 'text',
    label: 'Description',
    length: 8000,
    mandatory: false,
    readOnly: false
  })
  description: string;
  
  /**
   * Priority - Case priority level
   * @type {choice}
   * @mandatory true
   * @default 'high'
   * @choices Critical, High, Medium, Low
   */
  @Field({
    name: 'priority',
    type: 'choice',
    label: 'Priority',
    mandatory: true,
    default: 'high',
    readOnly: false,
    choices: [
      { value: 'critical', label: 'Critical' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ]
  })
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  /**
   * State - Current state of the case
   * @type {choice}
   * @mandatory true
   * @default 'new'
   * @choices New, In Progress, Resolved, Closed
   */
  @Field({
    name: 'state',
    type: 'choice',
    label: 'State',
    mandatory: true,
    default: 'new',
    readOnly: false,
    choices: [
      { value: 'new', label: 'New' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'closed', label: 'Closed' }
    ]
  })
  state: 'new' | 'in_progress' | 'resolved' | 'closed';
  
  /**
   * Assigned To - User assigned to handle the case
   * @type {reference}
   * @reference sys_user
   * @mandatory false
   */
  @Reference({
    name: 'assigned_to',
    label: 'Assigned To',
    referenceTable: 'sys_user',
    mandatory: false,
    readOnly: false
  })
  assignedTo: string;
  
  /**
   * Resolution Notes - Notes on how the case was resolved
   * @type {text}
   * @mandatory false
   * @maxLength 4000
   */
  @Field({
    name: 'resolution_notes',
    type: 'text',
    label: 'Resolution Notes',
    length: 4000,
    mandatory: false,
    readOnly: false
  })
  resolutionNotes: string;
  
}

/**
 * Customer Case Record Type for API operations
 */
export interface ICustomerCase {
  sys_id?: string;
  number?: string;
  short_description: string;
  description?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  state: 'new' | 'in_progress' | 'resolved' | 'closed';
  assigned_to?: string;
  resolution_notes?: string;
  created_on?: string;
  updated_on?: string;
}

/**
 * Form Layout Configuration
 */
export const CUSTOMER_CASE_FORM_CONFIG = {
  sections: [
    {
      name: 'Case Information',
      fields: ['number', 'short_description']
    },
    {
      name: 'Status and Priority',
      fields: ['state', 'priority']
    },
    {
      name: 'Assignment',
      fields: ['assigned_to']
    },
    {
      name: 'Details',
      fields: ['description', 'resolution_notes']
    }
  ],
  tabs: [
    {
      name: 'Case Information',
      sections: ['Case Information', 'Status and Priority']
    },
    {
      name: 'Assignment',
      sections: ['Assignment']
    },
    {
      name: 'Details',
      sections: ['Details']
    }
  ]
};

export default CustomerCaseTable;
