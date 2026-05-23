import React, { useState } from 'react';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  description?: string;
  badge?: string;       // e.g. "Internship", "Full-time"
  location?: string;    // e.g. "Ho Chi Minh City"
  logoUrl?: string;     // company/institution logo
  onEdit?: () => void;
}

export interface TimelineSectionProps {
  title: string;
  icon?: string;
  items: TimelineItem[];
  onAdd?: () => void;
  className?: string;
}

const EMPLOYMENT_TYPE_COLORS: Record<string, string> = {
  internship:   'bg-amber-100 text-amber-700 border-amber-200',
  full_time:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  part_time:    'bg-blue-100 text-blue-700 border-blue-200',
  contract:     'bg-purple-100 text-purple-700 border-purple-200',
  freelance:    'bg-indigo-100 text-indigo-700 border-indigo-200',
  volunteer:    'bg-rose-100 text-rose-700 border-rose-200',
};

function formatBadgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    full_time:  'Full-time',
    part_time:  'Part-time',
    contract:   'Contract',
    freelance:  'Freelance',
    internship: 'Internship',
    volunteer:  'Volunteer',
  };
  return labels[badge] ?? badge;
}

const TimelineItemCard: React.FC<{ item: TimelineItem; isLast: boolean }> = ({ item, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const needsExpansion = (item.description?.length ?? 0) > 220;
  const badgeClass = item.badge ? (EMPLOYMENT_TYPE_COLORS[item.badge.toLowerCase()] ?? 'bg-surface-container text-on-surface-variant border-outline-variant') : '';

  return (
    <div className="relative flex gap-4 group">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div className="w-10 h-10 rounded-full bg-surface border-2 border-primary/30 flex items-center justify-center flex-shrink-0 z-10 group-hover:border-primary transition-colors duration-200 overflow-hidden shadow-sm">
          {item.logoUrl ? (
            <img src={item.logoUrl} alt={item.subtitle} className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-xs">
                {item.subtitle.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        {/* Vertical line */}
        {!isLast && (
          <div className="w-px flex-1 bg-outline-variant/40 mt-1" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-on-surface text-[15px] leading-snug">{item.title}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm text-on-surface-variant font-medium">{item.subtitle}</span>
              {item.badge && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                  {formatBadgeLabel(item.badge)}
                </span>
              )}
            </div>
          </div>
          {/* Edit button */}
          {item.onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); item.onEdit?.(); }}
              className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
              aria-label={`Edit ${item.title}`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
            </button>
          )}
        </div>

        {/* Date + Location */}
        <div className="flex flex-wrap items-center gap-3 mt-1.5">
          <span className="text-xs text-on-surface-variant/70 font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: '13px' }}>calendar_today</span>
            {item.dateRange}
          </span>
          {item.location && (
            <span className="text-xs text-on-surface-variant/70 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-on-surface-variant/50" style={{ fontSize: '13px' }}>location_on</span>
              {item.location}
            </span>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <div className="mt-3">
            <p className={`text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap ${!expanded && needsExpansion ? 'line-clamp-3' : ''}`}>
              {item.description}
            </p>
            {needsExpansion && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1.5 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors"
              >
                {expanded ? 'Show less' : 'Show more'}
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  {expanded ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  title,
  icon = 'work',
  items,
  onAdd,
  className = '',
}) => {
  return (
    <section className={`bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden ${className}`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      {/* Section header */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-surface-variant/60">
        <h3 className="font-semibold text-on-surface text-base flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>{icon}</span>
          {title}
          {items.length > 0 && (
            <span className="ml-1 text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </h3>
        {onAdd && (
          <button
            onClick={onAdd}
            className="text-primary hover:bg-primary-fixed rounded-full p-2 transition-colors flex items-center"
            aria-label={`Add new ${title.toLowerCase()} item`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          </button>
        )}
      </div>

      {/* Timeline items */}
      <div className="px-6 pt-5 pb-2">
        {items.length === 0 ? (
          <div className="py-8 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-on-surface-variant/30 mb-2" style={{ fontSize: '40px' }}>
              {icon === 'work' ? 'work_outline' : 'school'}
            </span>
            <p className="text-sm text-on-surface-variant/60">
              No {title.toLowerCase()} added yet
            </p>
            {onAdd && (
              <button
                onClick={onAdd}
                className="mt-3 text-sm font-medium text-primary hover:underline"
              >
                + Add {title.toLowerCase()}
              </button>
            )}
          </div>
        ) : (
          <div>
            {items.map((item, idx) => (
              <TimelineItemCard
                key={item.id}
                item={item}
                isLast={idx === items.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
