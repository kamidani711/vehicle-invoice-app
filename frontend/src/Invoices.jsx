function Invoices({
  customers, invoices, selectedCustomer, setSelectedCustomer, searchQuery, setSearchQuery,
  dateFilter, setDateFilter, currentPage, handlePageChange, setIsInvoiceModalOpen,
  setEditInvoice, setIsEditInvoiceModalOpen, handleDeleteInvoice, darkMode, formatDate, userRole
}) {
  const filteredInvoices = invoices.filter(item => {
    const matchesCustomer = !selectedCustomer || item.customer_id === selectedCustomer;
    const vinQuery = searchQuery.toLowerCase();
    const fullVin = item.vin_no?.toLowerCase() || '';
    const lastSixVin = fullVin.slice(-6);
    const matchesSearch = (
      item.customer_name.toLowerCase().includes(vinQuery) ||
      fullVin.includes(vinQuery) ||
      lastSixVin.includes(vinQuery) ||
      item.invoice_no?.toLowerCase().includes(vinQuery) ||
      item.container_no?.toLowerCase().includes(vinQuery) ||
      item.container_invoice_no?.toLowerCase().includes(vinQuery) ||
      item.car_details.toLowerCase().includes(vinQuery)
    );
    const matchesDate = !dateFilter || item.date?.startsWith(dateFilter);
    return matchesCustomer && matchesSearch && matchesDate;
  });
  const itemsPerPage = 30;
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage.invoices - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredInvoices.length);
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-col sm:flex-row">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
          </svg>
          Invoices
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
            placeholder="Search by VIN, Invoice No, etc."
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
              <th className="py-3 px-4 text-left">Invoice No</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Container Invoice No</th>
              <th className="py-3 px-4 text-left">Car Details</th>
              <th className="py-3 px-4 text-left">VIN No</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map((invoice, index) => (
              <tr key={invoice.invoice_id} className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                <td className="py-3 px-4">{invoice.invoice_no}</td>
                <td className="py-3 px-4">{invoice.customer_name}</td>
                <td className="py-3 px-4">{invoice.container_invoice_no || 'N/A'}</td>
                <td className="py-3 px-4">{invoice.car_details}</td>
                <td className="py-3 px-4">{invoice.vin_no}</td>
                <td className="py-3 px-4">${(invoice.total_amount || 0).toFixed(2)}</td>
                <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                <td className="py-3 px-4 flex gap-2">
                  {userRole === 'admin' && (
                    <>
                      <button
                        onClick={() => { setEditInvoice(invoice); setIsEditInvoiceModalOpen(true); }}
                        className="text-blue-600 hover:text-blue-700 transition flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.invoice_id)}
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
          onClick={() => handlePageChange('invoices', currentPage.invoices - 1)}
          disabled={currentPage.invoices === 1}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          {endIndex} of {filteredInvoices.length} entries (Page {currentPage.invoices} of {totalPages})
        </span>
        <button
          onClick={() => handlePageChange('invoices', currentPage.invoices + 1)}
          disabled={currentPage.invoices === totalPages}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
      <button
        onClick={() => setIsInvoiceModalOpen(true)}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Invoice
      </button>
    </div>
  );
}

export default Invoices;