import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Customers from './Customers';
import Invoices from './Invoices';
import Payments from './Payments';
import Reports from './Reports';
import Sidebar from './Sidebar';
import InvoiceModal from './InvoiceModal';
import EditInvoiceModal from './EditInvoiceModal';
import PaymentModal from './PaymentModal';
import EditPaymentModal from './EditPaymentModal';
import CustomerModal from './CustomerModal';
import CustomerInvoices from './CustomerInvoices';
import Transactions from './Transactions';
import AddCustomerModal from './AddCustomerModal';
import EditCustomerModal from './EditCustomerModal';
import ConfirmModal from './ConfirmModal';
import History from './History';
import BulkUpload from './BulkUpload';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [deletedInvoices, setDeletedInvoices] = useState([]);
  const [deletedPayments, setDeletedPayments] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [currentView, setCurrentView] = useState(token ? 'dashboard' : 'login');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);
  const [editPayment, setEditPayment] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [reportDateRange, setReportDateRange] = useState({ start: '', end: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState({ customers: 1, invoices: 1, payments: 1 });

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  const getCustomerBalance = (customerId) => {
    const customerInvoices = invoices.filter(inv => inv.customer_id === customerId);
    const customerPayments = payments.filter(pay => pay.customer_id === customerId);
    const invTotal = customerInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
    const payTotal = customerPayments.reduce((sum, pay) => sum + (pay.amount_received || 0), 0);
    return invTotal - payTotal;
  };

  const handleLogin = (newToken) => {
    console.log('Login with token:', newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    const decoded = jwtDecode(newToken);
    setUserRole(decoded.role);
    setUsername(decoded.username);
    setCurrentView('dashboard');
    navigate('/dashboard');
    setLoading(true);
  };

  const handleRegister = (newToken) => {
    console.log('Register with token:', newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    const decoded = jwtDecode(newToken);
    setUserRole(decoded.role);
    setUsername(decoded.username);
    setCurrentView('dashboard');
    navigate('/dashboard');
    setLoading(true);
  };

  const handleLogout = () => {
    console.log('Logging out');
    setToken(null);
    setUserRole(null);
    setUsername(null);
    localStorage.removeItem('token');
    setCustomers([]);
    setInvoices([]);
    setPayments([]);
    setDeletedInvoices([]);
    setDeletedPayments([]);
    setError(null);
    setCurrentView('login');
    setIsSidebarOpen(false);
    navigate('/');
  };

  const handlePageChange = (pageKey, page) => {
    setCurrentPage(prev => ({ ...prev, [pageKey]: page }));
  };

  const handleDeleteInvoice = (invoiceId) => {
    setConfirmMessage('Are you sure you want to delete this invoice?');
    setConfirmAction(() => () => {
      fetch(`http://localhost:3000/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to delete invoice');
          return res.json();
        })
        .then(() => {
          fetch('http://localhost:3000/api/invoices', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => setInvoices(data));
          fetch('http://localhost:3000/api/deleted_invoices', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => setDeletedInvoices(data));
        })
        .catch(err => setError(err.message));
      setIsConfirmModalOpen(false);
    });
    setIsConfirmModalOpen(true);
  };

  const handleDeletePayment = (paymentId) => {
    setConfirmMessage('Are you sure you want to delete this payment?');
    setConfirmAction(() => () => {
      fetch(`http://localhost:3000/api/payments/${paymentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to delete payment');
          return res.json();
        })
        .then(() => {
          fetch('http://localhost:3000/api/payments', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => setPayments(data));
          fetch('http://localhost:3000/api/deleted_payments', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(data => setDeletedPayments(data));
        })
        .catch(err => setError(err.message));
      setIsConfirmModalOpen(false);
    });
    setIsConfirmModalOpen(true);
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomerDetails(customer);
    setIsCustomerModalOpen(true);
  };

  const handleCustomerInvoicesClick = (customerId) => {
    navigate(`/customer-invoices/${customerId}`);
  };

  useEffect(() => {
    console.log('Token:', token);
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetch('http://localhost:3000/api/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        console.log('Customers response:', res.status, res.statusText);
        if (!res.ok) throw new Error(`Failed to fetch customers: ${res.status} ${res.statusText}`);
        return res.json();
      }),
      fetch('http://localhost:3000/api/invoices', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        console.log('Invoices response:', res.status, res.statusText);
        if (!res.ok) throw new Error(`Failed to fetch invoices: ${res.status} ${res.statusText}`);
        return res.json();
      }),
      fetch('http://localhost:3000/api/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        console.log('Payments response:', res.status, res.statusText);
        if (!res.ok) throw new Error(`Failed to fetch payments: ${res.status} ${res.statusText}`);
        return res.json();
      }),
      fetch('http://localhost:3000/api/deleted_invoices', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        if (!res.ok && res.status !== 403) throw new Error(`Failed to fetch deleted invoices: ${res.status}`);
        return res.status === 403 ? [] : res.json();
      }),
      fetch('http://localhost:3000/api/deleted_payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        if (!res.ok && res.status !== 403) throw new Error(`Failed to fetch deleted payments: ${res.status}`);
        return res.status === 403 ? [] : res.json();
      })
    ])
      .then(([customersData, invoicesData, paymentsData, deletedInvoicesData, deletedPaymentsData]) => {
        console.log('Fetch success - Customers:', customersData.length, 'Invoices:', invoicesData.length, 'Payments:', paymentsData.length);
        setCustomers(customersData);
        setInvoices(invoicesData);
        setPayments(paymentsData);
        setDeletedInvoices(deletedInvoicesData);
        setDeletedPayments(deletedPaymentsData);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        console.error('Fetch failed:', err.message);
        setError(err.message.replace('fatch', 'fetch'));
        setLoading(false);
        if (err.message.includes('401') || err.message.includes('403')) {
          console.log('Invalid token detected, logging out...');
          handleLogout();
        }
      });
  }, [token]);

  useEffect(() => {
    if (token && !userRole) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
        setUsername(decoded.username);
        navigate('/dashboard');
      } catch (err) {
        console.error('Token decode failed:', err.message);
        handleLogout();
      }
    }
  }, [token, navigate]);

  if (loading && token) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <p className="text-gray-700 dark:text-gray-300 text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={() => {
              console.log('Logout and Retry clicked');
              handleLogout();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
          >
            Logout and Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {!token ? (
        <div className="min-h-screen flex flex-col items-center justify-center">
          {currentView === 'login' && (
            <div className="flex flex-col items-center">
              <Login onLogin={handleLogin} />
              <button
                onClick={() => {
                  console.log('Switching to register');
                  setCurrentView('register');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 underline"
              >
                Don’t have an account? Register
              </button>
            </div>
          )}
          {currentView === 'register' && (
            <div className="flex flex-col items-center">
              <Register onRegister={handleRegister} />
              <button
                onClick={() => {
                  console.log('Switching to login');
                  setCurrentView('login');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 underline"
              >
                Already have an account? Login
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex">
          <Sidebar
            currentView={currentView}
            setCurrentView={(view) => {
              setCurrentView(view);
              navigate(`/${view}`);
            }}
            toggleDarkMode={() => { setDarkMode(!darkMode); localStorage.setItem('darkMode', !darkMode); }}
            handleLogout={handleLogout}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            darkMode={darkMode}
            username={username}
            userRole={userRole}
          />
          <div className={`flex-1 ml-0 md:ml-64 p-6 transition-all duration-300`}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden mb-4 p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard
                  customers={customers}
                  invoices={invoices}
                  payments={payments}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  setCurrentView={setCurrentView}
                  darkMode={darkMode}
                  formatDate={formatDate}
                />} />
                <Route path="/dashboard" element={<Dashboard
                  customers={customers}
                  invoices={invoices}
                  payments={payments}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  dateFilter={dateFilter}
                  setDateFilter={setDateFilter}
                  setCurrentView={setCurrentView}
                  darkMode={darkMode}
                  formatDate={formatDate}
                />} />
                <Route path="/customers" element={
                  <Customers
                    customers={customers}
                    invoices={invoices}
                    payments={payments}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    handleCustomerClick={handleCustomerClick}
                    handleCustomerInvoicesClick={handleCustomerInvoicesClick}
                    setIsAddCustomerModalOpen={setIsAddCustomerModalOpen}
                    setEditCustomer={setEditCustomer}
                    setIsEditCustomerModalOpen={setIsEditCustomerModalOpen}
                    darkMode={darkMode}
                    getCustomerBalance={getCustomerBalance}
                  />
                } />
                <Route path="/customer-invoices/:customerId" element={
                  <CustomerInvoices
                    customers={customers}
                    invoices={invoices}
                    token={token}
                    setInvoices={setInvoices}
                    darkMode={darkMode}
                    formatDate={formatDate}
                    userRole={userRole}
                    setEditInvoice={setEditInvoice}
                    setIsEditInvoiceModalOpen={setIsEditInvoiceModalOpen}
                    handleDeleteInvoice={handleDeleteInvoice}
                  />
                } />
                <Route path="/invoices" element={
                  <Invoices
                    customers={customers}
                    invoices={invoices}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    setIsInvoiceModalOpen={setIsInvoiceModalOpen}
                    setEditInvoice={setEditInvoice}
                    setIsEditInvoiceModalOpen={setIsEditInvoiceModalOpen}
                    handleDeleteInvoice={handleDeleteInvoice}
                    darkMode={darkMode}
                    formatDate={formatDate}
                    userRole={userRole}
                  />
                } />
                <Route path="/payments" element={
                  <Payments
                    customers={customers}
                    payments={payments}
                    selectedCustomer={selectedCustomer}
                    setSelectedCustomer={setSelectedCustomer}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    setIsPaymentModalOpen={setIsPaymentModalOpen}
                    setEditPayment={setEditPayment}
                    setIsEditPaymentModalOpen={setIsEditPaymentModalOpen}
                    handleDeletePayment={handleDeletePayment}
                    darkMode={darkMode}
                    formatDate={formatDate}
                    userRole={userRole}
                  />
                } />
                <Route path="/reports" element={
                  <Reports
                    customers={customers}
                    invoices={invoices}
                    payments={payments}
                    reportDateRange={reportDateRange}
                    setReportDateRange={setReportDateRange}
                    darkMode={darkMode}
                    formatDate={formatDate}
                  />
                } />
                <Route path="/transactions" element={
                  <Transactions
                    invoices={invoices}
                    payments={payments}
                    customers={customers}
                    darkMode={darkMode}
                    formatDate={formatDate}
                  />
                } />
                <Route path="/history" element={
                  <History
                    deletedInvoices={deletedInvoices}
                    deletedPayments={deletedPayments}
                    darkMode={darkMode}
                    formatDate={formatDate}
                    userRole={userRole}
                  />
                } />
                <Route path="/bulk-upload" element={
                  <BulkUpload
                    token={token}
                    darkMode={darkMode}
                    userRole={userRole}
                  />
                } />
              </Routes>
            </div>
          </div>

          {isInvoiceModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <InvoiceModal
                  customers={customers}
                  token={token}
                  setIsInvoiceModalOpen={setIsInvoiceModalOpen}
                  setInvoices={setInvoices}
                  darkMode={darkMode}
                  setConfirmModalOpen={setIsConfirmModalOpen}
                  setConfirmMessage={setConfirmMessage}
                  setConfirmAction={setConfirmAction}
                />
              </div>
            </div>
          )}
          {isEditInvoiceModalOpen && editInvoice && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <EditInvoiceModal
                  customers={customers}
                  editInvoice={editInvoice}
                  token={token}
                  setIsEditInvoiceModalOpen={setIsEditInvoiceModalOpen}
                  setInvoices={setInvoices}
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}
          {isCustomerModalOpen && selectedCustomerDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <CustomerModal
                  selectedCustomerDetails={selectedCustomerDetails}
                  invoices={invoices}
                  payments={payments}
                  setIsCustomerModalOpen={setIsCustomerModalOpen}
                  setIsInvoiceModalOpen={setIsInvoiceModalOpen}
                  darkMode={darkMode}
                  formatDate={formatDate}
                  getCustomerBalance={getCustomerBalance}
                />
              </div>
            </div>
          )}
          {isPaymentModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <PaymentModal
                  customers={customers}
                  token={token}
                  setIsPaymentModalOpen={setIsPaymentModalOpen}
                  setPayments={setPayments}
                  darkMode={darkMode}
                  setConfirmModalOpen={setIsConfirmModalOpen}
                  setConfirmMessage={setConfirmMessage}
                  setConfirmAction={setConfirmAction}
                />
              </div>
            </div>
          )}
          {isEditPaymentModalOpen && editPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <EditPaymentModal
                  customers={customers}
                  editPayment={editPayment}
                  token={token}
                  setIsEditPaymentModalOpen={setIsEditPaymentModalOpen}
                  setPayments={setPayments}
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}
          {isAddCustomerModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                <AddCustomerModal
                  token={token}
                  setIsAddCustomerModalOpen={setIsAddCustomerModalOpen}
                  setCustomers={setCustomers}
                  darkMode={darkMode}
                  setConfirmModalOpen={setIsConfirmModalOpen}
                  setConfirmMessage={setConfirmMessage}
                  setConfirmAction={setConfirmAction}
                />
              </div>
            </div>
          )}
          {isEditCustomerModalOpen && editCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                <EditCustomerModal
                  customer={editCustomer}
                  token={token}
                  setIsEditCustomerModalOpen={setIsEditCustomerModalOpen}
                  setCustomers={setCustomers}
                  darkMode={darkMode}
                  setConfirmModalOpen={setIsConfirmModalOpen}
                  setConfirmMessage={setConfirmMessage}
                  setConfirmAction={setConfirmAction}
                />
              </div>
            </div>
          )}
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={confirmAction}
            message={confirmMessage}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  );
}

export default App;