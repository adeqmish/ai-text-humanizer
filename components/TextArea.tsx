import React from 'react';

interface TextAreaProps {
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  className?: string;
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  rows = 10,
  className = '',
  label,
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="block text-textPrimary text-xl font-semibold mb-3">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        className={`
          w-full p-5 border border-gray-200 rounded-xl shadow-md transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 focus:border-transparent
          bg-white text-textPrimary text-lg resize-vertical
          ${readOnly ? 'bg-gray-50 cursor-text' : ''}
          ${className}
        `}
      ></textarea>
    </div>
  );
};

export default TextArea;