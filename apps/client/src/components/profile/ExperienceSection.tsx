import React from 'react';

export interface ExperienceItem {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  description?: string;
}

interface ExperienceSectionProps {
  items?: ExperienceItem[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  items = [
    {
      id: 'exp1',
      title: 'Lead Designer',
      subtitle: 'TechCorp Inc.',
      dateRange: '2020 - Present',
      description:
        'Leading design initiatives for enterprise software solutions, focusing on scalable design systems and improving overall user retention through intuitive UX.',
    },
  ],
  onAdd,
  onEdit,
}) => {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-surface-variant p-6 hover:shadow-md transition-shadow duration-300"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.06)' }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">work</span>
          Experience
        </h3>
        <button
          onClick={onAdd}
          className="text-primary hover:bg-primary-fixed rounded-full p-2 transition-colors flex items-center"
          aria-label="Add experience"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border border-outline-variant rounded-lg hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-title-lg text-title-lg text-on-surface">{item.title}</h4>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  {item.subtitle} • {item.dateRange}
                </p>
              </div>
              {onEdit && (
                <button
                  onClick={() => onEdit(item.id)}
                  className="text-outline hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Edit"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              )}
            </div>
            {item.description && (
              <p className="font-body-lg text-body-lg text-on-surface-variant line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
