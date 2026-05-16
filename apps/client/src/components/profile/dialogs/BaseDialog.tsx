import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BaseDialog: React.FC<BaseDialogProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto w-full md:max-w-2xl md:mx-4 bg-surface rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col"
              style={{ maxHeight: '92vh' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-outline-variant flex-shrink-0">
                <h2 className="font-title-lg text-title-lg text-on-surface font-bold">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
