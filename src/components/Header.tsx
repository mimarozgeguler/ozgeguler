import React, { useState } from 'react';
import { Mail, Phone, Linkedin, MapPin, BookOpen, FileText, Calendar, Compass, Globe, FolderKanban } from 'lucide-react';
import { cvDataTR, cvDataEN } from '../data/cvData';
import { DEFAULT_AVATAR } from '../data/profilePhoto';
import { getProfilePhotoCandidates } from '../utils/imageResolver';

interface HeaderProps {
  activeTab: 'portfolio' | 'projects' | 'cv';
  setActiveTab: (tab: 'portfolio' | 'projects' | 'cv') => void;
  lang: 'tr' | 'en';
  setLang: (lang: 'tr' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photoCandidates = getProfilePhotoCandidates(DEFAULT_AVATAR);

  const currentCv = lang === 'tr' ? cvDataTR : cvDataEN;

  const handlePhotoError = () => {
    if (photoIndex < photoCandidates.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    }
  };

  const photoSrc = photoCandidates[photoIndex];

  return (
    <header className="bg-[#0F0F0F] border-b border-white/10 sticky top-0 z-40 text-[#E0E0E0] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Identity & Photo Section */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
            {/* Profile Photo Container */}
            <div className="relative group shrink-0">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-sm overflow-hidden bg-[#1A1A1A] border border-white/10 group-hover:border-white/30 transition-all duration-300 shadow-2xl">
                <img
                  src={photoSrc}
                  alt={currentCv.fullName}
                  onError={handlePhotoError}
                  className="w-full h-full object-cover object-top filter grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white/10 backdrop-blur-md text-white p-1 rounded-full text-[10px] font-bold border border-white/20 shadow-md" title="Mimar">
                <Compass className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Name & Title Block */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.25em] uppercase font-light text-white/50 italic border border-white/10 px-2.5 py-0.5 rounded-full bg-white/5">
                  {lang === 'tr' ? 'Mimar / Architect' : 'Architect / Mimar'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic tracking-wide text-white mt-1 leading-tight">
                {currentCv.fullName}
              </h1>
              <p className="text-xs text-white/50 font-light tracking-widest uppercase mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-white/70">
                  <MapPin className="w-3.5 h-3.5 text-white/40" /> {lang === 'tr' ? 'İstanbul / Türkiye' : 'Istanbul / Turkey'}
                </span>
                <span className="hidden sm:inline text-white/20">•</span>
                <span className="flex items-center gap-1 text-white/40">
                  <Calendar className="w-3.5 h-3.5" /> 06.03.2000
                </span>
              </p>

              {/* Quick Contact Line */}
              <div className="flex items-center gap-4 mt-2.5 text-xs text-white/60 flex-wrap">
                <a
                  href={`mailto:${currentCv.email}`}
                  className="hover:text-white transition-colors flex items-center gap-1 text-white/70 font-light"
                  title="E-posta Gönder"
                >
                  <Mail className="w-3.5 h-3.5 text-white/40" />
                  <span className="truncate max-w-[180px] sm:max-w-none">{currentCv.email}</span>
                </a>
                <a
                  href={`tel:${currentCv.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors flex items-center gap-1 text-white/70 font-light"
                  title="Telefon Et"
                >
                  <Phone className="w-3.5 h-3.5 text-white/40" />
                  <span>{currentCv.phone}</span>
                </a>
                <a
                  href={currentCv.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 text-white/70 font-light"
                  title="LinkedIn Profili"
                >
                  <Linkedin className="w-3.5 h-3.5 text-white/40" />
                  <span className="hidden lg:inline">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Controls & Language Switcher */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t border-white/10 md:border-t-0 pt-3 md:pt-0">
            {/* Main Tabs */}
            <nav className="flex items-center bg-[#151515] p-1 rounded-full border border-white/10">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-all duration-200 ${
                  activeTab === 'portfolio'
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Portfolyo' : 'Portfolio'}</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-all duration-200 ${
                  activeTab === 'projects'
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Projeler' : 'Projects'}</span>
              </button>

              <button
                onClick={() => setActiveTab('cv')}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-full text-xs tracking-[0.15em] uppercase font-medium transition-all duration-200 ${
                  activeTab === 'cv'
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'Özgeçmiş (CV)' : 'Resume (CV)'}</span>
              </button>
            </nav>

            {/* Language Switcher Switch */}
            <div className="flex items-center bg-[#151515] p-1 rounded-full border border-white/10 shrink-0">
              <Globe className="w-3.5 h-3.5 text-white/40 ml-2.5 mr-1" />
              <button
                onClick={() => setLang('tr')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all ${
                  lang === 'tr'
                    ? 'bg-white text-black font-bold'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all ${
                  lang === 'en'
                    ? 'bg-white text-black font-bold'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

