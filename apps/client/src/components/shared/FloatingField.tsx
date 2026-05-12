import React from 'react';

interface FloatingFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'url';
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  bgClass?: string;
}

/**
 * Material Design 3 Floating Label Input Field
 */
export const FloatingField: React.FC<FloatingFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  defaultValue,
  onChange,
  className = '',
  bgClass = 'bg-surface-container-lowest',
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`block px-4 pb-2.5 pt-5 w-full text-body-lg text-on-surface bg-transparent rounded-lg border border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer`}
      />
      <label
        htmlFor={id}
        className={`absolute text-label-lg text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] ${bgClass} px-2
          peer-focus:px-2 peer-focus:text-primary
          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2
          peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4 left-2`}
      >
        {label}
      </label>
    </div>
  );
};

interface FloatingTextareaProps {
  id: string;
  label: string;
  rows?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  bgClass?: string;
}

export const FloatingTextarea: React.FC<FloatingTextareaProps> = ({
  id,
  label,
  rows = 4,
  value,
  defaultValue,
  onChange,
  className = '',
  bgClass = 'bg-surface-container-lowest',
}) => {
  return (
    <div className={`relative ${className}`}>
      <textarea
        id={id}
        placeholder=" "
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className="block px-4 pb-2.5 pt-5 w-full text-body-lg text-on-surface bg-transparent rounded-lg border border-outline appearance-none focus:outline-none focus:ring-0 focus:border-primary peer resize-none"
      />
      <label
        htmlFor={id}
        className={`absolute text-label-lg text-on-surface-variant duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] ${bgClass} px-2
          peer-focus:px-2 peer-focus:text-primary
          peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6
          peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-4 left-2`}
      >
        {label}
      </label>
    </div>
  );
};
