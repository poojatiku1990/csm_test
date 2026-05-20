# CSM Test - Customer Service Management Application

## Overview
This is a comprehensive Customer Service Management (CSM) scoped application built on the ServiceNow platform. It provides tools for managing customer support cases with advanced features including auto-assignment, priority validation, automated routing, and SLA tracking.

## Project Structure

```
src/
├── client/
│   ├── app.tsx              # Main React application component
│   ├── main.tsx             # Application entry point
│   ├── services/
│   │   ├── IncidentService.ts
│   │   ├── CustomerCaseService.ts   # CSM case management service
│   │   └── CustomerCaseTypes.ts     # TypeScript interfaces
│   └── components/
│       ├── IncidentForm.tsx
│       ├── IncidentList.tsx
│       └── CaseComponents/          # CSM-specific components
├── servicenow/
│   ├── tables/
│   │   └── customer_case_table.xml      # Customer Case table definition
│   ├── businessRules/
│   │   └── auto_assign_case.xml         # Auto-assignment business rule
│   ├── clientScripts/
│   │   ├── validate_priority.xml        # Priority onChange validation
│   │   └── validate_priority_on_submit.xml # Priority onSubmit validation
│   ├── flows/
│   │   └── route_high_priority.xml      # High-priority case routing flow
│   └── scriptIncludes/
│       └── sla_calculator.js            # SLA calculation script include
└── fluent/
    └── generated/
        └── keys.ts
```

## Core Components

### 1. Customer Case Table
**File:** `src/servicenow/tables/customer_case_table.xml`

The central data model for the CSM application with the following fields:
- **case_number** (String, Unique): Unique identifier for each case
- **short_description** (String): Brief summary of the case
- **priority** (Integer): Priority level 1-5 (1=Critical, 5=Minimal)
- **state** (String): Case status (open, in_progress, waiting_on_customer, resolved, closed)
- **assigned_to** (Reference): ServiceNow user assigned to handle the case
- **sla_deadline** (DateTime): Calculated deadline for case resolution
- **created_date** (DateTime): Case creation timestamp

### 2. Business Rule - Auto-Assignment
**File:** `src/servicenow/businessRules/auto_assign_case.xml`

**Trigger:** Before insert/update on Customer Case table
**Condition:** `assigned_to` is empty

**Functionality:**
- Automatically assigns a new case to the current user if no assignment is made
- Logs the assignment action in the system
- Ensures no case remains unassigned

### 3. Client Scripts - Priority Validation
**Files:**
- `src/servicenow/clientScripts/validate_priority.xml` (onChange)
- `src/servicenow/clientScripts/validate_priority_on_submit.xml` (onSubmit)

**Validation Rules:**
- Priority must be an integer between 1 and 5
- Validates on field change and form submission
- Displays error messages for invalid values
- Prevents submission of invalid priority values

### 4. Flow - High-Priority Case Routing
**File:** `src/servicenow/flows/route_high_priority.xml`

**Trigger:** On insert/update
**Condition:** Priority >= 4

**Actions:**
- Sets case state to "in_progress"
- Routes case to high-priority support queue
- Sends notification to high-priority support group
- Logs the routing activity

### 5. Script Include - SLA Calculator
**File:** `src/servicenow/scriptIncludes/sla_calculator.js`

**Class:** `x_20261805_csmSLACalculator`

**Methods:**

#### `calculateSLADeadline(caseRecord)`
Calculates the SLA deadline based on case priority:
- Priority 1-2: 2-hour SLA
- Priority 3: 4-hour SLA
- Priority 4-5: 8-hour SLA

**Returns:** Object with deadline, slaHours, priority, and createdDate

#### `updateCaseSLADeadline(caseId)`
Updates the SLA deadline field on a specific case record

**Returns:** JSON response with success status and SLA info

#### `getSLAStatus(caseId)`
Retrieves current SLA status for a case:
- Calculates remaining time
- Determines if SLA is overdue
- Returns status: ON_TRACK, CRITICAL, or OVERDUE

#### `bulkUpdateSLADeadlines()`
Batch updates SLA deadlines for all active cases without existing SLA deadlines

**Returns:** JSON response with update statistics

### 6. TypeScript Interfaces
**File:** `src/client/services/CustomerCaseTypes.ts`

Defines TypeScript interfaces for type safety:
- `CustomerCase`: Main case data model
- `SLAInfo`: SLA calculation results
- `SLAStatus`: Current SLA status
- `UpdateSLAResponse`: SLA update response
- `BulkUpdateResponse`: Bulk operation response
- Constants for priority levels and case states

### 7. Customer Case Service
**File:** `src/client/services/CustomerCaseService.ts`

TypeScript service class for case operations:
- `getCases()`: Fetch all cases
- `getCaseById(caseId)`: Get a specific case
- `createCase(caseData)`: Create new case
- `updateCase(caseId, updates)`: Update case
- `deleteCase(caseId)`: Delete case
- `getSLAStatus(caseId)`: Get SLA status
- `updateSLADeadline(caseId)`: Update SLA deadline
- `bulkUpdateSLADeadlines()`: Bulk update SLAs
- `getCasesByPriority(priority)`: Filter by priority
- `getCasesByState(state)`: Filter by state

## Manifest
**File:** `manifest.json`

Application metadata:
- **Name:** csm_test
- **Scope:** x_20261805_csm
- **Version:** 0.0.1
- **Components:** Lists all tables, business rules, client scripts, flows, and script includes

## Configuration

### SLA Priority Configuration
Update SLA hours by modifying the script include `calculateSLADeadline` method:
```javascript
if (priority <= 2) {
  slaHours = 2;      // Critical/High
} else if (priority === 3) {
  slaHours = 4;      // Medium
} else if (priority >= 4) {
  slaHours = 8;      // Low/Minimal
}
```

### High-Priority Queue Threshold
Modify the flow condition to change the high-priority threshold:
```xml
<condition>priority >= 4</condition>  <!-- Change 4 to desired threshold -->
</condition>
```

## Usage Examples

### Creating a Case
```typescript
import CustomerCaseService from './services/CustomerCaseService';

const newCase = await CustomerCaseService.createCase({
  case_number: 'CSE-001',
  short_description: 'Customer login issue',
  priority: 2,
  state: 'open'
  // assigned_to will be auto-assigned by business rule
});
```

### Checking SLA Status
```typescript
const slaStatus = await CustomerCaseService.getSLAStatus(caseId);
if (slaStatus.isOverdue) {
  console.log('SLA OVERDUE:', slaStatus.minutesRemaining, 'minutes late');
}
```

### Updating Case Priority
```typescript
await CustomerCaseService.updateCase(caseId, {
  priority: 4,
  state: 'in_progress'
  // Flow will automatically route to high-priority queue
});
```

## Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to ServiceNow:**
   ```bash
   npm run deploy
   ```

3. **Transform application files:**
   ```bash
   npm run transform
   ```

4. **Generate TypeScript definitions:**
   ```bash
   npm run types
   ```

## Development

Start the development server:
```bash
npm run dev
```

## Key Features

✅ **Auto-Assignment** - Cases automatically assigned to current user if not assigned
✅ **Priority Validation** - Enforces priority values between 1-5
✅ **Intelligent Routing** - High-priority cases (4+) automatically routed to support queue
✅ **SLA Management** - Automatic SLA deadline calculation based on priority
✅ **Type Safety** - Full TypeScript support with interfaces
✅ **Scoped Application** - Isolated scope `x_20261805_csm` for clean separation

## API Integration

The CSM application integrates with ServiceNow APIs:
- **Table API:** `/api/now/table/x_20261805_csm_customer_case`
- **Script Include:** `x_20261805_csmSLACalculator`
- **Processor:** `/api/now/sp/x_20261805_csm`

## Support

For issues or questions about the CSM application, refer to the individual component files or contact the development team.
