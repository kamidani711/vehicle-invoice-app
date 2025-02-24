import { useState } from 'react';

function EditPaymentModal({ customers, editPayment, token, setIsEditPaymentModalOpen, setPayments, darkMode }) {
  const [formData, setFormData] = useState({
    customer_id: editPayment.customer_id || '',
    amount_received: editPayment.amount_received || '',
    received_by: editPayment.received_by || '',
    date: editPayment.date || new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update this payment?')) return;
    fetch(`http://localhost:3000/api/payments/${editPayment.payment_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...formData,
        amount_received: parseFloat(formData.amount_received) || 0
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update payment');
        return res.json();
      })
      .then(() => {
        fetch('http://localhost:3000/api/payments', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            setPayments(data);
            setIsEditPaymentModalOpen(false);
          });
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Edit Payment</h2>
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount Received</label>
          <input
            type="number"
            name="amount_received"
            value={formData.amount_received}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Received By</label>
          <input
            type="text"
            name="received_by"
            value={formData.received_by}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
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
            Update Payment
          </button>
          <button
            type="button"
            onClick={() => setIsEditPaymentModalOpen(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPaymentModal;