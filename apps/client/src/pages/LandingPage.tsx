import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppFooter } from '../components/layout/AppFooter';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop';

const FEATURES = [
  {
    icon: 'person_search',
    title: 'Dynamic Profiles',
    desc: 'Create rich, interactive portfolios that showcase your projects, skills, and professional narrative with precision.',
    color: 'bg-primary-container text-on-primary-container',
  },
  {
    icon: 'hub',
    title: 'Community Discovery',
    desc: 'Find and connect with industry leaders. Browse curated portfolios and build a network of high-caliber professionals.',
    color: 'bg-secondary-container text-on-secondary-container',
  },
  {
    icon: 'verified',
    title: 'Skill Endorsements',
    desc: 'Gain credibility through peer validations. Highlight verified skills with specialized accent badges on your profile.',
    color: 'bg-tertiary-container text-on-tertiary-container',
  },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center w-full">
        {/* ── Hero Section ──────────────────────────────── */}
        <section className="w-full max-w-[1280px] mx-auto px-gutter py-24 md:py-32 flex flex-col items-center text-center gap-8">
          <div className="max-w-4xl flex flex-col gap-6 items-center">
            <motion.h1
              className="font-display-lg text-display-lg font-bold text-on-background tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Showcase Your{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Professional Journey
              </span>
            </motion.h1>

            <motion.p
              className="font-headline-lg text-headline-lg text-on-surface-variant max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Join a community of experts. Build a dynamic portfolio, connect with peers, and
              accelerate your career growth.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link
                to="/register"
                className="bg-primary text-on-primary font-label-lg text-label-lg px-8 py-4 rounded-full hover:bg-surface-tint transition-all shadow-md w-full sm:w-auto text-center"
              >
                Create Your Profile
              </Link>
              <Link
                to="/discovery"
                className="border-2 border-outline-variant text-primary font-label-lg text-label-lg px-8 py-4 rounded-full hover:bg-surface-container transition-all w-full sm:w-auto text-center"
              >
                Explore Community
              </Link>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            className="w-full mt-12 rounded-xl overflow-hidden max-w-5xl h-64 md:h-96 relative bg-surface-container"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06)' }}
          >
            <img
              src={HERO_IMAGE}
              alt="Professionals collaborating in a modern office"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
          </motion.div>
        </section>

        {/* ── Features Section ─────────────────────────── */}
        <section className="w-full bg-surface-container-low py-24">
          <div className="max-w-[1280px] mx-auto px-gutter flex flex-col gap-12">
            <div className="text-center">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">
                Designed for Professionals
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
                Tools built to highlight your expertise and foster connections.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className="bg-surface p-8 rounded-xl border border-surface-variant hover:shadow-md transition-all duration-300 flex flex-col gap-4"
                  style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,.08)' }}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${f.color} flex items-center justify-center`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {f.icon}
                    </span>
                  </div>
                  <h3 className="font-title-lg text-title-lg text-on-background">{f.title}</h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <AppFooter variant="full" />
    </div>
  );
};
