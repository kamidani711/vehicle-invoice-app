import { useState, useEffect } from 'react';

function PaymentModal({ customers, token, setIsPaymentModalOpen, setPayments, darkMode, setConfirmModalOpen, setConfirmMessage, setConfirmAction }) {
  const [formData, setFormData] = useState({
    customer_id: '',
    amount_received: '',
    received_by: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [paymentNo, setPaymentNo] = useState('Generating...');

  useEffect(() => {
    fetch('http://localhost:3000/api/payments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const count = data.length + 1;
        setPaymentNo(`PAY-${String(count).padStart(4, '0')}`);
      })
      .catch(err => setPaymentNo('PAY-XXXX (Error)'));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmMessage('Are you sure you want to add this payment?');
    setConfirmAction(() => () => {
      fetch('http://localhost:3000/api/payments', {
        method: 'POST',
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
          if (!res.ok) throw new Error('Failed to add payment');
          return res.json();
        })
        .then(() => {
          fetch('http://localhost:3000/api/payments', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => {
              setPayments(data);
              setIsPaymentModalOpen(false);
            });
        })
        .catch(err => console.error(err));
      setConfirmModalOpen(false);
    });
    setConfirmModalOpen(true);
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Payment</h2>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment No</label>
          <input
            type="text"
            value={paymentNo}
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
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Add Payment
          </button>
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PaymentModal;