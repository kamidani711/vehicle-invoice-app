import { useState, useEffect } from 'react';

function InvoiceModal({ customers, token, setIsInvoiceModalOpen, setInvoices, darkMode, defaultCustomerId, setConfirmModalOpen, setConfirmMessage, setConfirmAction }) {
  const [formData, setFormData] = useState({
    customer_id: defaultCustomerId || '',
    container_no: '',
    container_invoice_no: '',
    car_details: '',
    vin_no: '',
    shipping_towing: '',
    attestation: '',
    duty: '',
    bill: '',
    vat: '',
    clearing: '',
    lifter: '',
    total_amount: 0,
    date: new Date().toISOString().split('T')[0]
  });
  const [invoiceNo, setInvoiceNo] = useState('Generating...');

  useEffect(() => {
    if (defaultCustomerId) {
      setFormData(prev => ({ ...prev, customer_id: defaultCustomerId }));
    }
    fetch('http://localhost:3000/api/invoices', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const count = data.length + 1;
        setInvoiceNo(`INV-${String(count).padStart(4, '0')}`);
      })
      .catch(err => setInvoiceNo('INV-XXXX (Error)'));
  }, [defaultCustomerId, token]);

  useEffect(() => {
    const calculateTotal = () => {
      const fields = ['shipping_towing', 'attestation', 'duty', 'bill', 'vat', 'clearing', 'lifter'];
      const total = fields.reduce((sum, field) => {
        const value = parseFloat(formData[field]) || 0;
        return sum + value;
      }, 0);
      setFormData(prev => ({ ...prev, total_amount: total }));
    };
    calculateTotal();
  }, [
    formData.shipping_towing,
    formData.attestation,
    formData.duty,
    formData.bill,
    formData.vat,
    formData.clearing,
    formData.lifter
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmMessage('Are you sure you want to add this invoice?');
    setConfirmAction(() => () => {
      fetch('http://localhost:3000/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          shipping_towing: parseFloat(formData.shipping_towing) || 0,
          attestation: parseFloat(formData.attestation) || 0,
          duty: parseFloat(formData.duty) || 0,
          bill: parseFloat(formData.bill) || 0,
          vat: parseFloat(formData.vat) || 0,
          clearing: parseFloat(formData.clearing) || 0,
          lifter: parseFloat(formData.lifter) || 0,
          total_amount: parseFloat(formData.total_amount) || 0
        })
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to add invoice');
          return res.json();
        })
        .then(() => {
          fetch('http://localhost:3000/api/invoices', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => {
              setInvoices(data);
              setIsInvoiceModalOpen(false);
            });
        })
        .catch(err => console.error(err));
      setConfirmModalOpen(false);
    });
    setConfirmModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Invoice</h2>
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice No</label>
            <input
              type="text"
              value={invoiceNo}
              className="w-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
              disabled={!!defaultCustomerId}
            >
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Container No</label>
            <input
              type="text"
              name="container_no"
              value={formData.container_no}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Container Invoice No</label>
            <input
              type="text"
              name="container_invoice_no"
              value={formData.container_invoice_no}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Car Details</label>
            <input
              type="text"
              name="car_details"
              value={formData.car_details}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">VIN No</label>
            <input
              type="text"
              name="vin_no"
              value={formData.vin_no}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shipping/Towing</label>
            <input
              type="number"
              name="shipping_towing"
              value={formData.shipping_towing}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attestation</label>
            <input
              type="number"
              name="attestation"
              value={formData.attestation}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duty</label>
            <input
              type="number"
              name="duty"
              value={formData.duty}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bill</label>
            <input
              type="number"
              name="bill"
              value={formData.bill}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">VAT</label>
            <input
              type="number"
              name="vat"
              value={formData.vat}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Clearing</label>
            <input
              type="number"
              name="clearing"
              value={formData.clearing}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lifter</label>
            <input
              type="number"
              name="lifter"
              value={formData.lifter}
              onChange={handleChange}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount.toFixed(2)}
              className="w-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              disabled
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Add Invoice
          </button>
          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default InvoiceModal;