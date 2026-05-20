/**
 * Customer Case Service TypeScript Interface
 * Defines types for the CSM application
 */

export interface CustomerCase {
  sys_id: string;
  case_number: string;
  short_description: string;
  priority: number;
  state: 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed';
  assigned_to: string;
  assigned_to_name?: string;
  sla_deadline?: string;
  created_date: string;
}

export interface SLAInfo {
  deadline: string;
  slaHours: number;
  priority: number;
  createdDate: string;
}

export interface SLAStatus {
  success: boolean;
  caseNumber: string;
  slaInfo: SLAInfo;
  isOverdue: boolean;
  minutesRemaining: number;
  status: 'ON_TRACK' | 'CRITICAL' | 'OVERDUE';
  error?: string;
}

export interface UpdateSLAResponse {
  success: boolean;
  message?: string;
  slaInfo?: SLAInfo;
  error?: string;
}

export interface BulkUpdateResponse {
  success: boolean;
  message: string;
  updated: number;
  errors: number;
  total: number;
}

export const PRIORITY_LEVELS = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  MINIMAL: 5
} as const;

export const CASE_STATES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  WAITING: 'waiting_on_customer',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const;

export const SLA_HOURS_BY_PRIORITY: Record<number, number> = {
  1: 2,
  2: 2,
  3: 4,
  4: 8,
  5: 8
};
