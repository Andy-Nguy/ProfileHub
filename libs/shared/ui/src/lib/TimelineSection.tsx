import React from 'react';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  description?: string;
  onEdit?: () => void;
}

export interface TimelineSectionProps {
  title: string;
  icon?: string;
  items: TimelineItem[];
  onAdd?: () => void;
  className?: string;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ 
  title, 
  icon = 'work', 
  items, 
  onAdd,
  className = ''
}) => {
  return (
    <section className={`bg-surface-container-lowest rounded-[16px] shadow-sm elevation-1 border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          {title}
        </h3>
        {onAdd && (
          <button 
            onClick={onAdd} 
            className="text-primary hover:bg-primary-fixed rounded-full p-2 transition-colors flex items-center"
            aria-label={`Add new ${title.toLowerCase()} item`}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="p-4 border border-outline-variant rounded-[12px] hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-title-lg text-title-lg text-on-surface">{item.title}</h4>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  {item.subtitle} • {item.dateRange}
                </p>
              </div>
              {item.onEdit && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onEdit?.();
                  }} 
                  className="text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Edit ${item.title}`}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              )}
            </div>
            {item.description && (
              <p className="font-body-lg text-body-lg text-on-surface-variant line-clamp-2 mt-2">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
