import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled = false, loading = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 ease-in-out
        bg-buttonPrimary hover:bg-buttonPrimaryHover
        disabled:bg-gray-400 disabled:cursor-not-allowed
        flex items-center justify-center
        shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
        focus:outline-none focus:ring-4 focus:ring-buttonPrimary focus:ring-opacity-50
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;