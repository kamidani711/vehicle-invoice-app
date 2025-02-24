import { useState } from 'react';

function AllTransactionsModal({ invoices, payments, customers, darkMode, formatDate, setIsAllTransactionsModalOpen }) {
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    ...invoices.map(inv => ({
      type: 'Invoice',
      id: inv.invoice_id,
      customer: customers.find(c => c.customer_id === inv.customer_id)?.customer_name || 'Unknown',
      details: inv.car_details || 'N/A',
      amount: inv.total_amount || 0,
      date: inv.date || 'N/A'
    })),
    ...payments.map(pay => ({
      type: 'Payment',
      id: pay.payment_id,
      customer: customers.find(c => c.customer_id === pay.customer_id)?.customer_name || 'Unknown',
      details: pay.received_by || 'N/A',
      amount: pay.amount_received || 0,
      date: pay.date || 'N/A'
    }))
  ];

  const filteredTransactions = transactions.filter(txn =>
    txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
        </svg>
        All Transactions
      </h2>
      <input
        type="text"
        placeholder="Search by customer, details, or type"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-700 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Details</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn, index) => (
              <tr key={`${txn.type}-${txn.id}`} className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                <td className="py-3 px-4">{txn.type}</td>
                <td className="py-3 px-4">{txn.customer}</td>
                <td className="py-3 px-4">{txn.details}</td>
                <td className="py-3 px-4">${txn.amount.toFixed(2)}</td>
                <td className="py-3 px-4">{formatDate(txn.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setIsAllTransactionsModalOpen(false)}
        className="mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition w-full"
      >
        Close
      </button>
    </div>
  );
}

export default AllTransactionsModal;