import React from 'react';
import { motion } from 'framer-motion';
import { SideNav } from '../components/layout/SideNav';
import { AppFooter } from '../components/layout/AppFooter';

interface ComingSoonPageProps {
  title: string;
  icon: string;
  description?: string;
}

/**
 * A professional placeholder page for features under development.
 * Uses the standard SideNav layout for a consistent dashboard experience.
 */
export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ 
  title, 
  icon, 
  description = "We're currently building this feature to provide you with the best professional experience. Stay tuned for updates!" 
}) => {
  return (
    <>
      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center bg-surface py-[32px] px-[16px] md:px-gutter">
          <motion.div 
            className="max-w-md w-full text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Icon Circle */}
            <div className="mx-auto w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-8 shadow-sm">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
              </span>
            </div>

            {/* Content */}
            <h1 className="font-display-lg text-display-lg font-bold text-on-background">
              {title}
            </h1>
            
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {description}
            </p>

            {/* Action */}
            <div className="pt-8">
              <button 
                onClick={() => window.history.back()}
                className="bg-primary text-on-primary font-label-lg text-label-lg px-8 py-3 rounded-full hover:bg-surface-tint transition-all shadow-md flex items-center gap-2 mx-auto"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Go Back
              </button>
            </div>
          </motion.div>
        </div>

        <AppFooter variant="compact" />
      </main>
    </>
  );
};
