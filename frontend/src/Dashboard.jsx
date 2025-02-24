import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard({ customers, invoices, payments, selectedCustomer, setSelectedCustomer, searchQuery, setSearchQuery, dateFilter, setDateFilter, setCurrentView, darkMode, formatDate }) {
  const totalInvoices = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const totalPayments = payments.reduce((sum, pay) => sum + (pay.amount_received || 0), 0);
  const totalBalance = totalInvoices - totalPayments;

  const filteredInvoices = invoices.filter(item =>
    (!selectedCustomer || item.customer_id === selectedCustomer) &&
    (item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (item.invoice_no && item.invoice_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
     item.car_details.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.vin_no.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!dateFilter || item.date?.startsWith(dateFilter))
  );

  const filteredPayments = payments.filter(item =>
    (!selectedCustomer || item.customer_id === selectedCustomer) &&
    (customers.find(c => c.customer_id === item.customer_id)?.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (item.received_by && item.received_by.toLowerCase().includes(searchQuery.toLowerCase()))) &&
    (!dateFilter || item.date?.startsWith(dateFilter))
  );

  const chartData = {
    labels: ['Total Invoices', 'Total Payments', 'Total Balance'],
    datasets: [{
      label: 'Financial Overview ($)',
      data: [totalInvoices, totalPayments, totalBalance],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',  // Blue for Invoices
        'rgba(75, 192, 192, 0.8)',  // Teal for Payments
        'rgba(255, 99, 132, 0.8)'   // Red for Balance
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 2,
      borderRadius: 8, // Rounded bars
      barThickness: 40 // Slimmer bars
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom height
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151', // Gray-200 or Gray-700
          font: { size: 14, weight: 'bold' }
        }
      },
      title: {
        display: true,
        text: 'Financial Snapshot',
        color: darkMode ? '#ffffff' : '#1f2937', // White or Gray-800
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: darkMode ? '#d1d5db' : '#6b7280' }, // Gray-300 or Gray-500
        grid: { color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
      },
      x: {
        ticks: { color: darkMode ? '#d1d5db' : '#6b7280' },
        grid: { display: false }
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M12 3v18" />
        </svg>
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Invoices</h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalInvoices.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Payments</h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalPayments.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Balance</h2>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalBalance.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6 h-64"> {/* Fixed height */}
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-col sm:flex-row">
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
            placeholder="Search Transactions"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Invoices</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-700 dark:bg-gray-900 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.slice(0, 5).map((invoice, index) => (
                  <tr key={invoice.invoice_id} className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                    <td className="py-3 px-4">{invoice.customer_name}</td>
                    <td className="py-3 px-4">${(invoice.total_amount || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-700 dark:bg-gray-900 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.slice(0, 5).map((payment, index) => (
                  <tr key={payment.payment_id} className={`transition ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} hover:bg-gray-100 dark:hover:bg-gray-600`}>
                    <td className="py-3 px-4">{customers.find(c => c.customer_id === payment.customer_id)?.customer_name}</td>
                    <td className="py-3 px-4">${(payment.amount_received || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">{formatDate(payment.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;