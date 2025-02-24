function ConfirmModal({ isOpen, onClose, onConfirm, message, darkMode }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform transition-all duration-300 scale-95 animate-modal-in">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{message}</h3>
          <div className="flex gap-4">
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition w-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Confirm
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ConfirmModal;