
// frontend/src/components/forms/InputField.tsx
interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export const InputField = ({
    label,
    name,
    type = 'text',
    placeholder,
    error,
    required,
    value,
    onChange
  }: InputFieldProps) => {
    return (
      <div className="space-y-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            block w-full rounded-md border px-3 py-2 text-sm
            ${error ? 'border-red-300' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };
  