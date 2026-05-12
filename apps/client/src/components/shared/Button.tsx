import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  loadingText,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`disabled:opacity-70 disabled:cursor-not-allowed flex items-center ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
