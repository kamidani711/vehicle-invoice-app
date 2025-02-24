import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

function Reports({ customers, invoices, payments, reportDateRange, setReportDateRange, darkMode, formatDate }) {
  const getCustomerBalance = (customerId) => {
    const customerInvoices = invoices.filter(inv => inv.customer_id === customerId);
    const customerPayments = payments.filter(pay => pay.customer_id === customerId);
    const invTotal = customerInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    const payTotal = customerPayments.reduce((sum, pay) => sum + (pay.amount_received || 0), 0);
    return invTotal - payTotal;
  };

  const generateTotalByCustomerReport = (format) => {
    const reportData = customers.map(customer => ({
      Customer: customer.customer_name,
      'Total Invoices': invoices.filter(inv => inv.customer_id === customer.customer_id).reduce((sum, inv) => sum + (inv.total_amount || 0), 0),
      'Total Payments': payments.filter(pay => pay.customer_id === customer.customer_id).reduce((sum, pay) => sum + (pay.amount_received || 0), 0),
      Balance: getCustomerBalance(customer.customer_id)
    })).filter(row => 
      (!reportDateRange.start || row['Total Invoices'] || row['Total Payments']) &&
      (!reportDateRange.start || invoices.some(inv => inv.customer_id === customers.find(c => c.customer_name === row.Customer)?.customer_id && inv.date >= reportDateRange.start && (!reportDateRange.end || inv.date <= reportDateRange.end)) ||
       payments.some(pay => pay.customer_id === customers.find(c => c.customer_name === row.Customer)?.customer_id && pay.date >= reportDateRange.start && (!reportDateRange.end || pay.date <= reportDateRange.end)))
    );

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Total by Customer Report', 10, 10);
      doc.autoTable({
        startY: 20,
        head: [['Customer', 'Total Invoices', 'Total Payments', 'Balance']],
        body: reportData.map(row => [row.Customer, row['Total Invoices'].toFixed(2), row['Total Payments'].toFixed(2), row.Balance.toFixed(2)])
      });
      doc.save('Total_by_Customer.pdf');
    } else if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Total by Customer');
      XLSX.writeFile(wb, 'Total_by_Customer.xlsx');
    }
  };

  const generatePaymentSummaryReport = (format) => {
    const reportData = payments.map(payment => ({
      Customer: customers.find(c => c.customer_id === payment.customer_id)?.customer_name || 'Unknown',
      Amount: payment.amount_received,
      'Received By': payment.received_by || 'N/A',
      Date: formatDate(payment.date)
    })).filter(row => 
      !reportDateRange.start || (row.Date !== 'N/A' && new Date(payment.date) >= new Date(reportDateRange.start) && (!reportDateRange.end || new Date(payment.date) <= new Date(reportDateRange.end)))
    );

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Payment Summary Report', 10, 10);
      doc.autoTable({
        startY: 20,
        head: [['Customer', 'Amount', 'Received By', 'Date']],
        body: reportData.map(row => [row.Customer, row.Amount.toFixed(2), row['Received By'], row.Date])
      });
      doc.save('Payment_Summary.pdf');
    } else if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet(reportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Payment Summary');
      XLSX.writeFile(wb, 'Payment_Summary.xlsx');
    }
  };

  const generateVatSummaryReport = (format) => {
    const reportData = customers.map(customer => ({
      Customer: customer.customer_name,
      VAT: invoices
        .filter(inv => inv.customer_id === customer.customer_id)
        .reduce((sum, inv) => sum + (inv.vat || 0), 0)
    })).filter(row => 
      row.VAT > 0 &&
      (!reportDateRange.start || invoices.some(inv => inv.customer_id === customers.find(c => c.customer_name === row.Customer)?.customer_id && inv.date >= reportDateRange.start && (!reportDateRange.end || inv.date <= reportDateRange.end)))
    );

    const totalVAT = reportData.reduce((sum, row) => sum + row.VAT, 0);

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('VAT Summary Report', 10, 10);
      doc.autoTable({
        startY: 20,
        head: [['Customer', 'VAT ($)']],
        body: [
          ...reportData.map(row => [row.Customer, row.VAT.toFixed(2)]),
          ['Total VAT', totalVAT.toFixed(2)]
        ],
        didDrawPage: (data) => {
          doc.setFontSize(12);
          doc.text(`Date Range: ${reportDateRange.start || 'All'} to ${reportDateRange.end || 'All'}`, 10, doc.internal.pageSize.height - 10);
        }
      });
      doc.save('VAT_Summary.pdf');
    } else if (format === 'excel') {
      const ws = XLSX.utils.json_to_sheet([
        ...reportData,
        { Customer: 'Total VAT', VAT: totalVAT }
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'VAT Summary');
      XLSX.writeFile(wb, 'VAT_Summary.xlsx');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Reports
      </h1>
      <div className="mb-6">
        <div className="flex gap-4 mb-4 flex-col sm:flex-row">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <input
              type="date"
              value={reportDateRange.start}
              onChange={e => setReportDateRange({ ...reportDateRange, start: e.target.value })}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <input
              type="date"
              value={reportDateRange.end}
              onChange={e => setReportDateRange({ ...reportDateRange, end: e.target.value })}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total by Customer</p>
            <div className="flex gap-2">
              <button
                onClick={() => generateTotalByCustomerReport('pdf')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => generateTotalByCustomerReport('excel')}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Payment Summary</p>
            <div className="flex gap-2">
              <button
                onClick={() => generatePaymentSummaryReport('pdf')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => generatePaymentSummaryReport('excel')}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">VAT Summary</p>
            <div className="flex gap-2">
              <button
                onClick={() => generateVatSummaryReport('pdf')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => generateVatSummaryReport('excel')}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;