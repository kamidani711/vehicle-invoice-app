function Payments({
  customers, payments, selectedCustomer, setSelectedCustomer, searchQuery, setSearchQuery,
  dateFilter, setDateFilter, currentPage, handlePageChange, setIsPaymentModalOpen,
  setEditPayment, setIsEditPaymentModalOpen, handleDeletePayment, darkMode, formatDate, userRole
}) {
  const filteredPayments = payments.filter(item => {
    const customerName = customers.find(c => c.customer_id === item.customer_id)?.customer_name.toLowerCase() || '';
    const matchesCustomer = !selectedCustomer || item.customer_id === selectedCustomer;
    const matchesSearch = (
      customerName.includes(searchQuery.toLowerCase()) ||
      (item.payment_no && item.payment_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.received_by && item.received_by.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const matchesDate = !dateFilter || item.date?.startsWith(dateFilter);
    return matchesCustomer && matchesSearch && matchesDate;
  });
  const itemsPerPage = 30;
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage.payments - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPayments.length);
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-col sm:flex-row">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
          Payments
        </h1>
        <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <select
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="">All Customers</option>
            {customers.map(c => (
              <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by Customer, Payment No, etc."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-700 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Payment No</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Received By</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((payment, index) => (
              <tr key={payment.payment_id} className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                <td className="py-3 px-4">{payment.payment_no}</td>
                <td className="py-3 px-4">{customers.find(c => c.customer_id === payment.customer_id)?.customer_name}</td>
                <td className="py-3 px-4">${(payment.amount_received || 0).toFixed(2)}</td>
                <td className="py-3 px-4">{payment.received_by || 'N/A'}</td>
                <td className="py-3 px-4">{formatDate(payment.date)}</td>
                <td className="py-3 px-4 flex gap-2">
                  {userRole === 'admin' && (
                    <>
                      <button
                        onClick={() => { setEditPayment(payment); setIsEditPaymentModalOpen(true); }}
                        className="text-blue-600 hover:text-blue-700 transition flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePayment(payment.payment_id)}
                        className="text-red-600 hover:text-red-700 transition flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V3a1 1 0 011-1zm-7 5h14" />
                        </svg>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange('payments', currentPage.payments - 1)}
          disabled={currentPage.payments === 1}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          {endIndex} of {filteredPayments.length} entries (Page {currentPage.payments} of {totalPages})
        </span>
        <button
          onClick={() => handlePageChange('payments', currentPage.payments + 1)}
          disabled={currentPage.payments === totalPages}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
      <button
        onClick={() => setIsPaymentModalOpen(true)}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Payment
      </button>
    </div>
  );
}

export default Payments;