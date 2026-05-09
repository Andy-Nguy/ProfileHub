import React from 'react';

export interface EndorsementButtonProps {
  count?: number;
  isEndorsed?: boolean;
  onClick?: () => void;
  className?: string;
}

export const EndorsementButton: React.FC<EndorsementButtonProps> = ({ 
  count = 0, 
  isEndorsed = false, 
  onClick, 
  className = '' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-label-lg text-label-lg transition-all duration-300 relative overflow-hidden group
      ${isEndorsed 
        ? 'bg-primary-container text-on-primary-container hover:bg-primary-fixed' 
        : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
      } ${className}`}
    >
      <span 
        className="material-symbols-outlined text-sm" 
        style={{ fontVariationSettings: isEndorsed ? "'FILL' 1" : "'FILL' 0" }}
      >
        verified
      </span>
      <span>{count > 0 ? count : 'Endorse'}</span>
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 bg-on-surface opacity-0 group-active:opacity-10 transition-opacity"></span>
    </button>
  );
};
