# Changelog - Validation Checklist Updates

## Latest Updates

### ✅ PDF Export Functionality
- Added comprehensive PDF export feature using jsPDF library
- PDF includes:
  - **Cover Page** with report information
  - **Table of Contents** with page numbers
  - **Report Description** section
  - **Each Test Case** with:
    - Test case ID and title
    - Validation phase and status
    - Description
    - Expected result
    - Source query (Oracle EBS/Fusion)
    - Target query (One Lake Warehouse for Power BI or Oracle ADW for OAC)
    - Evidence (images embedded, document names listed)
    - Test result status
  - **Summary Page** with validation statistics

### 🔄 Updated Queries
- **Removed all "BI Apps" references** from queries and UI
- **Power BI**: Target queries now reference **One Lake Warehouse / Lakehouse**
  - Schema: `lakehouse.supplier_dim`, `lakehouse.ap_invoices_fact`, `lakehouse.date_dim`
  - Uses standard SQL syntax with `LIMIT` instead of `FETCH FIRST`
- **Oracle Analytics Cloud**: Target queries now reference **Oracle ADW**
  - Schema: `dw_supplier_dim`, `dw_ap_invoices_fact`, `dw_date_dim`
  - Uses Oracle SQL syntax with `FETCH FIRST`

### 📝 Report Description Feature
- Added report description textarea
- Description is saved to localStorage
- Description is included in PDF export
- Description appears in the PDF after report information

### 🎯 Dynamic Query Display
- Queries automatically update based on selected reporting tool (Power BI or OAC)
- UI labels change dynamically:
  - Power BI: "Target Query (One Lake Warehouse / Lakehouse)"
  - OAC: "Target Query (Oracle ADW)"

### 📊 Enhanced Test Case Structure
- Test cases now support separate queries for Power BI and OAC
- `targetQueryPowerBI` and `targetQueryOAC` properties
- Backward compatible with existing `targetQuery` property

## Sample Test Cases Updated

All 10 sample test cases have been updated with:
1. **TC-001**: Top 10 Suppliers Ranking Logic
2. **TC-002**: Navigation from Summary to Detail
3. **TC-003**: Filter Persistence
4. **TC-004**: Total Purchase Amount Aggregation
5. **TC-005**: Data Integrity - Supplier Master Data
6. **TC-006**: Handling of Cancelled Invoices
7. **TC-007**: Multi-Currency Conversion
8. **TC-008**: Date Range Filter Functionality
9. **TC-009**: Report Performance
10. **TC-010**: Data Accuracy - Transaction Level Comparison

## How to Use PDF Export

1. Fill in test cases with evidence and results
2. Add report description (optional but recommended)
3. Click "📄 Export to PDF" button
4. PDF will be generated and downloaded automatically
5. PDF filename format: `Validation_Checklist_{tool}_{date}.pdf`

## Technical Details

### PDF Generation
- Uses jsPDF library (loaded from CDN)
- Supports multi-page documents
- Automatic page breaks
- Image embedding for evidence
- Color-coded status indicators
- Monospace font for SQL queries

### Query Management
- Queries stored per test case
- Separate storage for Power BI and OAC queries
- Dynamic rendering based on selected tool
- Copy to clipboard functionality maintained

## Files Modified

1. `Validation_Checklist.html` - Added PDF library, report description section
2. `checklist-script.js` - Complete rewrite with PDF export and updated queries
3. `checklist-styles.css` - Added styles for report description section

## Browser Compatibility

PDF export requires:
- Modern browser with JavaScript enabled
- Internet connection for jsPDF CDN (first load)
- Local storage for report description persistence

