import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceModal from './InvoiceModal';

function CustomerInvoices({ customers, invoices, token, setInvoices, darkMode, formatDate, userRole, setEditInvoice, setIsEditInvoiceModalOpen, handleDeleteInvoice }) {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const customer = customers.find(c => c.customer_id === parseInt(customerId));
  if (!customer) return <div className="text-center text-red-600 dark:text-red-400">Customer not found</div>;

  const customerInvoices = invoices.filter(inv => inv.customer_id === parseInt(customerId));
  const filteredInvoices = customerInvoices.filter(item =>
    item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.invoice_no && item.invoice_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.container_no && item.container_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
    item.car_details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.vin_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-col sm:flex-row">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
          </svg>
          Invoices for {customer.customer_name}
        </h1>
        <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Invoice/VIN/Container"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button
            onClick={() => navigate('/customers')}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Customers
          </button>
        </div>
      </div>
      <button
        onClick={() => setIsInvoiceModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mb-4 transition flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        New Invoice
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-700 dark:bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Invoice No</th>
              <th className="py-3 px-4 text-left">Container No</th>
              <th className="py-3 px-4 text-left">Car Details</th>
              <th className="py-3 px-4 text-left">VIN No</th>
              <th className="py-3 px-4 text-left">Shipping/Towing</th>
              <th className="py-3 px-4 text-left">Attestation</th>
              <th className="py-3 px-4 text-left">Duty</th>
              <th className="py-3 px-4 text-left">Bill</th>
              <th className="py-3 px-4 text-left">VAT</th>
              <th className="py-3 px-4 text-left">Clearing</th>
              <th className="py-3 px-4 text-left">Lifter</th>
              <th className="py-3 px-4 text-left">Total Amount</th>
              <th className="py-3 px-4 text-left">Date</th>
              {userRole === 'admin' && <th className="py-3 px-4 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice, index) => (
              <tr key={invoice.invoice_id} className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                <td className="py-3 px-4">{invoice.invoice_no || ''}</td>
                <td className="py-3 px-4">{invoice.container_no || ''}</td>
                <td className="py-3 px-4">{invoice.car_details || ''}</td>
                <td className="py-3 px-4">{invoice.vin_no || ''}</td>
                <td className="py-3 px-4">${(invoice.shipping_towing || 0).toFixed(2)}</td>
                <td className="py-3 px-4">${(invoice.attestation || 0).toFixed(2)}</td>
                <td className="py-3 px-4">${(invoice.duty || 0).toFixed(2)}</td>
                <td className="py-3 px-4">${(invoice.bill || 0).toFixed(2)}</td>
                <td className="py-3 px-4">${(invoice.vat || 0).toFixed(2)}</td>
                <td className="py-3 px-4">${(invoice.clearing || 0).toFixed(2)}</td>
                <td className="py-3 px-4">${(invoice.lifter || 0).toFixed(2)}</td>
                <td className="py-3 px-4">${(invoice.total_amount || 0).toFixed(2)}</td>
                <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                {userRole === 'admin' && (
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => { setEditInvoice(invoice); setIsEditInvoiceModalOpen(true); }}
                      className="text-yellow-600 hover:text-yellow-700 transition flex items-center"
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" />
                      </svg>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300" onClick={() => setIsInvoiceModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg transform transition-all duration-300 scale-95 animate-modal-in" onClick={e => e.stopPropagation()}>
            <InvoiceModal
              customers={customers}
              token={token}
              setIsInvoiceModalOpen={setIsInvoiceModalOpen}
              setInvoices={setInvoices}
              darkMode={darkMode}
              defaultCustomerId={parseInt(customerId)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerInvoices;