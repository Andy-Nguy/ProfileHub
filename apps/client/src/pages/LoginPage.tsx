import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLogin } from '../hooks/useApi';
import { setStoredAuthSession } from '../services/auth-session.service';
import { Button } from '../components/shared/Button';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setStoredAuthSession({
            accessToken: data.accessToken,
            user: {
              ...data.user,
              displayName: data.user?.displayName ?? data.user?.username,
            },
          });
          navigate('/');
        },
        onError: (err: any) => {
          setError(err.message || 'Login failed. Please try again.');
        },
      },
    );
  };

  return (
    <div className="bg-surface text-on-surface h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full">
        {/* Left Side: Branding & Value Prop */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-primary-container text-on-primary p-gutter relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <motion.div
            className="z-10 max-w-md text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="material-symbols-outlined text-[80px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hub
            </span>
            <h1 className="font-display-lg text-display-lg text-on-primary font-bold">
              Welcome to ProHub
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary opacity-80 leading-relaxed">
              Log in to access your professional dashboard, connect with experts, and showcase your
              growth.
            </p>
          </motion.div>
          <div className="absolute bottom-margin-desktop left-margin-desktop">
            <p className="font-label-lg text-label-lg font-bold tracking-widest opacity-60">
              PROHUB © 2024
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex w-full lg:w-1/2 justify-center items-center bg-surface p-margin-desktop md:p-12 overflow-y-auto">
          <motion.div
            className="w-full max-w-md space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Header */}
            <div className="space-y-unit text-center lg:text-left">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Sign In
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Enter your credentials to continue your journey.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6 mt-8" onSubmit={handleLogin}>
              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="relative group">
                <label
                  className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-primary transition-all group-focus-within:text-primary"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full bg-surface border-2 border-primary rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label
                  className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-on-surface-variant group-focus-within:text-primary transition-all"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full bg-surface border border-outline rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all pr-12"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              <div className="flex justify-end">
                <a
                  className="font-label-lg text-label-lg text-primary hover:underline transition-colors"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full justify-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg py-4 px-6 rounded-full hover:bg-surface-tint shadow-sm elevation-1 hover:shadow-md transition-all duration-200"
                isLoading={loginMutation.isPending}
                loadingText="Signing In..."
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center space-x-4 my-8">
              <div className="flex-1 border-t border-outline-variant"></div>
              <span className="font-label-lg text-label-lg text-on-surface-variant">
                or continue with
              </span>
              <div className="flex-1 border-t border-outline-variant"></div>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className="w-full flex items-center justify-center gap-3 border border-outline-variant bg-surface text-on-surface font-label-lg text-label-lg py-3 px-4 rounded-full hover:bg-surface-container-high transition-colors"
                type="button"
              >
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                />
                <span>Google</span>
              </button>
              <button
                className="w-full flex items-center justify-center gap-3 border border-outline-variant bg-surface text-on-surface font-label-lg text-label-lg py-3 px-4 rounded-full hover:bg-surface-container-high transition-colors"
                type="button"
              >
                <img
                  alt="GitHub"
                  className="w-5 h-5 filter dark:invert"
                  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                />
                <span>GitHub</span>
              </button>
            </div>

            {/* Registration Link */}
            <p className="text-center font-body-lg text-body-lg text-on-surface-variant mt-8">
              New to ProHub?{' '}
              <Link className="text-primary hover:underline font-bold" to="/register">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
