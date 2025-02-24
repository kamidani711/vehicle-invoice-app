import React from 'react';

function History({ deletedInvoices, deletedPayments, darkMode, formatDate, userRole }) {
  // Debug props
  console.log('History props:', { deletedInvoices, deletedPayments, darkMode, formatDate, userRole });

  // Ensure arrays are defined, even if empty
  const safeDeletedInvoices = Array.isArray(deletedInvoices) ? deletedInvoices : [];
  const safeDeletedPayments = Array.isArray(deletedPayments) ? deletedPayments : [];

  if (userRole !== 'admin') {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300">
        <h1 className="text-3xl font-semibold mb-4">Access Denied</h1>
        <p>Only admins can view deletion history.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Deletion History
      </h1>

      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Deleted Invoices</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto mb-6">
        <table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-700 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Invoice ID</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Deleted By</th>
              <th className="py-3 px-4 text-left">Deleted At</th>
            </tr>
          </thead>
          <tbody>
            {safeDeletedInvoices.length > 0 ? (
              safeDeletedInvoices.map((inv, index) => (
                <tr
                  key={inv.deleted_invoice_id}
                  className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}
                >
                  <td className="py-3 px-4">{inv.invoice_id}</td>
                  <td className="py-3 px-4">{inv.customer_name}</td>
                  <td className="py-3 px-4">${(inv.total_amount || 0).toFixed(2)}</td>
                  <td className="py-3 px-4">{inv.deleted_by}</td>
                  <td className="py-3 px-4">{formatDate(inv.deleted_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center">No deleted invoices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Deleted Payments</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-700 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Payment ID</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Deleted By</th>
              <th className="py-3 px-4 text-left">Deleted At</th>
            </tr>
          </thead>
          <tbody>
            {safeDeletedPayments.length > 0 ? (
              safeDeletedPayments.map((pay, index) => (
                <tr
                  key={pay.deleted_payment_id}
                  className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}
                >
                  <td className="py-3 px-4">{pay.payment_id}</td>
                  <td className="py-3 px-4">{pay.customer_name}</td>
                  <td className="py-3 px-4">${(pay.amount_received || 0).toFixed(2)}</td>
                  <td className="py-3 px-4">{pay.deleted_by}</td>
                  <td className="py-3 px-4">{formatDate(pay.deleted_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center">No deleted payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;