const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-xl text-center">
          <h2 className="text-xl font-semibold mb-4">{message}</h2>
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="bg-gray-300  font-semibold cursor-pointer px-6 py-2 rounded-full hover:bg-gray-400 transition-all duration-300 ease-in-out"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-[var(--bg-color)] font-semibold  cursor-pointer text-white px-6 py-2 rounded-full hover:bg-[#F78BD8] transition-all duration-300 ease-in-out"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;
  