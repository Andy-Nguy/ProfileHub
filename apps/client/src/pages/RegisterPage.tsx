import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRegister, useVerifyEmail } from '../hooks/useApi';
import { Button } from '../components/shared/Button';
import { LanguageSwitcher } from '../components/shared/LanguageSwitcher';

export const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const registerMutation = useRegister();
  const verifyEmailMutation = useVerifyEmail();
  const { t } = useTranslation(['auth', 'common']);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    registerMutation.mutate(
      { username, email, password },
      {
        onSuccess: (data) => {
          setVerificationEmail(email);
          setOtp('');
          setIsOtpStep(true);
          setSuccessMessage(
            data?.message || 'Registration successful. Enter the code sent to your email.',
          );
        },
        onError: (err: any) => {
          setError(err.message || t('common:errorGeneric'));
        },
      },
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    verifyEmailMutation.mutate(
      { email: verificationEmail, code: otp },
      {
        onSuccess: (data) => {
          setSuccessMessage(
            data?.message || 'Email verified successfully. Redirecting to sign in...',
          );
          window.setTimeout(() => {
            navigate('/login');
          }, 1500);
        },
        onError: (err: any) => {
          setError(err.message || t('common:errorGeneric'));
        },
      },
    );
  };

  return (
    <div className="bg-surface text-on-surface h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full flex-row-reverse">
        {/* Right Side: Branding & Value Prop */}
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
              rocket_launch
            </span>
            <h1 className="font-display-lg text-display-lg text-on-primary font-bold">
              {t('auth:register.brandingHeading')}
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary opacity-80 leading-relaxed">
              {t('auth:register.brandingSubtitle')}
            </p>
          </motion.div>
          <div className="absolute bottom-margin-desktop right-margin-desktop">
            <p className="font-label-lg text-label-lg font-bold tracking-widest opacity-60">
              PROHUB © 2024
            </p>
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
            {/* Language switcher */}
            <div className="flex justify-end">
              <LanguageSwitcher />
            </div>

            {/* Header */}
            <div className="space-y-unit text-center lg:text-left">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {isOtpStep ? t('auth:otp.title') : t('auth:register.title')}
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                {isOtpStep
                  ? t('auth:otp.subtitle', { email: verificationEmail || email })
                  : t('auth:register.subtitle')}
              </p>
            </div>

            {/* Form */}
            <form
              className="space-y-6 mt-8"
              onSubmit={isOtpStep ? handleVerifyOtp : handleRegister}
            >
              {error && (
                <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="bg-primary-container text-on-primary-container p-3 rounded-lg text-sm font-medium">
                  {successMessage}
                </div>
              )}

              {!isOtpStep ? (
                <>
                  {/* Username Input */}
                  <div className="relative group">
                    <label
                      className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-on-surface-variant group-focus-within:text-primary transition-all"
                      htmlFor="username"
                    >
                      {t('auth:register.usernameLabel')}
                    </label>
                    <input
                      className="w-full bg-surface border border-outline rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all"
                      id="username"
                      placeholder={t('auth:register.usernamePlaceholder')}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative group">
                    <label
                      className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-primary transition-all group-focus-within:text-primary"
                      htmlFor="email"
                    >
                      {t('auth:register.emailLabel')}
                    </label>
                    <input
                      className="w-full bg-surface border-2 border-primary rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      id="email"
                      placeholder={t('auth:register.emailPlaceholder')}
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
                      {t('auth:register.passwordLabel')}
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

                  <Button
                    type="submit"
                    className="w-full justify-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg py-4 px-6 rounded-full hover:bg-surface-tint shadow-sm elevation-1 hover:shadow-md transition-all duration-200"
                    isLoading={registerMutation.isPending}
                    loadingText={t('auth:register.submittingButton')}
                  >
                    {t('auth:register.submitButton')}
                  </Button>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <div className="relative group">
                    <label
                      className="absolute -top-2.5 left-3 bg-surface px-1 font-label-lg text-label-lg text-primary transition-all group-focus-within:text-primary"
                      htmlFor="otp"
                    >
                      {t('auth:otp.codeLabel')}
                    </label>
                    <input
                      className="w-full bg-surface border-2 border-primary rounded-lg px-4 py-3 font-body-lg text-body-lg tracking-[0.4em] text-center text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      id="otp"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder={t('auth:otp.codePlaceholder')}
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full justify-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg py-4 px-6 rounded-full hover:bg-surface-tint shadow-sm elevation-1 hover:shadow-md transition-all duration-200"
                    disabled={otp.length !== 6}
                    isLoading={verifyEmailMutation.isPending}
                    loadingText={t('auth:otp.verifyingButton')}
                  >
                    {t('auth:otp.submitButton')}
                  </Button>
                </>
              )}
            </form>

            {isOtpStep && (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">
                <p className="font-medium text-on-surface">{t('auth:otp.needNewCode')}</p>
                <p className="mt-1">{t('auth:otp.checkInbox')}</p>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center space-x-4 my-8">
              <div className="flex-1 border-t border-outline-variant"></div>
              <span className="font-label-lg text-label-lg text-on-surface-variant">
                {t('common:orContinueWith')}
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

            {/* Login Link */}
            <p className="text-center font-body-lg text-body-lg text-on-surface-variant mt-8">
              {t('auth:register.alreadyHaveAccount')}{' '}
              <Link className="text-primary hover:underline font-bold" to="/login">
                {t('auth:register.signIn')}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
