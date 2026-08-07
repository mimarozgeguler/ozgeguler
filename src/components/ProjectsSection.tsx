import React from 'react';
import { FolderKanban, Sparkles, Building2, Compass } from 'lucide-react';

interface ProjectsSectionProps {
  lang: 'tr' | 'en';
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ lang }) => {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      {/* Title & Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>{lang === 'tr' ? 'Mimari Projeler' : 'Architectural Projects'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif italic text-white tracking-wide">
          {lang === 'tr' ? 'Projeler' : 'Projects'}
        </h2>
        <p className="text-sm text-white/50 font-light mt-2 tracking-wider">
          {lang === 'tr'
            ? 'Mimar Özge Güler • Mimari & İç Mimari Tasarım Çalışmaları'
            : 'Architect Özge Güler • Architectural & Interior Design Portfolio Works'}
        </p>
      </div>

      {/* Main Card displaying "Çok yakında..." */}
      <div className="w-full max-w-xl bg-[#141414] border border-white/10 rounded-xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden group">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-amber-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <Building2 className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif italic text-white mb-3">
            {lang === 'tr' ? 'Çok yakında...' : 'Coming soon...'}
          </h3>

          <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed max-w-md mx-auto">
            {lang === 'tr'
              ? 'Projelerim detaylı paftalar, 3D görselleştirmeler ve teknik konsept çizimleri ile çok yakında bu bölümde yer alacaktır.'
              : 'My architectural projects will be featured in this section soon with detailed presentation boards, 3D visualizations, and concept drawings.'}
          </p>

          <div className="mt-8 pt-6 border-t border-white/10 w-full flex items-center justify-center gap-2 text-[11px] font-mono uppercase text-white/40 tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
            <span>{lang === 'tr' ? 'Hazırlık Aşamasında' : 'In Preparation'}</span>
            <Compass className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
};
