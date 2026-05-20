# CSM Application Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Customer Service Management (CSM) scoped application to ServiceNow.

## Prerequisites
- ServiceNow instance with administrative access
- ServiceNow SDK installed locally (`@servicenow/sdk`)
- Node.js 18+ and npm installed
- Project repository cloned locally

## Deployment Steps

### Step 1: Prepare Local Environment
```bash
# Install dependencies
npm install

# Verify SDK is properly configured
npm run types
```

### Step 2: Build Application
```bash
# Build the application
npm run build

# This generates optimized bundles in the dist/ directory
```

### Step 3: Transform Application Assets
```bash
# Transform application files for ServiceNow compatibility
npm run transform

# This converts TypeScript and other assets into ServiceNow-compatible formats
```

### Step 4: Deploy to ServiceNow
```bash
# Deploy the application to your ServiceNow instance
npm run deploy

# Follow prompts to:
# - Authenticate with your ServiceNow instance
# - Select the target environment
# - Confirm deployment of scoped app
```

### Step 5: Verify Installation
1. Login to your ServiceNow instance
2. Navigate to **System Applications > Applications > All**
3. Search for **csm_test** or scope **x_20261805_csm**
4. Verify the following components exist:
   - Table: `x_20261805_csm_customer_case`
   - Business Rule: `x_20261805_csm_auto_assign_case`
   - Client Scripts: `x_20261805_csm_validate_priority*`
   - Flow: `x_20261805_csm_route_high_priority`
   - Script Include: `x_20261805_csmSLACalculator`

## Component Installation Details

### 1. Customer Case Table
**Installation:**
- File: `src/servicenow/tables/customer_case_table.xml`
- Action: Table is auto-created from XML definition
- Status Check: Navigate to **Tables & Columns > Tables** and search for `x_20261805_csm_customer_case`

### 2. Business Rule
**Installation:**
- File: `src/servicenow/businessRules/auto_assign_case.xml`
- Table: `x_20261805_csm_customer_case`
- Active: Yes
- Status Check: Navigate to **System Policy > Business Rules**, search for `x_20261805_csm_auto_assign_case`

### 3. Client Scripts
**Installation:**
- Files: `src/servicenow/clientScripts/validate_priority*.xml`
- Table: `x_20261805_csm_customer_case`
- Types: onChange, onSubmit
- Status Check: Navigate to **Client Scripts**, search for `x_20261805_csm_validate_priority`

### 4. Flow
**Installation:**
- File: `src/servicenow/flows/route_high_priority.xml`
- Trigger: on_insert_update
- Condition: priority >= 4
- Status Check: Navigate to **Flows**, search for `x_20261805_csm_route_high_priority`

### 5. Script Include
**Installation:**
- File: `src/servicenow/scriptIncludes/sla_calculator.js`
- Class: `x_20261805_csmSLACalculator`
- Status Check: Navigate to **System Definition > Script Includes**, search for `x_20261805_csmSLACalculator`

## Post-Deployment Configuration

### Configure Queue
1. Navigate to **Service Management > Queues > Queues**
2. Create new queue: **high_priority_support_queue**
3. Assign eligible agents

### Configure Notification Group
1. Navigate to **System Admin > Users & Groups > Groups**
2. Create group: **high_priority_support_group**
3. Add support team members

### Test Auto-Assignment
1. Navigate to **x_20261805_csm_customer_case**
2. Create new case
3. Leave **Assigned To** empty
4. Submit
5. Verify case is auto-assigned to current user

### Test Priority Validation
1. Navigate to **x_20261805_csm_customer_case**
2. Create new case
3. Set Priority to **6** or **0**
4. Attempt to save
5. Verify error message appears: "Priority must be between 1 and 5"

### Test High-Priority Routing
1. Navigate to **x_20261805_csm_customer_case**
2. Create case with Priority **4** or **5**
3. Verify state auto-changes to **in_progress**
4. Check high_priority_support_queue for new case
5. Verify notification sent to high_priority_support_group

### Test SLA Calculation
1. Create case with Priority **1**
2. Note created date/time
3. Use Script Include method: `calculateSLADeadline()`
4. Verify SLA deadline is 2 hours after creation
5. Repeat with Priority 3 (expect 4 hours) and Priority 5 (expect 8 hours)

## Development Mode

### Start Development Server
```bash
npm run dev
```

This will:
- Start a local development environment
- Enable hot module reloading
- Connect to your configured ServiceNow instance
- Allow real-time testing of changes

### Make Changes
1. Edit source files in `src/servicenow/`
2. Changes auto-compile and deploy
3. Refresh your browser to see updates

## Rollback Procedures

### Rollback via ServiceNow
1. Navigate to **System Applications > Check Updates**
2. Find csm_test application
3. Click **Uninstall**
4. Confirm removal

### Rollback via Command Line
```bash
# Using SDK to rollback
npm run deploy -- --rollback

# Manual removal of scope
# Navigate to System Applications > All
# Delete x_20261805_csm scoped application
```

## Troubleshooting

### Components Not Appearing
**Issue:** Business rules, client scripts, or other components not visible
**Solution:**
1. Clear browser cache
2. Refresh ServiceNow instance
3. Verify scope filter shows `x_20261805_csm`
4. Check scope selector in application navigator

### Build Failures
**Issue:** `npm run build` fails with errors
**Solution:**
1. Verify Node.js version: `node -v` (expect v18+)
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npx tsc --noEmit`
4. Review error logs in terminal

### Deploy Authentication Failed
**Issue:** Deploy fails with authentication error
**Solution:**
1. Verify ServiceNow credentials are correct
2. Check instance URL format: `https://instance.service-now.com`
3. Verify user has admin/developer role
4. Re-authenticate: Clear SDK auth cache and retry

### Validation Script Not Triggering
**Issue:** Priority validation doesn't appear when editing
**Solution:**
1. Verify client script is active
2. Verify field name is exactly "priority"
3. Check browser console for JavaScript errors
4. Ensure form is in edit mode (not read-only)

## Performance Considerations

### SLA Calculation
- For bulk updates of 1000+ records, schedule during off-peak hours
- Use `bulkUpdateSLADeadlines()` method for efficiency

### Business Rule Optimization
- Auto-assignment rule is lightweight and suitable for all insert/update operations
- Add additional filters if needed to reduce rule execution

### Client Script Performance
- Priority validation is instant (no server calls)
- Suitable for real-time validation during form interaction

## Security Considerations

1. **Scope Isolation:** All components use scope `x_20261805_csm` for isolation
2. **Role-Based Access:** Assign appropriate roles to users
3. **Data Validation:** All inputs validated on both client and server
4. **Audit Logging:** All case routing actions logged for compliance

## Monitoring

### Monitor Business Rule Execution
Navigate to **System Logs > Business Rule Execution** to review:
- Rule execution times
- Assignment history
- Any errors or warnings

### Monitor Client Script Errors
Check browser console (F12) for:
- Validation errors
- JavaScript exceptions
- API call failures

### Monitor Flow Execution
Navigate to **Flows > Execution** to review:
- High-priority routing triggers
- Queue assignments
- Notification sends

## Support & Contact

For issues or questions:
1. Check CSM_README.md for component documentation
2. Review CSM_CONFIG.ts for configuration options
3. Check Troubleshooting section in this guide
4. Contact application development team
