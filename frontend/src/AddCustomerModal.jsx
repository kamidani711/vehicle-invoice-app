import { useState } from 'react';

function AddCustomerModal({ token, setIsAddCustomerModalOpen, setCustomers, darkMode, setConfirmModalOpen, setConfirmMessage, setConfirmAction }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone_number: '',
    created_at: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmMessage('Are you sure you want to add this customer?');
    setConfirmAction(() => () => {
      fetch('http://localhost:3000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to add customer');
          return res.json();
        })
        .then(() => {
          fetch('http://localhost:3000/api/customers', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => {
              setCustomers(data);
              setIsAddCustomerModalOpen(false);
            });
        })
        .catch(err => console.error(err));
      setConfirmModalOpen(false);
    });
    setConfirmModalOpen(true);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add Customer</h2>
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
          <input
            type="date"
            name="created_at"
            value={formData.created_at}
            className="w-full bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 cursor-not-allowed"
            disabled
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
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
            Add Customer
          </button>
          <button
            type="button"
            onClick={() => setIsAddCustomerModalOpen(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition w-full"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomerModal;