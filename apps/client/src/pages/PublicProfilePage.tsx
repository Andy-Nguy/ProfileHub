import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileAPI, ProfileResponse } from '../services/profile.service';
import { EndorsementButton } from '@profilehub/ui';
import { ISkill, IExperience, IEducation } from '@profilehub/types';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (username) {
          const data = await profileAPI.getPublicProfile(username);
          setProfile(data);
        }
      } catch (error) {
        console.error('Failed to fetch public profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="bg-background text-on-background min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-background text-on-background min-h-screen flex items-center justify-center">
        <div className="bg-surface rounded-xl p-8 text-center max-w-md shadow-sm elevation-1">
          <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
          <p className="text-on-surface-variant mb-6">
            The profile for @{username} does not exist.
          </p>
          <Link to="/discovery" className="text-primary hover:underline decoration-1 underline-offset-4 font-label-lg text-label-lg transition-all">
            ← Back to Discovery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 md:ml-72 flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1 py-8 px-4 md:px-8 bg-background">
          <div className="w-full max-w-[1024px] mx-auto space-y-12 pb-12">
            {/* Profile Header Area */}
          <section className="bg-surface rounded-xl shadow-sm elevation-1 p-8 md:p-12 relative overflow-hidden border border-outline-variant/30">
            {/* Decorative Banner */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-container to-secondary-container opacity-20"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              <img 
                alt={profile.displayName}
                className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-surface shadow-md object-cover bg-surface-container-highest" 
                src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
              />
              
              <div className="flex-grow space-y-2 w-full">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h1 className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">{profile.displayName}</h1>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface-variant mt-1">{profile.headline}</h2>
                  </div>
                  
                  <div className="hidden md:flex">
                    <EndorsementButton count={profile.likesCount} isEndorsed={false} />
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-on-surface-variant mt-4 font-body-lg text-body-lg">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[20px]">location_on</span> {profile.location}
                    </div>
                  )}
                  {profile.industry && (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[20px]">business</span> {profile.industry}
                    </div>
                  )}
                  {profile.socialLinks?.[0] && (
                    <a
                      href={profile.socialLinks[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 text-primary no-underline transition-all"
                    >
                      <span className="material-symbols-outlined text-[20px] no-underline">link</span>
                      <span className="group-hover:underline decoration-1 underline-offset-4">
                        {profile.socialLinks[0].platform}
                      </span>
                    </a>
                  )}
                </div>
              </div>
              
              {/* Mobile Actions */}
              <div className="md:hidden flex gap-3 mt-4 self-end">
                 <EndorsementButton count={profile.likesCount} isEndorsed={false} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Details & Sidebar Content */}
            <div className="md:col-span-1 space-y-8">
              {/* About Me */}
              {profile.bio && (
                <section className="bg-surface rounded-xl p-6 shadow-sm elevation-1 border border-outline-variant/30 hover:shadow-md transition-shadow duration-300">
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">person</span> About Me
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    {profile.bio}
                  </p>
                </section>
              )}

              {/* Skills & Competencies */}
              <section className="bg-surface rounded-xl p-6 shadow-sm elevation-1 border border-outline-variant/30 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span> Core Skills
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: ISkill, i: number) => (
                      <span key={skill.id || skill.name} className={`px-3 py-1.5 rounded-lg font-label-lg text-label-lg ${i % 3 === 0 ? 'bg-secondary-container text-on-secondary-container border border-secondary/20' : 'bg-surface-container-high text-on-surface border border-outline-variant/50'}`}>
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-on-surface-variant text-body-md">No skills added yet.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Timeline & Projects */}
            <div className="md:col-span-2 space-y-8">
              {/* Experience Timeline */}
              <section className="bg-surface rounded-xl p-8 shadow-sm elevation-1 border border-outline-variant/30">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-8 flex items-center gap-2 border-b border-outline-variant/30 pb-4">
                  <span className="material-symbols-outlined text-primary">work</span> Experience
                </h3>
                
                <div className="relative border-l-2 border-surface-variant ml-4 space-y-10">
                  {profile.experiences && profile.experiences.length > 0 ? (
                    profile.experiences.map((exp: IExperience, i: number) => (
                      <div key={exp.id} className="relative pl-8">
                        <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-surface ${i === 0 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                        <div className="mb-1 flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                          <h4 className="font-title-lg text-title-lg text-on-surface">{exp.title}</h4>
                          <span className={`${i === 0 ? 'text-primary' : 'text-on-surface-variant'} font-label-lg text-label-lg`}>
                            {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                          </span>
                        </div>
                        <h5 className="font-body-lg text-body-lg text-on-surface-variant mb-3">{exp.company}</h5>
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="pl-8 text-on-surface-variant">No experience added yet.</p>
                  )}
                </div>
              </section>

              {/* Education */}
              <section className="bg-surface rounded-xl p-8 shadow-sm elevation-1 border border-outline-variant/30">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-6 flex items-center gap-2 border-b border-outline-variant/30 pb-4">
                  <span className="material-symbols-outlined text-primary">school</span> Education
                </h3>
                
                <div className="space-y-6">
                  {profile.educations && profile.educations.length > 0 ? (
                    profile.educations.map((edu: IEducation) => (
                      <div key={edu.id} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-surface-container flex items-center justify-center rounded-lg flex-shrink-0">
                          <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-title-lg text-title-lg text-on-surface">{edu.degree} in {edu.fieldOfStudy}</h4>
                          <p className="font-body-lg text-body-lg text-on-surface-variant">
                            {edu.institution} • {new Date(edu.startDate).getFullYear()} - {edu.isCurrent ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-on-surface-variant">No education added yet.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
          
          {/* Featured Projects Section (Static placeholder as per HTML) */}
          <section className="bg-surface rounded-xl p-8 shadow-sm elevation-1 border border-outline-variant/30">
            <h3 className="font-title-lg text-title-lg text-on-surface mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">folder_special</span> Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group border border-outline-variant/40 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 bg-surface-bright elevation-1 hover:elevation-2">
                <div className="h-48 bg-surface-variant relative overflow-hidden">
                  <img alt="Project 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" />
                </div>
                <div className="p-6">
                  <h4 className="font-title-lg text-title-lg text-on-surface mb-2">Design System Pro</h4>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 line-clamp-2">A comprehensive component library built in Figma, fully mapped to React components.</p>
                   <a className="group inline-flex items-center text-primary font-label-lg text-label-lg no-underline" href="#">
                    <span className="group-hover:underline decoration-1 underline-offset-4">View Case Study</span>
                    <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                  </a>
                </div>
              </div>
              <div className="group border border-outline-variant/40 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 bg-surface-bright elevation-1 hover:elevation-2">
                <div className="h-48 bg-surface-variant relative overflow-hidden">
                  <img alt="Project 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" />
                </div>
                <div className="p-6">
                  <h4 className="font-title-lg text-title-lg text-on-surface mb-2">Analytics Dashboard</h4>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 line-clamp-2">Redesign of legacy reporting tools, introducing customizable dashboards and interactive data visualization.</p>
                  <a className="group inline-flex items-center text-primary font-label-lg text-label-lg no-underline" href="#">
                    <span className="group-hover:underline decoration-1 underline-offset-4">View Prototype</span>
                    <span className="material-symbols-outlined text-[18px] ml-1">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        {/* Template Footer */}
        <footer className="bg-surface-container-highest dark:bg-inverse-surface mt-12 full-width bottom-0 border-t border-outline-variant dark:border-outline flat no-shadows">
          <div className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center max-w-[1280px] mx-auto">
            <div className="font-title-lg text-title-lg font-bold text-on-surface dark:text-inverse-on-surface mb-6 md:mb-0">ProHub</div>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
              <a className="text-on-surface-variant dark:text-outline-variant hover:text-on-surface transition-colors font-label-lg text-label-lg hover:text-primary dark:hover:text-primary-fixed-dim opacity-80 hover:opacity-100 transition-opacity" href="#">Privacy Policy</a>
              <a className="text-on-surface-variant dark:text-outline-variant hover:text-on-surface transition-colors font-label-lg text-label-lg hover:text-primary dark:hover:text-primary-fixed-dim opacity-80 hover:opacity-100 transition-opacity" href="#">Terms of Service</a>
              <a className="text-on-surface-variant dark:text-outline-variant hover:text-on-surface transition-colors font-label-lg text-label-lg hover:text-primary dark:hover:text-primary-fixed-dim opacity-80 hover:opacity-100 transition-opacity" href="#">Community Guidelines</a>
            </div>
          </div>
          <div className="text-center py-4 text-on-surface-variant font-body-lg text-body-lg text-sm bg-surface-container-high dark:bg-inverse-surface">
            © 2024 ProHub Community Hub. Professional Growth through Collective Expertise.
          </div>
        </footer>
      </div>
    </main>
    </>
  );
};
