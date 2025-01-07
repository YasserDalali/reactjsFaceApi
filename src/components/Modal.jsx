import React, { useState } from 'react';

const ModalButton = ({ children, value, title, buttonStyle = 'default', className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const getButtonStyles = () => {
    if (buttonStyle === 'text') {
      return className || "text-blue-600 hover:text-blue-800 hover:underline";
    }
    return "py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700";
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className={getButtonStyles()}
      >
        {value}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
              <button
                type="button"
                onClick={toggleModal}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {React.cloneElement(children, { onClose: toggleModal })}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalButton;
