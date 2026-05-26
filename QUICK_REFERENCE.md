# 🚀 Customer Case Table - Quick Reference

## 📌 Table Information
- **Table Name:** `x_20261805_customer_case`
- **Display Label:** Customer Case
- **Extends:** task
- **Scope:** x_20261805_csm
- **Auto-Number Format:** CSE-XXXXXX (auto-incrementing)
- **Default Form:** Tabbed layout with 3 tabs

## 🔑 Fields at a Glance

| # | Field | Type | Required | Unique | Default | Notes |
|---|-------|------|----------|--------|---------|-------|
| 1 | **number** | String | ✅ | ✅ | Auto | Case ID, read-only |
| 2 | **short_description** | String | ✅ | ❌ | None | 255 chars, case summary |
| 3 | **description** | Text | ❌ | ❌ | None | 8000 chars, details |
| 4 | **priority** | Choice | ✅ | ❌ | High | 1=Critical, 2=High, 3=Medium, 4=Low |
| 5 | **state** | Choice | ✅ | ❌ | New | new, in_progress, resolved, closed |
| 6 | **assigned_to** | Reference | ❌ | ❌ | None | Links to sys_user |
| 7 | **resolution_notes** | Text | ❌ | ❌ | None | 4000 chars, how resolved |

## 📂 Files Created

```
✅ src/servicenow/tables/customer_case/
   ├── table.xml                   [Table schema definition]
   ├── CustomerCaseTable.ts        [TypeScript SDK definition]
   └── CUSTOMER_CASE_TABLE.md      [Detailed documentation]

✅ src/servicenow/dictionaries/
   └── customer_case_dictionary.xml [Dictionary entries]

✅ src/servicenow/forms/
   └── customer_case_form.xml      [Form layout]

✅ manifest.json                   [Updated component registry]

✅ CUSTOMER_CASE_TABLE_SUMMARY.md  [Implementation summary]
```

## 🎨 Form Layout

### Tab 1: Case Information
```
┌─────────────────────────────────┐
│ number                          │ (read-only, auto-generated)
│ short_description               │ (required)
│ state      │ priority           │ (both required)
└─────────────────────────────────┘
```

### Tab 2: Assignment
```
┌─────────────────────────────────┐
│ assigned_to                     │ (optional, references sys_user)
└─────────────────────────────────┘
```

### Tab 3: Details
```
┌─────────────────────────────────┐
│ description                     │ (optional, multiline text)
│ resolution_notes                │ (optional, multiline text)
└─────────────────────────────────┘
```

## 💾 API Examples

### Create a Case
```json
POST /api/now/table/x_20261805_customer_case

{
  "short_description": "Login failed",
  "description": "User cannot access with correct credentials",
  "priority": "2",
  "state": "new",
  "assigned_to": "46d44a23a9fe19810012d9ce917e4537"
}
```

### Query by State
```
GET /api/now/table/x_20261805_customer_case?sysparm_query=state=new&sysparm_limit=10
```

### Query by Priority
```
GET /api/now/table/x_20261805_customer_case?sysparm_query=priority=1
```

### Update Case
```json
PATCH /api/now/table/x_20261805_customer_case/{sys_id}

{
  "state": "in_progress",
  "assigned_to": "user_id"
}
```

## 🔄 Choice Values

### Priority
```
1 = Critical
2 = High (default)
3 = Medium  
4 = Low
```

### State
```
new = New (default)
in_progress = In Progress
resolved = Resolved
closed = Closed
```

## 📊 Workflow Progression
```
new ──→ in_progress ──→ resolved ──→ closed
```

## 🛠️ Deployment

```bash
# Build application
npm run build

# Transform assets
npm run transform

# Deploy to ServiceNow
npm run deploy --profile pdi-profile
```

## ✅ Verification Checklist

- [ ] Table appears in **Tables & Columns > Tables**
- [ ] 7 fields visible in table definition
- [ ] Form layout shows 3 tabs
- [ ] Dictionary entries display correct choices
- [ ] Can create new record via UI
- [ ] number field auto-generates
- [ ] Default values applied correctly
- [ ] Priority choices visible: Critical, High, Medium, Low
- [ ] State choices visible: New, In Progress, Resolved, Closed
- [ ] assigned_to field shows user lookup

## 🔐 Access Control

- **Scope:** x_20261805_csm (isolated)
- **Requires:** User table access for assigned_to lookup
- **Inherits:** Audit fields from task table (created_on, updated_on)

## 📖 Documentation References

1. **CUSTOMER_CASE_TABLE_SUMMARY.md** - Implementation overview
2. **CUSTOMER_CASE_TABLE.md** - Complete field reference
3. **manifest.json** - Component registry
4. This file - Quick reference guide

## 🚀 Next Steps (Optional Enhancements)

1. **Validation** - Add client/server-side validation
2. **Business Rules** - Auto-assignment, state transitions
3. **Workflows** - Automated routing based on priority
4. **Notifications** - Alert users on state changes
5. **Reports** - Dashboards and analytics
6. **Integrations** - Connect with external systems

## 📞 Quick Help

**Q: How do I query for critical cases?**
```
GET /api/now/table/x_20261805_customer_case?sysparm_query=priority=1
```

**Q: How do I find unassigned cases?**
```
GET /api/now/table/x_20261805_customer_case?sysparm_query=assigned_to=EMPTY
```

**Q: What's the default priority?**
```
High (value: 2)
```

**Q: What's the default state?**
```
New
```

**Q: Can I manually set the number field?**
```
No - it's auto-generated and read-only after creation
```

---

**Table Status:** ✅ Ready for Deployment
**Scope:** x_20261805_csm
**Version:** 0.0.1
**Created:** 2026-05-26
