import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const TopAppBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-surface shadow-sm flex justify-between items-center h-16 px-gutter w-full sticky top-0 z-50"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)' }}>
      <div className="flex items-center gap-4 w-full">
        {/* Mobile Menu Toggle (representation) */}
        <button className="md:hidden text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-all">
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Logo */}
        <Link to="/" className="font-title-lg text-title-lg font-bold text-primary md:ml-2">
          ProHub
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 ml-8">
          <Link
            to="/discovery"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
          >
            Discover
          </Link>
          <Link
            to="/network"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
          >
            Network
          </Link>
          <Link
            to="/resources"
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors py-4"
          >
            Resources
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-label-lg text-label-lg px-6 py-2 rounded-full hover:bg-surface-container-low transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-primary text-on-primary font-label-lg text-label-lg px-6 py-2 rounded-full hover:bg-surface-tint transition-colors shadow-sm"
            >
              Join Now
            </button>
          </div>
          {/* Mobile login icon for space saving */}
          <button 
            onClick={() => navigate('/login')}
            className="md:hidden text-primary p-2 hover:bg-surface-container-low rounded-full transition-all"
          >
            <span className="material-symbols-outlined">login</span>
          </button>
        </div>
      </div>
    </header>
  );
};
