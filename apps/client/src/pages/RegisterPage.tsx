import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-surface text-on-surface h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full flex-row-reverse">
        {/* Right Side: Branding & Value Prop */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-primary-container text-on-primary p-gutter relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <motion.div 
            className="z-10 max-w-md text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              rocket_launch
            </span>
            <h1 className="font-display-lg text-display-lg text-on-primary font-bold">Start Your Journey</h1>
            <p className="font-body-lg text-body-lg text-on-primary opacity-80 leading-relaxed">
              Create your professional profile in minutes and start connecting with industry leaders around the globe.
            </p>
          </motion.div>
          <div className="absolute bottom-margin-desktop right-margin-desktop">
            <p className="font-label-lg text-label-lg font-bold tracking-widest opacity-60">PROHUB © 2024</p>
          </div>
        </div>

        {/* Left Side: Register Form */}
        <div className="flex w-full lg:w-1/2 justify-center items-center bg-surface p-margin-desktop md:p-12 overflow-y-auto">
          <motion.div 
            className="w-full max-w-md space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Header */}
            <div className="space-y-unit text-center lg:text-left">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Create Account</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Join a community of 5,000+ professionals today.</p>
            </div>

            {/* Form */}
            <form className="space-y-6 mt-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                {/* First Name Input */}
                <div className="relative group">
                  <label className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-on-surface-variant group-focus-within:text-primary transition-all" htmlFor="firstName">
                    First Name
                  </label>
                  <input 
                    className="w-full bg-surface border border-outline rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all" 
                    id="firstName" 
                    placeholder="John" 
                    type="text"
                  />
                </div>
                {/* Last Name Input */}
                <div className="relative group">
                  <label className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-on-surface-variant group-focus-within:text-primary transition-all" htmlFor="lastName">
                    Last Name
                  </label>
                  <input 
                    className="w-full bg-surface border border-outline rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all" 
                    id="lastName" 
                    placeholder="Doe" 
                    type="text"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-primary transition-all group-focus-within:text-primary" htmlFor="email">
                  Email Address
                </label>
                <input 
                  className="w-full bg-surface border-2 border-primary rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                  id="email" 
                  placeholder="name@company.com" 
                  type="email"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-on-surface-variant group-focus-within:text-primary transition-all" htmlFor="password">
                  Password
                </label>
                <input 
                  className="w-full bg-surface border border-outline rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all pr-12" 
                  id="password" 
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-primary transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button 
                className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 px-6 rounded-full hover:bg-surface-tint shadow-sm elevation-1 hover:shadow-md transition-all duration-200" 
                type="submit"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center space-x-4 my-8">
              <div className="flex-1 border-t border-outline-variant"></div>
              <span className="font-label-lg text-label-lg text-on-surface-variant">or continue with</span>
              <div className="flex-1 border-t border-outline-variant"></div>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="w-full flex items-center justify-center gap-3 border border-outline-variant bg-surface text-on-surface font-label-lg text-label-lg py-3 px-4 rounded-full hover:bg-surface-container-high transition-colors" 
                type="button"
              >
                <img alt="Google" className="w-5 h-5" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"/>
                <span>Google</span>
              </button>
              <button 
                className="w-full flex items-center justify-center gap-3 border border-outline-variant bg-surface text-on-surface font-label-lg text-label-lg py-3 px-4 rounded-full hover:bg-surface-container-high transition-colors" 
                type="button"
              >
                <img alt="GitHub" className="w-5 h-5 filter dark:invert" src="https://cdn-icons-png.flaticon.com/512/25/25231.png"/>
                <span>GitHub</span>
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center font-body-lg text-body-lg text-on-surface-variant mt-8">
              Already have an account? <Link className="text-primary hover:underline font-bold" to="/login">Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
