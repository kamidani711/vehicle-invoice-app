import { useState } from 'react';

function BulkUpload({ token, darkMode, userRole }) {
  const [customerFile, setCustomerFile] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'customers') setCustomerFile(file);
    if (type === 'invoices') setInvoiceFile(file);
    if (type === 'payments') setPaymentFile(file);
  };

  const handleSubmit = async (type) => {
    const file = type === 'customers' ? customerFile : type === 'invoices' ? invoiceFile : paymentFile;
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:3000/api/bulk/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} imported successfully!`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="text-center text-gray-700 dark:text-gray-300">
        <h1 className="text-3xl font-semibold mb-4">Access Denied</h1>
        <p>Only admins can perform bulk uploads.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Bulk Upload
      </h1>
      <div className="space-y-6">
        {/* Customers Upload */}
        <div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Customers CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(e, 'customers')}
            className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
          />
          <button
            onClick={() => handleSubmit('customers')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            Upload Customers
          </button>
        </div>

        {/* Invoices Upload */}
        <div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Invoices CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(e, 'invoices')}
            className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
          />
          <button
            onClick={() => handleSubmit('invoices')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            Upload Invoices
          </button>
        </div>

        {/* Payments Upload */}
        <div>
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Payments CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(e, 'payments')}
            className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
          />
          <button
            onClick={() => handleSubmit('payments')}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            Upload Payments
          </button>
        </div>

        {/* Feedback Message */}
        {message && (
          <p className={`mt-4 text-center ${message.includes('Error') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default BulkUpload;