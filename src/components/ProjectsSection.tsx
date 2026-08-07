import React from 'react';

interface ProjectsSectionProps {
  lang: 'tr' | 'en';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ lang }) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-full bg-[#141414] border border-white/10 rounded-2xl p-8 sm:p-14 shadow-2xl">
        <h3 className="text-3xl sm:text-4xl font-serif italic text-white mb-4">
          {lang === 'tr' ? 'Çok yakında...' : 'Coming soon...'}
        </h3>
        <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto">
          {lang === 'tr'
            ? 'Projelerim detaylı paftalar, 3D görselleştirmeler ve teknik konsept çizimleri ile çok yakında bu bölümde yer alacaktır.'
            : 'My projects will be featured in this section soon with detailed presentation boards, 3D visualizations, and technical concept drawings.'}
        </p>
      </div>
    </section>
  );
};
