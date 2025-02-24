function Sidebar({ currentView, setCurrentView, toggleDarkMode, handleLogout, isSidebarOpen, toggleSidebar, darkMode, username, userRole }) {
  return (
    <div className={`w-64 bg-gray-800 dark:bg-gray-950 text-white p-6 fixed h-full shadow-lg overflow-y-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300`}>
      <div className="text-2xl font-bold mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3zm2 2v14h14V5H5z" />
        </svg>
        Vehicle Invoices
      </div>
      <div className="mb-6">
        <p className="text-sm text-gray-300">Logged in as:</p>
        <p className="text-lg font-semibold">{username} <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">{userRole}</span></p>
      </div>
      <nav>
        <ul>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${currentView === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => { setCurrentView('dashboard'); toggleSidebar(); }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M12 3v18" />
              </svg>
              Dashboard
            </div>
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${currentView === 'customers' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => { setCurrentView('customers'); toggleSidebar(); }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Customers
            </div>
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${currentView === 'invoices' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => { setCurrentView('invoices'); toggleSidebar(); }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
              Invoices
            </div>
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${currentView === 'payments' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => { setCurrentView('payments'); toggleSidebar(); }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              Payments
            </div>
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${currentView === 'reports' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => { setCurrentView('reports'); toggleSidebar(); }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Reports
            </div>
          </li>
          <li
            className={`py-2 px-4 rounded-lg cursor-pointer transition ${currentView === 'transactions' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            onClick={() => { setCurrentView('transactions'); toggleSidebar(); }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
              All Transactions
            </div>
          </li>
          {userRole === 'admin' && (
            <li
              className={`py-2 px-4 rounded-lg cursor-pointer transition ${currentView === 'history' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => { setCurrentView('history'); toggleSidebar(); }}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </div>
            </li>
          )}
          {userRole === 'admin' && (
            <li
              className={`py-2 px-4 rounded-lg cursor-pointer transition ${currentView === 'bulk-upload' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => { setCurrentView('bulk-upload'); toggleSidebar(); }}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Bulk Upload
              </div>
            </li>
          )}
          <li
            className="py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-700 transition"
            onClick={() => { handleLogout(); toggleSidebar(); }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </div>
          </li>
        </ul>
      </nav>
      <button
        onClick={toggleDarkMode}
        className="w-full bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-lg mt-4 transition flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
        Toggle Dark Mode
      </button>
    </div>
  );
}

export default Sidebar;