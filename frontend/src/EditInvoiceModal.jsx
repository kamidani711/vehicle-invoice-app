import { useState } from 'react';

function EditInvoiceModal({ customers, editInvoice, token, setIsEditInvoiceModalOpen, setInvoices, darkMode }) {
  const [formData, setFormData] = useState({
    customer_id: editInvoice.customer_id || '',
    invoice_no: editInvoice.invoice_no || '',
    container_no: editInvoice.container_no || '',
    car_details: editInvoice.car_details || '',
    vin_no: editInvoice.vin_no || '',
    shipping_towing: editInvoice.shipping_towing || '',
    attestation: editInvoice.attestation || '',
    duty: editInvoice.duty || '',
    bill: editInvoice.bill || '',
    vat: editInvoice.vat || '',
    clearing: editInvoice.clearing || '',
    lifter: editInvoice.lifter || '',
    total_amount: editInvoice.total_amount || '',
    date: editInvoice.date || new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update this invoice?')) return;
    fetch(`http://localhost:3000/api/invoices/${editInvoice.invoice_id}`, {
      method: 'PUT',
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
        if (!res.ok) throw new Error('Failed to update invoice');
        return res.json();
      })
      .then(() => {
        fetch('http://localhost:3000/api/invoices', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            setInvoices(data);
            setIsEditInvoiceModalOpen(false);
          });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Edit Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer</label>
          <select
            name="customer_id"
            value={formData.customer_id}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.customer_id} value={c.customer_id}>{c.customer_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invoice No</label>
          <input
            type="text"
            name="invoice_no"
            value={formData.invoice_no}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Container No</label>
          <input
            type="text"
            name="container_no"
            value={formData.container_no}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</label>
          <input
            type="number"
            name="total_amount"
            value={formData.total_amount}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
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
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Update Invoice
          </button>
          <button
            type="button"
            onClick={() => setIsEditInvoiceModalOpen(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditInvoiceModal;