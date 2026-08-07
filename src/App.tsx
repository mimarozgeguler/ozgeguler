import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MagazinePortfolio } from './components/MagazinePortfolio';
import { CVSection } from './components/CVSection';
import { generatePortfolioPages } from './data/portfolioConfig';
import { Compass, Mail, Phone, Linkedin } from 'lucide-react';
import { loadAllPageImagesFromDB, savePageImageToDB } from './utils/indexedDBStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'cv'>('portfolio');
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const [uploadedImages, setUploadedImages] = useState<Record<number, string>>({});

  const pages = generatePortfolioPages();

  // Load saved images from IndexedDB on startup
  useEffect(() => {
    loadAllPageImagesFromDB().then((saved) => {
      if (saved && Object.keys(saved).length > 0) {
        setUploadedImages((prev) => ({ ...prev, ...saved }));
      }
    });
  }, []);

  const handleBulkUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const match = file.name.match(/(\d+)/);
      if (match) {
        const pageNum = parseInt(match[1], 10);
        if (pageNum >= 1 && pageNum <= 25) {
          savePageImageToDB(pageNum, file).then((dataUrl) => {
            setUploadedImages((prev) => ({ ...prev, [pageNum]: dataUrl }));
          });
        }
      }
    });
  };

  const handleSingleUpload = (pageNum: number, file: File) => {
    savePageImageToDB(pageNum, file).then((dataUrl) => {
      setUploadedImages((prev) => ({ ...prev, [pageNum]: dataUrl }));
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E0E0E0] flex flex-col font-sans selection:bg-white selection:text-black">
      
      {/* Top Header & Entrance */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'portfolio' ? (
          <MagazinePortfolio
            pages={pages}
            uploadedImages={uploadedImages}
            onBulkUpload={handleBulkUpload}
            onSingleUpload={handleSingleUpload}
            lang={lang}
          />
        ) : (
          <CVSection
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/10 py-8 px-4 text-white/50 text-xs font-light">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-white/60" />
            <span className="font-serif italic text-white tracking-wide">ÖZLEM ÖZGE GÜLER</span>
            <span className="text-white/20">•</span>
            <span className="text-white/40 uppercase tracking-widest text-[10px] font-mono">
              {lang === 'tr' ? 'Mimar / Architect Portfolyo & CV' : 'Architect Portfolio & Resume'}
            </span>
          </div>

          <div className="flex items-center gap-6 text-white/50">
            <a href="mailto:mimar.ozgeguler@gmail.com" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-white/40" /> mimar.ozgeguler@gmail.com
            </a>
            <a href="tel:+905366443250" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-white/40" /> +90 536 644 32 50
            </a>
            <a
              href="https://www.linkedin.com/in/özgegüler"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5 text-white/40" /> LinkedIn
            </a>
          </div>

          <div className="text-[10px] uppercase font-mono tracking-widest text-white/30">
            © {new Date().getFullYear()} Özlem Özge Güler. {lang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
          </div>
        </div>
      </footer>
    </div>
  );
}
