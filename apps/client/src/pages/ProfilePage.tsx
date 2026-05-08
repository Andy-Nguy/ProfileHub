import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../hooks/useApi';
import { SkillChip } from '../components/SkillChip';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading, isError } = useProfile(username ?? '');

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-24 w-24 rounded-full bg-surface-container animate-pulse mx-auto" />
        <div className="h-8 w-48 bg-surface-container animate-pulse mx-auto mt-4 rounded" />
        <div className="h-4 w-64 bg-surface-container animate-pulse mx-auto mt-2 rounded" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">person_off</span>
        <p className="text-lg text-on-surface-variant">Profile not found</p>
        <Link to="/discovery" className="mt-4 inline-block text-primary hover:underline text-sm">
          ← Back to discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* ── Header ──────────────────────── */}
      <motion.section
        className="text-center mb-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-white shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto ring-4 ring-white shadow-md">
            <span className="text-3xl font-bold text-white">
              {profile.displayName?.[0]?.toUpperCase()}
            </span>
          </div>
        )}
        <h1 className="text-2xl font-bold text-on-surface mt-4">{profile.displayName}</h1>
        <p className="text-on-surface-variant">@{profile.username}</p>
        {profile.headline && (
          <p className="text-on-surface-variant mt-1">{profile.headline}</p>
        )}
        {profile.bio && (
          <p className="text-sm text-on-surface-variant mt-3 max-w-lg mx-auto leading-relaxed">
            {profile.bio}
          </p>
        )}
        <div className="flex items-center justify-center gap-1 mt-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          <span className="text-sm font-medium">{profile.likesCount ?? 0} likes</span>
        </div>
      </motion.section>

      {/* ── Skills ──────────────────────── */}
      {profile.skills?.length > 0 && (
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-lg font-bold text-on-surface mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: any) => (
              <SkillChip key={skill.id} name={skill.name} count={skill.endorsementCount} />
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Experience ──────────────────── */}
      {profile.experiences?.length > 0 && (
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="text-lg font-bold text-on-surface mb-3">Experience</h2>
          <div className="space-y-4">
            {profile.experiences.map((exp: any) => (
              <div key={exp.id} className="p-4 rounded-xl bg-white border border-outline-variant/30">
                <h3 className="font-semibold text-on-surface">{exp.title}</h3>
                <p className="text-sm text-on-surface-variant">{exp.company}</p>
                {exp.description && (
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Education ───────────────────── */}
      {profile.educations?.length > 0 && (
        <motion.section
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-lg font-bold text-on-surface mb-3">Education</h2>
          <div className="space-y-4">
            {profile.educations.map((edu: any) => (
              <div key={edu.id} className="p-4 rounded-xl bg-white border border-outline-variant/30">
                <h3 className="font-semibold text-on-surface">{edu.degree} in {edu.fieldOfStudy}</h3>
                <p className="text-sm text-on-surface-variant">{edu.institution}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};
