# Report Validation Checklist Tool

## Overview

Interactive checklist tool for validating reports with test case management, evidence upload, and query comparison capabilities.

## Features

### ✅ Test Case Management
- Add, edit, and delete test cases
- Organize by validation phase (Technical, Functional, Data Integrity, Data Accuracy)
- Track status (Pending, Passed, Failed)

### 📎 Evidence Upload
- Upload images, PDFs, and documents as evidence
- Support for multiple evidence files per test case
- Visual preview for images

### 🔍 Query Management
- Add source queries (Oracle EBS/Fusion Cloud)
- Add target queries (Oracle BI Apps / Data Warehouse)
- Copy queries to clipboard with one click
- Syntax highlighting ready (monospace font)

### 🎯 Sample Test Cases Included

The checklist comes pre-loaded with 10 sample test cases for **"Top 10 Suppliers"** report:

1. **TC-001**: Validate Top 10 Suppliers Ranking Logic
2. **TC-002**: Validate Navigation from Summary to Detail Report
3. **TC-003**: Validate Filter Persistence Across Drill-Down
4. **TC-004**: Validate Total Purchase Amount Aggregation
5. **TC-005**: Validate Data Integrity - Supplier Master Data
6. **TC-006**: Validate Handling of Cancelled Invoices
7. **TC-007**: Validate Multi-Currency Conversion
8. **TC-008**: Validate Date Range Filter Functionality
9. **TC-009**: Validate Report Performance with Large Datasets
10. **TC-010**: Validate Data Accuracy - Transaction Level Comparison

### 📊 Sample Queries

Each test case includes:
- **Source Queries**: Oracle EBS/Fusion Cloud SQL queries
- **Target Queries**: Oracle BI Apps / Data Warehouse SQL queries
- Queries are designed to work with Oracle BI Apps data warehousing standards

### 🔧 Validation Phases

1. **🔧 Technical Validation**
   - Navigation, drill-down, aggregations
   - Performance, filter behavior

2. **🧭 Functional Validation**
   - User experience, measure values
   - Summary vs drill reports

3. **🧱 Data Integrity Validation**
   - Master data validation
   - Join integrity, null handling

4. **🎯 Data Accuracy Validation**
   - Source vs target comparison
   - Transaction-level accuracy
   - Edge cases (cancelled, multi-currency, etc.)

## How to Use

### 1. Open the Checklist
- Open `Validation_Checklist.html` in any modern web browser

### 2. Configure Report Information
- Select reporting tool (Power BI or Oracle Analytics Cloud)
- Set validation date
- Enter validator name

### 3. Add Test Cases
- Click "+ Add New Test Case"
- Fill in test case details:
  - Test Case ID (e.g., TC-001)
  - Title
  - Validation Phase
  - Description
  - Source Query (optional)
  - Target Query (optional)
  - Expected Result
- Click "Add Test Case"

### 4. Upload Evidence
- Click "📎 Upload Evidence" on any test case
- Select images, PDFs, or documents
- Multiple files can be uploaded per test case

### 5. Update Status
- Click status buttons (Pending/Passed/Failed) to update test case status
- Status updates automatically reflect in summary statistics

### 6. Filter and Search
- Use phase filter to show specific validation types
- Use status filter to show pending/passed/failed
- Use search box to find test cases by keyword

### 7. Export Checklist
- Click "📥 Export Checklist" to download as JSON
- Click "🖨️ Print Checklist" to print

## Sample Report: Top 10 Suppliers

The checklist is pre-configured with test cases for a "Top 10 Suppliers" report that:

- Ranks suppliers by total purchase amount
- Works with both Power BI and Oracle Analytics Cloud
- Validates against Oracle EBS/Fusion Cloud source
- Uses Oracle BI Apps as the data warehouse standard

### Key Validation Areas

1. **Ranking Logic**: Ensures correct ordering by purchase amount
2. **Navigation**: Validates drill-through functionality
3. **Aggregations**: Verifies SUM calculations
4. **Data Integrity**: Checks supplier master data
5. **Cancelled Transactions**: Excludes cancelled invoices
6. **Multi-Currency**: Validates currency conversion
7. **Transaction Accuracy**: Compares source vs target at detail level

## Query Examples

### Source Query (Oracle EBS)
```sql
SELECT 
    pv.vendor_id,
    pv.vendor_name,
    SUM(ap.invoice_amount) as total_purchase_amount
FROM 
    ap_suppliers pv
    INNER JOIN ap_invoices_all ap ON pv.vendor_id = ap.vendor_id
WHERE 
    ap.invoice_date BETWEEN :start_date AND :end_date
    AND ap.cancelled_date IS NULL
GROUP BY 
    pv.vendor_id, pv.vendor_name
ORDER BY 
    total_purchase_amount DESC
FETCH FIRST 10 ROWS ONLY;
```

### Target Query (Oracle BI Apps)
```sql
SELECT 
    dim_supplier.supplier_id,
    dim_supplier.supplier_name,
    SUM(fact_ap_invoices.invoice_amount) as total_purchase_amount
FROM 
    w_supplier_d dim_supplier
    INNER JOIN w_ap_invoices_f fact_ap_invoices 
        ON dim_supplier.supplier_wid = fact_ap_invoices.supplier_wid
    INNER JOIN w_time_d time_dim 
        ON fact_ap_invoices.invoice_date_wid = time_dim.time_wid
WHERE 
    time_dim.calendar_date BETWEEN :start_date AND :end_date
    AND fact_ap_invoices.cancelled_flag = 'N'
GROUP BY 
    dim_supplier.supplier_id, dim_supplier.supplier_name
ORDER BY 
    total_purchase_amount DESC
FETCH FIRST 10 ROWS ONLY;
```

## Browser Compatibility

Works best in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Data Storage

- Test cases are stored in browser memory (localStorage can be added)
- Export to JSON for backup and sharing
- No server required - works completely offline

## Customization

You can customize:
- Test cases by editing `checklist-script.js`
- Styles by editing `checklist-styles.css`
- Add more sample test cases
- Modify validation phases
- Add custom fields

## Tips

1. **Use Descriptive IDs**: Follow a pattern like TC-001, TC-002
2. **Include Queries**: Always add source and target queries for accuracy validation
3. **Upload Evidence**: Screenshots and documents help document validation results
4. **Update Status**: Keep status current to track progress
5. **Export Regularly**: Export checklist periodically for backup

Enjoy validating your reports! 🎉

