function Customers({
  customers, invoices, payments, searchQuery, setSearchQuery, currentPage, handlePageChange,
  handleCustomerClick, handleCustomerInvoicesClick, setIsAddCustomerModalOpen,
  setEditCustomer, setIsEditCustomerModalOpen, darkMode, getCustomerBalance
}) {
  const filteredCustomers = customers.filter(c => 
    c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone_number.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = 30;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage.customers - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCustomers.length);
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-col sm:flex-row">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Customers
        </h1>
        <input
          type="text"
          placeholder="Search by Name, Email, or Phone"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 sm:w-auto w-full"
        />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-700 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">Balance</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer, index) => (
              <tr key={customer.customer_id} className={`hover:bg-gray-100 dark:hover:bg-gray-700 transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}>
                <td className="py-3 px-4 cursor-pointer" onClick={() => handleCustomerInvoicesClick(customer.customer_id)}>{customer.customer_name}</td>
                <td className="py-3 px-4">{customer.email}</td>
                <td className="py-3 px-4">{customer.phone_number}</td>
                <td className="py-3 px-4">${getCustomerBalance(customer.customer_id).toFixed(2)}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => handleCustomerClick(customer)}
                    className="text-blue-600 hover:text-blue-700 transition flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Details
                  </button>
                  <button
                    onClick={() => { setEditCustomer(customer); setIsEditCustomerModalOpen(true); }}
                    className="text-green-600 hover:text-green-700 transition flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange('customers', currentPage.customers - 1)}
          disabled={currentPage.customers === 1}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          {endIndex} of {filteredCustomers.length} entries (Page {currentPage.customers} of {totalPages})
        </span>
        <button
          onClick={() => handlePageChange('customers', currentPage.customers + 1)}
          disabled={currentPage.customers === totalPages}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
      <button
        onClick={() => setIsAddCustomerModalOpen(true)}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Customer
      </button>
    </div>
  );
}

export default Customers;