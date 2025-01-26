// frontend/src/components/common/Input.tsx
import { FC } from 'react';
import { InputProps } from '@/types/components';
import { cn } from '@/lib/utils';

export const Input: FC<InputProps> = ({
  label,
  name,
  type = 'text',
  error,
  placeholder,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="space-y-1">
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn(
          "w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          disabled && "bg-gray-100 cursor-not-allowed",
          error && "border-red-500 focus:ring-red-500"
        )}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};