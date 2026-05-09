import React from 'react';

export interface M3CardProps {
  children: React.ReactNode;
  className?: string;
}

export const M3Card: React.FC<M3CardProps> = ({ children, className = '' }) => {
  return (
    <section 
      className={`bg-surface-container-lowest rounded-[16px] shadow-sm elevation-1 border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {children}
    </section>
  );
};
