# CSM Application - Fix Guide for Code Review Issues

**Status**: 🔴 CRITICAL FIXES REQUIRED  
**Target**: Production-ready deployment  
**Date**: May 26, 2026

---

## QUICK FIX CHECKLIST

- [ ] **FIX 1**: Rename `case_number` to `number` in XML
- [ ] **FIX 2**: Add 8 missing fields to table schema
- [ ] **FIX 3**: Verify case_category table exists
- [ ] **FIX 4**: Update manifest.json with all components
- [ ] **FIX 5**: Fix business rule execution order numbers
- [ ] **FIX 6**: Add null checks to business rules
- [ ] **FIX 7**: Fix priority threshold configuration
- [ ] **FIX 8**: Standardize field names (sla_deadline/sla_due_date)

---

## FIX 1: Rename `case_number` to `number`

**File**: `src/servicenow/tables/customer_case_table.xml`

### Current (❌ WRONG):
```xml
<field>
  <name>case_number</name>
  <type>string</type>
  <label>Case Number</label>
  <length>40</length>
  <max_length>40</max_length>
  <mandatory>true</mandatory>
  <unique>true</unique>
  <read_only>false</read_only>
  <display>true</display>
</field>
```

### Fixed (✅ CORRECT):
```xml
<field>
  <name>number</name>
  <type>string</type>
  <label>Case Number</label>
  <length>40</length>
  <max_length>40</max_length>
  <mandatory>true</mandatory>
  <unique>true</unique>
  <read_only>true</read_only>
  <display>true</display>
</field>
```

**Changes**:
- `case_number` → `number`
- `read_only` → changed to `true` (should be read-only since auto-generated)

---

## FIX 2: Add Missing Fields to Table Schema

**File**: `src/servicenow/tables/customer_case_table.xml`

Add these 8 fields to the table definition (after existing fields):

```xml
<!-- MISSING FIELD 1: resolution_code -->
<field>
  <name>resolution_code</name>
  <type>reference</type>
  <label>Resolution Code</label>
  <reference_table>x_20261805_csm_resolution_code</reference_table>
  <mandatory>false</mandatory>
  <read_only>false</read_only>
  <display>true</display>
  <comment>Code indicating how case was resolved</comment>
</field>

<!-- MISSING FIELD 2: resolution_notes -->
<field>
  <name>resolution_notes</name>
  <type>text</type>
  <label>Resolution Notes</label>
  <mandatory>false</mandatory>
  <read_only>false</read_only>
  <display>true</display>
  <comment>Detailed notes about resolution provided to customer</comment>
</field>

<!-- MISSING FIELD 3: closure_code -->
<field>
  <name>closure_code</name>
  <type>reference</type>
  <label>Closure Code</label>
  <reference_table>x_20261805_csm_closure_code</reference_table>
  <mandatory>false</mandatory>
  <read_only>false</read_only>
  <display>true</display>
  <comment>Code indicating reason for case closure</comment>
</field>

<!-- MISSING FIELD 4: customer_satisfaction -->
<field>
  <name>customer_satisfaction</name>
  <type>integer</type>
  <label>Customer Satisfaction</label>
  <max_value>5</max_value>
  <min_value>1</min_value>
  <mandatory>false</mandatory>
  <read_only>false</read_only>
  <display>true</display>
  <comment>Customer satisfaction rating (1-5 stars)</comment>
</field>

<!-- MISSING FIELD 5: resolved_at -->
<field>
  <name>resolved_at</name>
  <type>glide_date_time</type>
  <label>Resolved At</label>
  <mandatory>false</mandatory>
  <read_only>true</read_only>
  <display>true</display>
  <comment>Timestamp when case was marked as resolved</comment>
</field>

<!-- MISSING FIELD 6: closed_at -->
<field>
  <name>closed_at</name>
  <type>glide_date_time</type>
  <label>Closed At</label>
  <mandatory>false</mandatory>
  <read_only>true</read_only>
  <display>true</display>
  <comment>Timestamp when case was closed</comment>
</field>

<!-- MISSING FIELD 7: is_escalated -->
<field>
  <name>is_escalated</name>
  <type>boolean</type>
  <label>Is Escalated</label>
  <default_value>false</default_value>
  <mandatory>false</mandatory>
  <read_only>false</read_only>
  <display>true</display>
  <comment>Flag indicating if case has been escalated</comment>
</field>

<!-- MISSING FIELD 8: escalation_reason -->
<field>
  <name>escalation_reason</name>
  <type>text</type>
  <label>Escalation Reason</label>
  <mandatory>false</mandatory>
  <read_only>false</read_only>
  <display>true</display>
  <comment>Reason for escalation provided by agent</comment>
</field>
```

---

## FIX 3: Verify Case Category Table

**File**: `src/servicenow/tables/csm_table_definitions.ts`

### Check if defined:
Search for: `CASE_CATEGORY_TABLE` or `x_20261805_csm_case_category`

### If NOT found, create it:

Add this table definition:

```typescript
// ============================================================
// TABLE: CASE CATEGORY TABLE
// ============================================================

export const CASE_CATEGORY_TABLE = {
  name: 'Case Category',
  tableName: 'x_20261805_csm_case_category',
  label: 'Case Category',
  plural: 'Case Categories',
  description: 'Categories for routing and classification of customer cases',
  
  fields: [
    {
      name: 'name',
      type: 'string',
      label: 'Name',
      mandatory: true,
      maxLength: 100,
      unique: true,
      displayField: true,
      example: 'Technical Support',
      description: 'Category name for case classification'
    },
    {
      name: 'assignment_group',
      type: 'reference',
      reference: 'sys_user_group',
      label: 'Assignment Group',
      mandatory: true,
      description: 'Default group for cases in this category'
    },
    {
      name: 'senior_support_group',
      type: 'reference',
      reference: 'sys_user_group',
      label: 'Senior Support Group',
      mandatory: false,
      description: 'Senior support team for critical cases'
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      mandatory: false,
      example: 'Technical issues and troubleshooting',
      description: 'Category description for internal use'
    },
    {
      name: 'active',
      type: 'boolean',
      label: 'Active',
      defaultValue: true,
      mandatory: false,
      description: 'Whether this category is actively used'
    }
  ]
};
```

### Also create XML file:
Create: `src/servicenow/tables/case_category_table.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<table_definition>
  <name>x_20261805_csm_case_category</name>
  <label>Case Category</label>
  <description>Categories for routing and classification of customer cases</description>
  <scope>x_20261805_csm</scope>
  
  <field>
    <name>name</name>
    <type>string</type>
    <label>Name</label>
    <length>100</length>
    <mandatory>true</mandatory>
    <unique>true</unique>
    <display>true</display>
  </field>
  
  <field>
    <name>assignment_group</name>
    <type>reference</type>
    <label>Assignment Group</label>
    <reference_table>sys_user_group</reference_table>
    <mandatory>true</mandatory>
  </field>
  
  <field>
    <name>senior_support_group</name>
    <type>reference</type>
    <label>Senior Support Group</label>
    <reference_table>sys_user_group</reference_table>
    <mandatory>false</mandatory>
  </field>
  
  <field>
    <name>description</name>
    <type>text</type>
    <label>Description</label>
    <mandatory>false</mandatory>
  </field>
  
  <field>
    <name>active</name>
    <type>boolean</type>
    <label>Active</label>
    <default_value>true</default_value>
  </field>
</table_definition>
```

---

## FIX 4: Update manifest.json

**File**: `manifest.json`

### Current (❌ INCOMPLETE):
```json
{
  "components": {
    "tables": [
      "x_20261805_csm_customer_case"
    ],
    "businessRules": [
      "x_20261805_csm_auto_assign_case"
    ],
    "clientScripts": [
      "x_20261805_csm_validate_priority"
    ]
  }
}
```

### Fixed (✅ COMPLETE):
```json
{
  "name": "csm_test",
  "scope": "x_20261805_csm",
  "version": "0.0.1",
  "description": "Customer Service Management application",
  "author": "CSM Team",
  "license": "UNLICENSED",
  
  "components": {
    "tables": [
      "x_20261805_csm_customer_case",
      "x_20261805_csm_customer_account",
      "x_20261805_csm_customer_contact",
      "x_20261805_csm_case_category",
      "x_20261805_csm_communication",
      "x_20261805_csm_sla_policy",
      "x_20261805_csm_knowledge_article"
    ],
    
    "businessRules": [
      "x_20261805_csm_auto_generate_case_number",
      "x_20261805_csm_set_default_state",
      "x_20261805_csm_calculate_priority",
      "x_20261805_csm_auto_assign_case",
      "x_20261805_csm_require_resolution_notes",
      "x_20261805_csm_set_resolved_date",
      "x_20261805_csm_prevent_closure_without_validation"
    ],
    
    "clientScripts": [
      "x_20261805_csm_form_on_load",
      "x_20261805_csm_state_change",
      "x_20261805_csm_priority_change",
      "x_20261805_csm_account_change",
      "x_20261805_csm_resolution_notes_change"
    ],
    
    "uiPolicies": [
      "x_20261805_csm_resolution_fields",
      "x_20261805_csm_mandatory_resolution_notes",
      "x_20261805_csm_hide_closure_code",
      "x_20261805_csm_show_account_info",
      "x_20261805_csm_validate_priority"
    ],
    
    "roles": [
      "x_20261805_csm.csm_agent",
      "x_20261805_csm.csm_manager",
      "x_20261805_csm.csm_admin",
      "x_20261805_csm.customer_user"
    ]
  }
}
```

---

## FIX 5: Fix Business Rule Order Numbers

**File**: `src/servicenow/businessRules/customer_case_business_rules.ts`

### Current execution orders:
```typescript
Rule 1 (Auto-generate): order: 100
Rule 2 (Default state): order: 110
Rule 3 (Priority): order: 120
Rule 4 (Auto-assign): order: 130
Rule 5 (Resolution): order: 140
Rule 6 (Resolved date): order: 140  // ❌ DUPLICATE!
Rule 7 (Prevent closure): order: ??
```

### Fixed:
```typescript
// RULE 1: Auto-generate Case Number
trigger: {
  timing: 'before',
  events: ['insert'],
  order: 100
}

// RULE 2: Set Default State
trigger: {
  timing: 'before',
  events: ['insert'],
  order: 110
}

// RULE 3: Calculate Priority
trigger: {
  timing: 'before',
  events: ['insert', 'update'],
  order: 120
}

// RULE 4: Auto-assign Case
trigger: {
  timing: 'before',
  events: ['insert', 'update'],
  order: 130
}

// RULE 5: Require Resolution Notes
trigger: {
  timing: 'before',
  events: ['update'],
  order: 140
}

// RULE 6: Set Resolved Date
trigger: {
  timing: 'before',
  events: ['update'],
  order: 150  // ✅ CHANGED from 140
}

// RULE 7: Prevent Closure Validation
trigger: {
  timing: 'before',
  events: ['update'],
  order: 160  // ✅ ADDED
}
```

---

## FIX 6: Add Null Checks to Business Rules

**File**: `src/servicenow/businessRules/customer_case_business_rules.ts`

### Rule 4 - Auto-assign (Line 250):

#### Current (❌ NO NULL CHECK):
```typescript
var categoryId = current.category.toString();
var priority = current.priority ? parseInt(current.priority) : 3;
```

#### Fixed (✅ WITH NULL CHECK):
```typescript
// Check if category is set
if (!current.category) {
  gs.warn('Category not set for case - skipping auto-assignment');
  return;
}

var categoryId = current.category.toString();
var priority = current.priority ? parseInt(current.priority) : 3;

// Verify category exists in database
var categoryGr = new GlideRecord('x_20261805_csm_case_category');
if (!categoryGr.get(categoryId)) {
  gs.error('Category record not found for ID: ' + categoryId);
  return;
}
```

---

## FIX 7: Fix Priority Threshold Configuration

**File**: `src/servicenow/CSM_CONFIG.ts`

### Current (❌ WRONG):
```typescript
export const FLOW_RULES = {
  highPriorityThreshold: 4,  // ❌ Priority >= 4 means Low/Minimal?
  highPriorityQueue: 'high_priority_support_queue',
  notificationEnabled: true,
  autoStateTransition: 'in_progress'
};
```

### Fixed (✅ CORRECT):
```typescript
export const FLOW_RULES = {
  highPriorityThreshold: 2,  // ✅ Only Priority 1-2 (Critical/High)
  highPriorityQueue: 'high_priority_support_queue',
  notificationEnabled: true,
  autoStateTransition: 'in_progress'
};
```

**Logic**:
- Priority 1 = Critical (urgent)
- Priority 2 = High (urgent)  
- Priority 3-5 = Medium/Low/Minimal (normal flow)

So threshold should be 2 (meaning: if priority <= 2, treat as high priority)

---

## FIX 8: Standardize Field Names

**File**: `src/servicenow/tables/customer_case_table.xml` and `customer_case_fields.ts`

### Issue:
XML uses `sla_deadline` but TypeScript uses `sla_due_date`

### Solution: Use `sla_due_date` everywhere

#### In XML:
```xml
<!-- Current (❌) -->
<name>sla_deadline</name>

<!-- Fixed (✅) -->
<name>sla_due_date</name>
```

#### Verify in TypeScript:
```typescript
// Should be consistent
{ fieldName: 'sla_due_date', ... }
```

---

## ADDITIONAL IMPROVEMENTS

### Improvement 1: Add Error Handling to Client Scripts

**File**: `src/servicenow/clientScripts/customer_case_client_scripts.ts`

### Example fix for displayCustomerContactDetails():

```javascript
function displayCustomerContactDetails() {
  try {
    var accountId = g_form.getValue('customer_account');
    
    if (!accountId || accountId === '') {
      return;  // No account selected
    }
    
    var accountGr = new GlideRecord('x_20261805_csm_customer_account');
    if (!accountGr.get(accountId)) {
      g_form.showFieldMsg('customer_account', 
        'Account not found in system', 'error');
      return;
    }
    
    var accountName = accountGr.name.toString();
    var accountType = accountGr.account_type.toString();
    
    g_form.showFieldMsg('customer_account', 
      'Account: ' + accountName + ' (' + accountType + ')', 'info');
      
  } catch (error) {
    gs.error('Error in displayCustomerContactDetails: ' + error.message);
    g_form.showFieldMsg('customer_account', 
      'Error loading account details', 'error');
  }
}
```

---

## TESTING AFTER FIXES

### 1. Table Creation Test
```bash
# Deploy updated tables
npm run deploy

# Verify in ServiceNow:
# - Navigate to: System Definition > Tables
# - Search for: x_20261805_csm_customer_case
# - Verify all fields exist with correct types
```

### 2. Business Rule Test
```javascript
// Execute in ServiceNow background script console

// Create test case
var gr = new GlideRecord('x_20261805_csm_customer_case');
gr.short_description = 'Test case for validation';
gr.customer_email = 'test@example.com';
gr.insert();

// Verify:
// - Case number auto-generated (CSE-XXXXXXX)
// - State set to 'new'
// - Priority calculated from impact/urgency
gs.log('Case created: ' + gr.number);
```

### 3. Field Reference Test
```javascript
// Verify field values can be read
var gr = new GlideRecord('x_20261805_csm_customer_case');
gr.get('number', 'CSE-1000001');

gs.log('Resolution Notes: ' + gr.resolution_notes);
gs.log('Closure Code: ' + gr.closure_code);
gs.log('Resolved At: ' + gr.resolved_at);
gs.log('Is Escalated: ' + gr.is_escalated);
```

---

## DEPLOYMENT SEQUENCE

1. **Fix all critical issues** (this guide)
2. **Update manifest.json**
3. **Run build**: `npm run build`
4. **Create update set** from ServiceNow
5. **Test in dev environment** (comprehensive testing)
6. **Get sign-off** from stakeholders
7. **Deploy to production** using `npm run deploy`

---

## VERIFICATION CHECKLIST

After applying all fixes:

- [ ] All field names are consistent
- [ ] All referenced fields exist in table schema
- [ ] Business rule order numbers are unique and sequential
- [ ] Null checks added to business rules
- [ ] Case category table exists and is properly referenced
- [ ] Manifest lists all components
- [ ] Priority threshold is set correctly
- [ ] Build completes without errors: `npm run build`
- [ ] Demo data loads successfully
- [ ] All business rules execute without errors
- [ ] Client scripts initialize forms without errors
- [ ] ACLs properly enforce role restrictions

---

**Status After Fixes**: 🟢 READY FOR DEPLOYMENT  
**Estimated Fix Time**: 1-2 hours  
**Estimated Testing Time**: 2-4 hours

