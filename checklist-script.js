// Validation Checklist Script - Updated with PDF Export and Updated Queries

let testCases = [];
let testCaseCounter = 1;
let reportDescription = '';

// Helper function to get target query based on reporting tool
function getTargetQuery(testCase) {
    const tool = document.getElementById('reporting-tool').value;
    if (tool === 'powerbi') {
        return testCase.targetQueryPowerBI || testCase.targetQuery || '';
    } else {
        return testCase.targetQueryOAC || testCase.targetQuery || '';
    }
}

// Sample test cases for "Top 10 Suppliers" report
const sampleTestCases = [
    {
        id: 'TC-001',
        title: 'Validate Top 10 Suppliers Ranking Logic',
        phase: 'functional',
        description: 'Verify that the report correctly identifies and ranks the top 10 suppliers based on total purchase amount in descending order.',
        sourceQuery: `-- Oracle EBS Source Query
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
    AND ap.status = 'APPROVED'
GROUP BY 
    pv.vendor_id, pv.vendor_name
ORDER BY 
    total_purchase_amount DESC
FETCH FIRST 10 ROWS ONLY;`,
        targetQueryPowerBI: `-- Power BI - One Lake Warehouse / Lakehouse Query
SELECT 
    supplier_id,
    supplier_name,
    SUM(invoice_amount) as total_purchase_amount
FROM 
    lakehouse.supplier_dim s
    INNER JOIN lakehouse.ap_invoices_fact f ON s.supplier_key = f.supplier_key
    INNER JOIN lakehouse.date_dim d ON f.invoice_date_key = d.date_key
WHERE 
    d.calendar_date BETWEEN :start_date AND :end_date
    AND f.cancelled_flag = 'N'
    AND f.approval_status = 'APPROVED'
GROUP BY 
    supplier_id, supplier_name
ORDER BY 
    total_purchase_amount DESC
LIMIT 10;`,
        targetQueryOAC: `-- Oracle Analytics Cloud - Oracle ADW Query
SELECT 
    dim_supplier.supplier_id,
    dim_supplier.supplier_name,
    SUM(fact_ap_invoices.invoice_amount) as total_purchase_amount
FROM 
    dw_supplier_dim dim_supplier
    INNER JOIN dw_ap_invoices_fact fact_ap_invoices 
        ON dim_supplier.supplier_key = fact_ap_invoices.supplier_key
    INNER JOIN dw_date_dim time_dim 
        ON fact_ap_invoices.invoice_date_key = time_dim.date_key
WHERE 
    time_dim.calendar_date BETWEEN :start_date AND :end_date
    AND fact_ap_invoices.cancelled_flag = 'N'
    AND fact_ap_invoices.approval_status = 'APPROVED'
GROUP BY 
    dim_supplier.supplier_id, dim_supplier.supplier_name
ORDER BY 
    total_purchase_amount DESC
FETCH FIRST 10 ROWS ONLY;`,
        expectedResult: 'Top 10 suppliers should match between source and target, with identical ranking order and amounts.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-002',
        title: 'Validate Navigation from Summary to Detail Report',
        phase: 'technical',
        description: 'Verify that clicking on a supplier in the Top 10 list navigates correctly to the supplier detail report with proper parameter passing.',
        sourceQuery: '',
        targetQueryPowerBI: '',
        targetQueryOAC: '',
        expectedResult: 'Navigation should work seamlessly in both Power BI and OAC. Parameters (supplier_id, date range) should be passed correctly.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-003',
        title: 'Validate Filter Persistence Across Drill-Down',
        phase: 'technical',
        description: 'Ensure that date range and business unit filters persist when drilling down from Top 10 summary to supplier transaction details.',
        sourceQuery: '',
        targetQueryPowerBI: '',
        targetQueryOAC: '',
        expectedResult: 'Filters should maintain their values when navigating between summary and detail reports.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-004',
        title: 'Validate Total Purchase Amount Aggregation',
        phase: 'functional',
        description: 'Verify that the total purchase amount is correctly calculated using SUM aggregation and matches the sum of individual invoice amounts.',
        sourceQuery: `-- Oracle EBS - Individual Invoices
SELECT 
    pv.vendor_id,
    pv.vendor_name,
    ap.invoice_id,
    ap.invoice_amount,
    ap.invoice_date
FROM 
    ap_suppliers pv
    INNER JOIN ap_invoices_all ap ON pv.vendor_id = ap.vendor_id
WHERE 
    ap.invoice_date BETWEEN :start_date AND :end_date
    AND ap.cancelled_date IS NULL
    AND ap.status = 'APPROVED'
    AND pv.vendor_id = :supplier_id
ORDER BY 
    ap.invoice_date DESC;`,
        targetQueryPowerBI: `-- Power BI - One Lake Warehouse - Aggregated Total
SELECT 
    supplier_id,
    supplier_name,
    SUM(invoice_amount) as total_amount
FROM 
    lakehouse.supplier_dim s
    INNER JOIN lakehouse.ap_invoices_fact f ON s.supplier_key = f.supplier_key
    INNER JOIN lakehouse.date_dim d ON f.invoice_date_key = d.date_key
WHERE 
    d.calendar_date BETWEEN :start_date AND :end_date
    AND f.cancelled_flag = 'N'
    AND f.approval_status = 'APPROVED'
    AND supplier_id = :supplier_id
GROUP BY 
    supplier_id, supplier_name;`,
        targetQueryOAC: `-- Oracle Analytics Cloud - Oracle ADW - Aggregated Total
SELECT 
    dim_supplier.supplier_id,
    dim_supplier.supplier_name,
    SUM(fact_ap_invoices.invoice_amount) as total_amount
FROM 
    dw_supplier_dim dim_supplier
    INNER JOIN dw_ap_invoices_fact fact_ap_invoices 
        ON dim_supplier.supplier_key = fact_ap_invoices.supplier_key
    INNER JOIN dw_date_dim time_dim 
        ON fact_ap_invoices.invoice_date_key = time_dim.date_key
WHERE 
    time_dim.calendar_date BETWEEN :start_date AND :end_date
    AND fact_ap_invoices.cancelled_flag = 'N'
    AND fact_ap_invoices.approval_status = 'APPROVED'
    AND dim_supplier.supplier_id = :supplier_id
GROUP BY 
    dim_supplier.supplier_id, dim_supplier.supplier_name;`,
        expectedResult: 'Sum of individual invoices should equal the aggregated total shown in the Top 10 report.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-005',
        title: 'Validate Data Integrity - Supplier Master Data',
        phase: 'integrity',
        description: 'Verify that all suppliers in the Top 10 report exist in the supplier master dimension table and have valid attributes.',
        sourceQuery: `-- Oracle EBS - Supplier Master
SELECT 
    vendor_id,
    vendor_name,
    vendor_type,
    enabled_flag,
    start_date_active,
    end_date_active
FROM 
    ap_suppliers
WHERE 
    vendor_id IN (:supplier_id_list)
    AND enabled_flag = 'Y'
    AND (end_date_active IS NULL OR end_date_active >= SYSDATE);`,
        targetQueryPowerBI: `-- Power BI - One Lake Warehouse - Supplier Dimension
SELECT 
    supplier_id,
    supplier_name,
    supplier_type,
    active_flag,
    effective_start_date,
    effective_end_date
FROM 
    lakehouse.supplier_dim
WHERE 
    supplier_id IN (:supplier_id_list)
    AND active_flag = 'Y'
    AND (effective_end_date IS NULL OR effective_end_date >= CURRENT_DATE)
    AND current_flag = 'Y';`,
        targetQueryOAC: `-- Oracle Analytics Cloud - Oracle ADW - Supplier Dimension
SELECT 
    supplier_id,
    supplier_name,
    supplier_type,
    active_flag,
    effective_start_date,
    effective_end_date
FROM 
    dw_supplier_dim
WHERE 
    supplier_id IN (:supplier_id_list)
    AND active_flag = 'Y'
    AND (effective_end_date IS NULL OR effective_end_date >= SYSDATE)
    AND current_flag = 'Y';`,
        expectedResult: 'All suppliers in Top 10 should have valid master data records with consistent attributes.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-006',
        title: 'Validate Handling of Cancelled Invoices',
        phase: 'accuracy',
        description: 'Verify that cancelled invoices are excluded from the Top 10 calculation in both source and target systems.',
        sourceQuery: `-- Oracle EBS - Including Cancelled
SELECT 
    pv.vendor_id,
    pv.vendor_name,
    COUNT(*) as total_invoices,
    SUM(CASE WHEN ap.cancelled_date IS NULL THEN ap.invoice_amount ELSE 0 END) as active_amount,
    SUM(CASE WHEN ap.cancelled_date IS NOT NULL THEN ap.invoice_amount ELSE 0 END) as cancelled_amount
FROM 
    ap_suppliers pv
    INNER JOIN ap_invoices_all ap ON pv.vendor_id = ap.vendor_id
WHERE 
    ap.invoice_date BETWEEN :start_date AND :end_date
GROUP BY 
    pv.vendor_id, pv.vendor_name;`,
        targetQueryPowerBI: `-- Power BI - One Lake Warehouse - Cancelled Flag Check
SELECT 
    supplier_id,
    supplier_name,
    COUNT(*) as total_invoices,
    SUM(CASE WHEN f.cancelled_flag = 'N' THEN f.invoice_amount ELSE 0 END) as active_amount,
    SUM(CASE WHEN f.cancelled_flag = 'Y' THEN f.invoice_amount ELSE 0 END) as cancelled_amount
FROM 
    lakehouse.supplier_dim s
    INNER JOIN lakehouse.ap_invoices_fact f ON s.supplier_key = f.supplier_key
    INNER JOIN lakehouse.date_dim d ON f.invoice_date_key = d.date_key
WHERE 
    d.calendar_date BETWEEN :start_date AND :end_date
GROUP BY 
    supplier_id, supplier_name;`,
        targetQueryOAC: `-- Oracle Analytics Cloud - Oracle ADW - Cancelled Flag Check
SELECT 
    dim_supplier.supplier_id,
    dim_supplier.supplier_name,
    COUNT(*) as total_invoices,
    SUM(CASE WHEN fact_ap_invoices.cancelled_flag = 'N' THEN fact_ap_invoices.invoice_amount ELSE 0 END) as active_amount,
    SUM(CASE WHEN fact_ap_invoices.cancelled_flag = 'Y' THEN fact_ap_invoices.invoice_amount ELSE 0 END) as cancelled_amount
FROM 
    dw_supplier_dim dim_supplier
    INNER JOIN dw_ap_invoices_fact fact_ap_invoices 
        ON dim_supplier.supplier_key = fact_ap_invoices.supplier_key
    INNER JOIN dw_date_dim time_dim 
        ON fact_ap_invoices.invoice_date_key = time_dim.date_key
WHERE 
    time_dim.calendar_date BETWEEN :start_date AND :end_date
GROUP BY 
    dim_supplier.supplier_id, dim_supplier.supplier_name;`,
        expectedResult: 'Cancelled invoices should be excluded. Only active_amount should be used for Top 10 ranking.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-007',
        title: 'Validate Multi-Currency Conversion',
        phase: 'accuracy',
        description: 'Verify that invoices in foreign currencies are correctly converted to base currency using the appropriate exchange rates.',
        sourceQuery: `-- Oracle EBS - Multi-Currency
SELECT 
    pv.vendor_id,
    pv.vendor_name,
    ap.invoice_currency_code,
    ap.invoice_amount as original_amount,
    ap.base_amount as converted_amount,
    ap.exchange_rate,
    ap.exchange_date
FROM 
    ap_suppliers pv
    INNER JOIN ap_invoices_all ap ON pv.vendor_id = ap.vendor_id
WHERE 
    ap.invoice_date BETWEEN :start_date AND :end_date
    AND ap.invoice_currency_code != :base_currency
    AND ap.cancelled_date IS NULL;`,
        targetQueryPowerBI: `-- Power BI - One Lake Warehouse - Currency Conversion
SELECT 
    supplier_id,
    supplier_name,
    currency_code,
    invoice_amount as original_amount,
    base_amount as converted_amount,
    exchange_rate,
    exchange_date
FROM 
    lakehouse.supplier_dim s
    INNER JOIN lakehouse.ap_invoices_fact f ON s.supplier_key = f.supplier_key
    INNER JOIN lakehouse.currency_dim c ON f.currency_key = c.currency_key
    INNER JOIN lakehouse.date_dim d ON f.invoice_date_key = d.date_key
WHERE 
    d.calendar_date BETWEEN :start_date AND :end_date
    AND c.currency_code != :base_currency
    AND f.cancelled_flag = 'N';`,
        targetQueryOAC: `-- Oracle Analytics Cloud - Oracle ADW - Currency Conversion
SELECT 
    dim_supplier.supplier_id,
    dim_supplier.supplier_name,
    dim_currency.currency_code,
    fact_ap_invoices.invoice_amount as original_amount,
    fact_ap_invoices.base_amount as converted_amount,
    fact_ap_invoices.exchange_rate,
    fact_ap_invoices.exchange_date
FROM 
    dw_supplier_dim dim_supplier
    INNER JOIN dw_ap_invoices_fact fact_ap_invoices 
        ON dim_supplier.supplier_key = fact_ap_invoices.supplier_key
    INNER JOIN dw_currency_dim dim_currency 
        ON fact_ap_invoices.currency_key = dim_currency.currency_key
    INNER JOIN dw_date_dim time_dim 
        ON fact_ap_invoices.invoice_date_key = time_dim.date_key
WHERE 
    time_dim.calendar_date BETWEEN :start_date AND :end_date
    AND dim_currency.currency_code != :base_currency
    AND fact_ap_invoices.cancelled_flag = 'N';`,
        expectedResult: 'All foreign currency amounts should be converted to base currency using correct exchange rates. Totals should match.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-008',
        title: 'Validate Date Range Filter Functionality',
        phase: 'functional',
        description: 'Test that the date range filter correctly filters suppliers based on invoice dates in both Power BI and OAC.',
        sourceQuery: '',
        targetQueryPowerBI: '',
        targetQueryOAC: '',
        expectedResult: 'Date filter should work correctly in both tools. Results should update dynamically when filter changes.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-009',
        title: 'Validate Report Performance with Large Datasets',
        phase: 'technical',
        description: 'Verify that the Top 10 Suppliers report loads within acceptable time limits (< 5 seconds) even with large transaction volumes.',
        sourceQuery: '',
        targetQueryPowerBI: '',
        targetQueryOAC: '',
        expectedResult: 'Report should load quickly. Query execution time should be optimized with proper indexing.',
        status: 'pending',
        evidence: []
    },
    {
        id: 'TC-010',
        title: 'Validate Data Accuracy - Transaction Level Comparison',
        phase: 'accuracy',
        description: 'Compare individual transaction records between source (EBS) and target data warehouse to ensure data accuracy.',
        sourceQuery: `-- Oracle EBS - Transaction Details
SELECT 
    pv.vendor_id,
    pv.vendor_name,
    ap.invoice_id,
    ap.invoice_num,
    ap.invoice_date,
    ap.invoice_amount,
    ap.status,
    ap.cancelled_date
FROM 
    ap_suppliers pv
    INNER JOIN ap_invoices_all ap ON pv.vendor_id = ap.vendor_id
WHERE 
    ap.invoice_date BETWEEN :start_date AND :end_date
    AND pv.vendor_id IN (:top_10_supplier_ids)
ORDER BY 
    pv.vendor_id, ap.invoice_date DESC;`,
        targetQueryPowerBI: `-- Power BI - One Lake Warehouse - Transaction Details
SELECT 
    supplier_id,
    supplier_name,
    invoice_id,
    invoice_number,
    calendar_date as invoice_date,
    invoice_amount,
    approval_status,
    cancelled_flag
FROM 
    lakehouse.supplier_dim s
    INNER JOIN lakehouse.ap_invoices_fact f ON s.supplier_key = f.supplier_key
    INNER JOIN lakehouse.date_dim d ON f.invoice_date_key = d.date_key
WHERE 
    d.calendar_date BETWEEN :start_date AND :end_date
    AND supplier_id IN (:top_10_supplier_ids)
ORDER BY 
    supplier_id, d.calendar_date DESC;`,
        targetQueryOAC: `-- Oracle Analytics Cloud - Oracle ADW - Transaction Details
SELECT 
    dim_supplier.supplier_id,
    dim_supplier.supplier_name,
    fact_ap_invoices.invoice_id,
    fact_ap_invoices.invoice_number,
    time_dim.calendar_date as invoice_date,
    fact_ap_invoices.invoice_amount,
    fact_ap_invoices.approval_status,
    fact_ap_invoices.cancelled_flag
FROM 
    dw_supplier_dim dim_supplier
    INNER JOIN dw_ap_invoices_fact fact_ap_invoices 
        ON dim_supplier.supplier_key = fact_ap_invoices.supplier_key
    INNER JOIN dw_date_dim time_dim 
        ON fact_ap_invoices.invoice_date_key = time_dim.date_key
WHERE 
    time_dim.calendar_date BETWEEN :start_date AND :end_date
    AND dim_supplier.supplier_id IN (:top_10_supplier_ids)
ORDER BY 
    dim_supplier.supplier_id, time_dim.calendar_date DESC;`,
        expectedResult: 'Transaction-level data should match between source and target. Count and amounts should be identical.',
        status: 'pending',
        evidence: []
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    document.getElementById('validation-date').valueAsDate = new Date();
    
    // Load report description from localStorage
    const savedDesc = localStorage.getItem('reportDescription');
    if (savedDesc) {
        reportDescription = savedDesc;
        document.getElementById('report-description').value = savedDesc;
    }
    
    // Load sample test cases
    testCases = [...sampleTestCases];
    testCaseCounter = testCases.length + 1;
    
    // Render test cases
    renderTestCases();
    updateSummary();
    
    // Form submission
    document.getElementById('test-case-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addTestCase();
    });
    
    // Update queries when reporting tool changes
    document.getElementById('reporting-tool').addEventListener('change', function() {
        renderTestCases();
    });
});

function saveReportDescription() {
    reportDescription = document.getElementById('report-description').value;
    localStorage.setItem('reportDescription', reportDescription);
    alert('Report description saved!');
}

function toggleAddForm() {
    const form = document.getElementById('add-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addTestCase() {
    const form = document.getElementById('test-case-form');
    
    const testCase = {
        id: document.getElementById('test-case-id').value,
        title: document.getElementById('test-case-title').value,
        phase: document.getElementById('validation-phase').value,
        description: document.getElementById('test-case-description').value,
        sourceQuery: document.getElementById('source-query').value,
        targetQueryPowerBI: document.getElementById('target-query').value, // Store as Power BI by default
        targetQueryOAC: document.getElementById('target-query').value, // Can be updated later
        expectedResult: document.getElementById('expected-result').value,
        status: 'pending',
        evidence: []
    };
    
    testCases.push(testCase);
    testCaseCounter++;
    
    // Reset form
    form.reset();
    toggleAddForm();
    
    // Re-render
    renderTestCases();
    updateSummary();
    
    // Show success message
    alert('Test case added successfully!');
}

function renderTestCases() {
    const container = document.getElementById('test-cases-container');
    container.innerHTML = '';
    
    if (testCases.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No test cases found. Add a new test case to get started.</p>';
        return;
    }
    
    testCases.forEach((testCase, index) => {
        const card = createTestCaseCard(testCase, index);
        container.appendChild(card);
    });
}

function createTestCaseCard(testCase, index) {
    const card = document.createElement('div');
    card.className = `test-case-card ${testCase.phase} ${testCase.status}`;
    
    const phaseLabels = {
        'technical': '🔧 Technical Validation',
        'functional': '🧭 Functional Validation',
        'integrity': '🧱 Data Integrity Validation',
        'accuracy': '🎯 Data Accuracy Validation'
    };
    
    const tool = document.getElementById('reporting-tool').value;
    const targetQuery = getTargetQuery(testCase);
    const targetQueryLabel = tool === 'powerbi' 
        ? '🎯 Target Query (One Lake Warehouse / Lakehouse)' 
        : '🎯 Target Query (Oracle ADW)';
    
    card.innerHTML = `
        <div class="test-case-header">
            <span class="test-case-id">${testCase.id}</span>
            <h3 class="test-case-title">${testCase.title}</h3>
            <span class="validation-phase-badge ${testCase.phase}">${phaseLabels[testCase.phase]}</span>
        </div>
        
        <div class="test-case-description">
            ${testCase.description || 'No description provided.'}
        </div>
        
        ${testCase.sourceQuery || targetQuery ? `
        <div class="test-case-queries">
            ${testCase.sourceQuery ? `
            <div class="query-box">
                <h4>📊 Source Query (Oracle EBS/Fusion)</h4>
                <div class="query-content">${escapeHtml(testCase.sourceQuery)}</div>
                <div class="query-actions">
                    <button class="btn-small btn-copy" onclick="copyToClipboard(${index}, 'source')">📋 Copy</button>
                </div>
            </div>
            ` : ''}
            ${targetQuery ? `
            <div class="query-box">
                <h4>${targetQueryLabel}</h4>
                <div class="query-content">${escapeHtml(targetQuery)}</div>
                <div class="query-actions">
                    <button class="btn-small btn-copy" onclick="copyToClipboard(${index}, 'target')">📋 Copy</button>
                </div>
            </div>
            ` : ''}
        </div>
        ` : ''}
        
        ${testCase.expectedResult ? `
        <div class="expected-result" style="background: #E3F2FD; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <strong>Expected Result:</strong> ${testCase.expectedResult}
        </div>
        ` : ''}
        
        <div class="test-case-actions">
            <div class="evidence-section">
                <div class="evidence-upload">
                    <input type="file" id="evidence-${index}" accept="image/*,.pdf,.doc,.docx" multiple onchange="handleEvidenceUpload(${index}, this)">
                    <label for="evidence-${index}" class="evidence-label">📎 Upload Evidence</label>
                </div>
                <div class="evidence-list" id="evidence-list-${index}">
                    ${renderEvidence(testCase.evidence, index)}
                </div>
            </div>
            
            <div class="status-section">
                <button class="status-btn ${testCase.status}" onclick="changeStatus(${index}, 'pending')">⏳ Pending</button>
                <button class="status-btn ${testCase.status}" onclick="changeStatus(${index}, 'passed')">✅ Passed</button>
                <button class="status-btn ${testCase.status}" onclick="changeStatus(${index}, 'failed')">❌ Failed</button>
            </div>
            
            <div>
                <button class="btn-edit" onclick="editTestCase(${index})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteTestCase(${index})">🗑️ Delete</button>
            </div>
        </div>
    `;
    
    return card;
}

function renderEvidence(evidence, index) {
    if (!evidence || evidence.length === 0) {
        return '<span style="color: #999; font-size: 0.85rem;">No evidence uploaded</span>';
    }
    
    return evidence.map((file, i) => {
        if (file.type && file.type.startsWith('image/')) {
            return `
                <div class="evidence-item">
                    <img src="${file.url}" alt="${file.name}">
                    <span>${file.name}</span>
                    <span class="remove" onclick="removeEvidence(${index}, ${i})">×</span>
                </div>
            `;
        } else {
            return `
                <div class="evidence-item">
                    <span>📄</span>
                    <span>${file.name}</span>
                    <span class="remove" onclick="removeEvidence(${index}, ${i})">×</span>
                </div>
            `;
        }
    }).join('');
}

function handleEvidenceUpload(index, input) {
    const files = Array.from(input.files);
    const testCase = testCases[index];
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            testCase.evidence.push({
                name: file.name,
                type: file.type,
                url: e.target.result,
                file: file
            });
            
            renderTestCases();
        };
        
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            // For non-image files, just store the name
            testCase.evidence.push({
                name: file.name,
                type: file.type,
                url: null,
                file: file
            });
            renderTestCases();
        }
    });
}

function removeEvidence(testCaseIndex, evidenceIndex) {
    testCases[testCaseIndex].evidence.splice(evidenceIndex, 1);
    renderTestCases();
}

function changeStatus(index, status) {
    testCases[index].status = status;
    renderTestCases();
    updateSummary();
}

function deleteTestCase(index) {
    if (confirm('Are you sure you want to delete this test case?')) {
        testCases.splice(index, 1);
        renderTestCases();
        updateSummary();
    }
}

function editTestCase(index) {
    const testCase = testCases[index];
    
    // Populate form
    document.getElementById('test-case-id').value = testCase.id;
    document.getElementById('test-case-title').value = testCase.title;
    document.getElementById('validation-phase').value = testCase.phase;
    document.getElementById('test-case-description').value = testCase.description || '';
    document.getElementById('source-query').value = testCase.sourceQuery || '';
    document.getElementById('target-query').value = getTargetQuery(testCase);
    document.getElementById('expected-result').value = testCase.expectedResult || '';
    
    // Show form
    document.getElementById('add-form').style.display = 'block';
    
    // Update form to edit mode
    const form = document.getElementById('test-case-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        // Update test case
        testCase.id = document.getElementById('test-case-id').value;
        testCase.title = document.getElementById('test-case-title').value;
        testCase.phase = document.getElementById('validation-phase').value;
        testCase.description = document.getElementById('test-case-description').value;
        testCase.sourceQuery = document.getElementById('source-query').value;
        const tool = document.getElementById('reporting-tool').value;
        if (tool === 'powerbi') {
            testCase.targetQueryPowerBI = document.getElementById('target-query').value;
        } else {
            testCase.targetQueryOAC = document.getElementById('target-query').value;
        }
        testCase.expectedResult = document.getElementById('expected-result').value;
        
        // Reset form
        form.reset();
        form.onsubmit = function(e) {
            e.preventDefault();
            addTestCase();
        };
        toggleAddForm();
        
        renderTestCases();
        alert('Test case updated successfully!');
    };
}

function filterTestCases() {
    const phaseFilter = document.getElementById('filter-phase').value;
    const statusFilter = document.getElementById('filter-status').value;
    const searchTerm = document.getElementById('search-test').value.toLowerCase();
    
    const cards = document.querySelectorAll('.test-case-card');
    
    cards.forEach((card, index) => {
        const testCase = testCases[index];
        if (!testCase) return;
        
        let show = true;
        
        // Phase filter
        if (phaseFilter !== 'all' && testCase.phase !== phaseFilter) {
            show = false;
        }
        
        // Status filter
        if (statusFilter !== 'all' && testCase.status !== statusFilter) {
            show = false;
        }
        
        // Search filter
        if (searchTerm && !testCase.title.toLowerCase().includes(searchTerm) && 
            !testCase.description.toLowerCase().includes(searchTerm) &&
            !testCase.id.toLowerCase().includes(searchTerm)) {
            show = false;
        }
        
        card.classList.toggle('hidden', !show);
    });
}

function updateSummary() {
    const total = testCases.length;
    const passed = testCases.filter(tc => tc.status === 'passed').length;
    const failed = testCases.filter(tc => tc.status === 'failed').length;
    const pending = testCases.filter(tc => tc.status === 'pending').length;
    const completionRate = total > 0 ? Math.round(((passed + failed) / total) * 100) : 0;
    
    document.getElementById('total-tests').textContent = total;
    document.getElementById('passed-tests').textContent = passed;
    document.getElementById('failed-tests').textContent = failed;
    document.getElementById('pending-tests').textContent = pending;
    document.getElementById('completion-rate').textContent = completionRate + '%';
}

function copyToClipboard(index, type) {
    const testCase = testCases[index];
    let text = '';
    
    if (type === 'source') {
        text = testCase.sourceQuery;
    } else {
        text = getTargetQuery(testCase);
    }
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Query copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Query copied to clipboard!');
    });
}

function exportChecklist() {
    const data = {
        reportName: 'Top 10 Suppliers',
        reportingTool: document.getElementById('reporting-tool').value,
        validationDate: document.getElementById('validation-date').value,
        validator: document.getElementById('validator-name').value,
        reportDescription: reportDescription,
        testCases: testCases
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Validation_Checklist_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function printChecklist() {
    window.print();
}

// PDF Export Function
function exportToPDF() {
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please refresh the page and try again.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const maxWidth = doc.internal.pageSize.width - (margin * 2);
    
    // Helper function to add new page if needed
    function checkNewPage(spaceNeeded = 20) {
        if (yPos + spaceNeeded > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            return true;
        }
        return false;
    }
    
    // Helper function to add text with word wrap
    function addText(text, fontSize = 10, isBold = false, color = null) {
        doc.setFontSize(fontSize);
        if (isBold) {
            doc.setFont(undefined, 'bold');
        } else {
            doc.setFont(undefined, 'normal');
        }
        if (color) {
            doc.setTextColor(color.r, color.g, color.b);
        }
        
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach(line => {
            checkNewPage(10);
            doc.text(line, margin, yPos);
            yPos += 7;
        });
        
        if (color) {
            doc.setTextColor(0, 0, 0); // Reset to black
        }
    }
    
    // Title Page
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text('Report Validation Checklist', margin, yPos);
    yPos += 15;
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Top 10 Suppliers', margin, yPos);
    yPos += 20;
    
    // Report Information
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Report Information', margin, yPos);
    yPos += 8;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const reportingTool = document.getElementById('reporting-tool').value === 'powerbi' ? 'Power BI' : 'Oracle Analytics Cloud';
    doc.text(`Reporting Tool: ${reportingTool}`, margin, yPos);
    yPos += 7;
    doc.text(`Validation Date: ${document.getElementById('validation-date').value}`, margin, yPos);
    yPos += 7;
    doc.text(`Validator: ${document.getElementById('validator-name').value || 'Not specified'}`, margin, yPos);
    yPos += 15;
    
    // Report Description
    if (reportDescription) {
        checkNewPage(30);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Report Description', margin, yPos);
        yPos += 8;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        addText(reportDescription, 10);
        yPos += 10;
    }
    
    // Table of Contents
    checkNewPage(30);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Table of Contents', margin, yPos);
    yPos += 10;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const tocPages = [];
    testCases.forEach((tc, index) => {
        tocPages.push({ id: tc.id, title: tc.title, page: doc.internal.pages.length });
        const tocLine = `${tc.id}: ${tc.title}`;
        const lines = doc.splitTextToSize(tocLine, maxWidth - 30);
        lines.forEach((line, i) => {
            checkNewPage(10);
            if (i === 0) {
                doc.text(line, margin, yPos);
                doc.text(`... ${doc.internal.pages.length}`, maxWidth + margin - 20, yPos);
            } else {
                doc.text(line, margin + 10, yPos);
            }
            yPos += 7;
        });
    });
    
    // Test Cases
    testCases.forEach((testCase, index) => {
        doc.addPage();
        yPos = margin;
        
        // Test Case Header
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 102, 204);
        doc.text(`Test Case ${testCase.id}`, margin, yPos);
        yPos += 10;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const titleLines = doc.splitTextToSize(testCase.title, maxWidth);
        titleLines.forEach(line => {
            doc.text(line, margin, yPos);
            yPos += 7;
        });
        yPos += 5;
        
        // Phase and Status
        const phaseLabels = {
            'technical': '🔧 Technical Validation',
            'functional': '🧭 Functional Validation',
            'integrity': '🧱 Data Integrity Validation',
            'accuracy': '🎯 Data Accuracy Validation'
        };
        const statusLabels = {
            'pending': '⏳ Pending',
            'passed': '✅ Passed',
            'failed': '❌ Failed'
        };
        
        doc.setFontSize(10);
        doc.text(`Validation Phase: ${phaseLabels[testCase.phase]}`, margin, yPos);
        yPos += 7;
        doc.text(`Status: ${statusLabels[testCase.status]}`, margin, yPos);
        yPos += 10;
        
        // Description
        if (testCase.description) {
            checkNewPage(20);
            doc.setFont(undefined, 'bold');
            doc.text('Description:', margin, yPos);
            yPos += 7;
            doc.setFont(undefined, 'normal');
            addText(testCase.description, 10);
            yPos += 5;
        }
        
        // Expected Result
        if (testCase.expectedResult) {
            checkNewPage(20);
            doc.setFont(undefined, 'bold');
            doc.text('Expected Result:', margin, yPos);
            yPos += 7;
            doc.setFont(undefined, 'normal');
            addText(testCase.expectedResult, 10);
            yPos += 5;
        }
        
        // Source Query
        if (testCase.sourceQuery) {
            checkNewPage(30);
            doc.setFont(undefined, 'bold');
            doc.text('Source Query (Oracle EBS/Fusion):', margin, yPos);
            yPos += 7;
            doc.setFont(undefined, 'normal');
            doc.setFont('courier');
            doc.setFontSize(8);
            const sourceLines = doc.splitTextToSize(testCase.sourceQuery, maxWidth);
            sourceLines.forEach(line => {
                checkNewPage(5);
                doc.text(line, margin, yPos);
                yPos += 4;
            });
            doc.setFont('helvetica');
            doc.setFontSize(10);
            yPos += 5;
        }
        
        // Target Query
        const targetQuery = getTargetQuery(testCase);
        if (targetQuery) {
            checkNewPage(30);
            doc.setFont(undefined, 'bold');
            const targetLabel = reportingTool === 'Power BI' 
                ? 'Target Query (One Lake Warehouse / Lakehouse):'
                : 'Target Query (Oracle ADW):';
            doc.text(targetLabel, margin, yPos);
            yPos += 7;
            doc.setFont(undefined, 'normal');
            doc.setFont('courier');
            doc.setFontSize(8);
            const targetLines = doc.splitTextToSize(targetQuery, maxWidth);
            targetLines.forEach(line => {
                checkNewPage(5);
                doc.text(line, margin, yPos);
                yPos += 4;
            });
            doc.setFont('helvetica');
            doc.setFontSize(10);
            yPos += 5;
        }
        
        // Evidence
        if (testCase.evidence && testCase.evidence.length > 0) {
            checkNewPage(30);
            doc.setFont(undefined, 'bold');
            doc.text('Evidence:', margin, yPos);
            yPos += 7;
            doc.setFont(undefined, 'normal');
            
            testCase.evidence.forEach((evidence, evIndex) => {
                checkNewPage(15);
                doc.text(`• ${evidence.name}`, margin, yPos);
                yPos += 7;
                
                // Try to add image if it's an image file
                if (evidence.type && evidence.type.startsWith('image/') && evidence.url) {
                    try {
                        const img = new Image();
                        img.src = evidence.url;
                        const imgWidth = 80;
                        const imgHeight = 60; // Default height
                        
                        if (checkNewPage(imgHeight + 10)) {
                            yPos = margin;
                        }
                        
                        // Add image with error handling
                        try {
                            doc.addImage(evidence.url, 'JPEG', margin, yPos, imgWidth, imgHeight);
                            yPos += imgHeight + 5;
                        } catch (e) {
                            doc.text('(Image could not be loaded)', margin + 10, yPos);
                            yPos += 7;
                        }
                    } catch (e) {
                        doc.text('(Image could not be loaded)', margin + 10, yPos);
                        yPos += 7;
                    }
                }
            });
        }
        
        // Test Result
        checkNewPage(15);
        doc.setFont(undefined, 'bold');
        doc.text('Test Result:', margin, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');
        
        const resultColor = testCase.status === 'passed' ? {r: 0, g: 153, b: 76} : 
                           testCase.status === 'failed' ? {r: 220, g: 53, b: 69} : 
                           {r: 255, g: 193, b: 7};
        doc.setTextColor(resultColor.r, resultColor.g, resultColor.b);
        doc.text(statusLabels[testCase.status], margin, yPos);
        doc.setTextColor(0, 0, 0);
    });
    
    // Summary Page
    doc.addPage();
    yPos = margin;
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 102, 204);
    doc.text('Validation Summary', margin, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    
    const total = testCases.length;
    const passed = testCases.filter(tc => tc.status === 'passed').length;
    const failed = testCases.filter(tc => tc.status === 'failed').length;
    const pending = testCases.filter(tc => tc.status === 'pending').length;
    const completionRate = total > 0 ? Math.round(((passed + failed) / total) * 100) : 0;
    
    doc.text(`Total Test Cases: ${total}`, margin, yPos);
    yPos += 10;
    doc.setTextColor(0, 153, 76);
    doc.text(`Passed: ${passed}`, margin, yPos);
    yPos += 10;
    doc.setTextColor(220, 53, 69);
    doc.text(`Failed: ${failed}`, margin, yPos);
    yPos += 10;
    doc.setTextColor(255, 193, 7);
    doc.text(`Pending: ${pending}`, margin, yPos);
    yPos += 10;
    doc.setTextColor(0, 102, 204);
    doc.text(`Completion Rate: ${completionRate}%`, margin, yPos);
    
    // Save PDF
    const fileName = `Validation_Checklist_${document.getElementById('reporting-tool').value}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    alert('PDF exported successfully!');
}

function closeModal() {
    document.getElementById('test-case-modal').style.display = 'none';
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

