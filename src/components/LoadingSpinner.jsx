const LoadingSpinner = () => {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-gray-800 bg-opacity-50 z-50">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <span className="absolute text-white text-xl mt-6">Loading models and camera...</span>
      </div>
    );
  };
  
  export default LoadingSpinner;
  