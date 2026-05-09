import React from 'react';
import { 
  M3Card, 
  SkillChip, 
  EndorsementButton, 
  ProfileHeader, 
  TimelineSection 
} from '../../../../libs/shared/ui/src';

export const MockTestPage: React.FC = () => {
  const mockSkills = [
    { id: '1', name: 'React 18', count: 12 },
    { id: '2', name: 'TypeScript', count: 8 },
    { id: '3', name: 'Tailwind CSS', count: 15 },
    { id: '4', name: 'Node.js', count: 5 },
    { id: '5', name: 'Material Design 3', count: 20 },
  ];

  const mockExperience = [
    {
      id: 'exp1',
      title: 'Senior Frontend Developer',
      subtitle: 'Google DeepMind',
      dateRange: '2022 - Present',
      description: 'Working on advanced agentic coding systems and powerful AI assistants. Leading the UI/UX team for internal toolsets.',
      onEdit: () => console.log('Edit exp1'),
    },
    {
      id: 'exp2',
      title: 'UI/UX Designer',
      subtitle: 'Creative Studio',
      dateRange: '2020 - 2022',
      description: 'Designed high-fidelity mockups and interactive prototypes for international clients. Specialized in design systems.',
      onEdit: () => console.log('Edit exp2'),
    }
  ];

  const mockEducation = [
    {
      id: 'edu1',
      title: 'Master of Computer Science',
      subtitle: 'Stanford University',
      dateRange: '2018 - 2020',
      description: 'Specialized in Human-Computer Interaction and AI.',
    },
    {
      id: 'edu2',
      title: 'Bachelor of Design',
      subtitle: 'RISD',
      dateRange: '2014 - 2018',
    }
  ];

  return (
    <div className="bg-background min-h-screen pb-12">
      <div className="max-w-5xl mx-auto px-gutter py-unit space-y-gutter">
        
        {/* 1. Profile Header Demo */}
        <section>
          <h2 className="font-title-lg text-title-lg text-primary mb-4 px-2">1. Profile Header Component</h2>
          <ProfileHeader 
            displayName="Andy Nguy"
            headline="Senior Frontend Developer | AI Engineering Enthusiast"
            location="San Francisco, CA"
            avatarUrl="https://lh3.googleusercontent.com/a/ACg8ocL_F_hM9v0V_0fR2Q=s96-c"
            coverUrl="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-gutter">
            
            {/* 2. Timeline Sections */}
            <TimelineSection 
              title="Work Experience"
              icon="work"
              items={mockExperience}
              onAdd={() => console.log('Add experience')}
            />

            <TimelineSection 
              title="Education"
              icon="school"
              items={mockEducation}
              onAdd={() => console.log('Add education')}
            />

            {/* 3. M3 Card Generic */}
            <M3Card>
              <h3 className="font-title-lg text-title-lg text-on-surface mb-4">About Me</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Passionate about building beautiful, accessible, and high-performance web applications. 
                I believe that good design is as important as good code. Currently exploring the intersection of 
                Agentic AI and Frontend Development.
              </p>
            </M3Card>
          </div>

          {/* Right Column */}
          <div className="space-y-gutter">
            
            {/* 4. Skills Card with Chips */}
            <M3Card>
              <h3 className="font-title-lg text-title-lg text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {mockSkills.map(skill => (
                  <SkillChip 
                    key={skill.id} 
                    name={skill.name} 
                    onRemove={() => console.log('Remove', skill.name)}
                  />
                ))}
              </div>
              
              <hr className="border-outline-variant mb-6" />
              
              <h3 className="font-title-lg text-title-lg text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                Endorsements
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-body-lg">Skill Validation</span>
                  <EndorsementButton count={24} isEndorsed={true} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-lg">Team Collaboration</span>
                  <EndorsementButton count={12} isEndorsed={false} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-lg">System Design</span>
                  <EndorsementButton isEndorsed={false} />
                </div>
              </div>
            </M3Card>

            {/* 5. Visibility Card Example */}
            <section className="bg-primary-fixed rounded-[16px] shadow-sm elevation-1 p-6">
              <h3 className="font-title-lg text-title-lg text-on-primary-fixed mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">visibility</span>
                Profile Visibility
              </h3>
              <p className="font-body-lg text-body-lg text-on-primary-fixed-variant mb-4">
                Your profile is public and visible to everyone.
              </p>
              <button className="w-full bg-on-primary-fixed text-primary-fixed py-2 rounded-full font-label-lg">
                Manage Privacy
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};
