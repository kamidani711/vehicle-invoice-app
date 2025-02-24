function CustomerModal({ selectedCustomerDetails, invoices, payments, setIsCustomerModalOpen, setIsInvoiceModalOpen, darkMode, formatDate, getCustomerBalance }) {
  const customerInvoices = invoices.filter(inv => inv.customer_id === selectedCustomerDetails.customer_id);
  const customerPayments = payments.filter(pay => pay.customer_id === selectedCustomerDetails.customer_id);

  return (
    <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Customer Details: {selectedCustomerDetails.customer_name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
          <p className="text-gray-900 dark:text-gray-100">{selectedCustomerDetails.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</p>
          <p className="text-gray-900 dark:text-gray-100">{selectedCustomerDetails.phone_number}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Balance</p>
          <p className="text-gray-900 dark:text-gray-100">${getCustomerBalance(selectedCustomerDetails.customer_id).toFixed(2)}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Invoices</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-700 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Invoice No</th>
              <th className="py-3 px-4 text-left">Car Details</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {customerInvoices.slice(0, 5).map((invoice, index) => (
              <tr key={invoice.invoice_id} className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                <td className="py-3 px-4">{invoice.invoice_no || 'N/A'}</td>
                <td className="py-3 px-4">{invoice.car_details}</td>
                <td className="py-3 px-4">${(invoice.total_amount || 0).toFixed(2)}</td>
                <td className="py-3 px-4">{formatDate(invoice.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Payments</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-700 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Received By</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {customerPayments.slice(0, 5).map((payment, index) => (
              <tr key={payment.payment_id} className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                <td className="py-3 px-4">{payment.received_by || 'N/A'}</td>
                <td className="py-3 px-4">${(payment.amount_received || 0).toFixed(2)}</td>
                <td className="py-3 px-4">{formatDate(payment.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition w-full flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
          </svg>
          New Invoice
        </button>
        <button
          onClick={() => setIsCustomerModalOpen(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CustomerModal;