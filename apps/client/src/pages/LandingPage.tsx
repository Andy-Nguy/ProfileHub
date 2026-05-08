import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* ── Hero ────────────────────────── */}
      <section className="py-24 text-center">
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold tracking-tight text-on-surface leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your skills deserve
          <br />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            a spotlight
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-on-surface-variant max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Build your professional portfolio, get endorsed by peers,
          and discover talented people in your community.
        </motion.p>

        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Link
            to="/discovery"
            className="px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-light transition-colors shadow-md hover:shadow-lg"
          >
            Explore Profiles
          </Link>
          <button className="px-6 py-3 rounded-full border border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors">
            Create Portfolio
          </button>
        </motion.div>
      </section>

      {/* ── Features ────────────────────── */}
      <section className="py-16 grid sm:grid-cols-3 gap-8">
        {[
          {
            icon: 'person_search',
            title: 'Discover Talent',
            desc: 'Browse a curated feed of professionals filtered by skills, location, and expertise.',
          },
          {
            icon: 'thumb_up',
            title: 'Endorse Skills',
            desc: 'Vouch for the skills of people you\'ve worked with. Build trust through community validation.',
          },
          {
            icon: 'dashboard_customize',
            title: 'Showcase Work',
            desc: 'Present your experience, education, and projects in a clean, professional profile.',
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            className="p-6 rounded-xl bg-white border border-outline-variant/30 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
          >
            <span className="material-symbols-outlined text-3xl text-primary mb-3 block">
              {f.icon}
            </span>
            <h3 className="text-lg font-bold text-on-surface">{f.title}</h3>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
