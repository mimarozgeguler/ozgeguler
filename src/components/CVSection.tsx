import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Globe2,
  Code2,
  Mail,
  Phone,
  Linkedin,
  Calendar,
  CheckCircle2,
  Building,
  HeartHandshake,
  Car,
  Compass,
  Printer
} from 'lucide-react';
import { cvDataTR, cvDataEN } from '../data/cvData';
import { DEFAULT_AVATAR } from '../data/profilePhoto';
import { getProfilePhotoCandidates } from '../utils/imageResolver';

interface CVSectionProps {
  lang: 'tr' | 'en';
}

export const CVSection: React.FC<CVSectionProps> = ({ lang }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photoCandidates = getProfilePhotoCandidates(DEFAULT_AVATAR);

  const cvData = lang === 'tr' ? cvDataTR : cvDataEN;

  const handlePhotoError = () => {
    if (photoIndex < photoCandidates.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    }
  };

  const photoSrc = photoCandidates[photoIndex];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#0A0A0A] text-[#E0E0E0] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* CV Header Bar / Print Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0F0F0F] border border-white/10 p-4 sm:p-6 rounded-sm shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 text-white rounded border border-white/10">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-white">
                {lang === 'tr' ? 'Özgeçmiş & Yetkinlikler' : 'Resume & Competencies'}
              </h2>
              <p className="text-xs text-white/50 font-light tracking-wider uppercase">
                {cvData.fullName} • {cvData.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#151515] hover:bg-white/10 text-white/80 border border-white/10 rounded text-xs font-medium tracking-wider uppercase transition-colors"
            >
              <Printer className="w-4 h-4 text-white/60" />
              <span>{lang === 'tr' ? 'Yazdır / PDF' : 'Print / PDF'}</span>
            </button>

            <a
              href={`mailto:${cvData.email}?subject=${encodeURIComponent(lang === 'tr' ? 'Mimari Proje Teklifi / İletişim' : 'Architectural Project Inquiry')}`}
              className="flex items-center gap-2 px-5 py-2 bg-white text-black hover:bg-white/90 rounded text-xs font-semibold tracking-wider uppercase transition-colors shadow-lg"
            >
              <Mail className="w-4 h-4" />
              <span>{lang === 'tr' ? 'İletişime Geç' : 'Contact'}</span>
            </a>
          </div>
        </div>

        {/* CV Card Canvas */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-6 sm:p-10 shadow-2xl space-y-10 relative overflow-hidden">
          
          {/* Top Profile Intro Block */}
          <div className="flex flex-col md:flex-row items-start gap-8 pb-8 border-b border-white/10">
            {/* Photo */}
            <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-sm overflow-hidden bg-[#151515] border border-white/10 shrink-0 shadow-2xl relative group">
              <img
                src={photoSrc}
                alt={cvData.fullName}
                onError={handlePhotoError}
                className="w-full h-full object-cover object-top filter grayscale contrast-125"
              />
            </div>

            {/* Info */}
            <div className="space-y-3 flex-1">
              <div>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.25em] border border-white/10 px-3 py-1 rounded-full bg-white/5">
                  {cvData.title}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-white mt-3 leading-tight">
                  {cvData.fullName}
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-white/70 font-light tracking-wide pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/40 shrink-0" />
                  <span>{cvData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/40 shrink-0" />
                  <span className="truncate">{cvData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-white/40 shrink-0" />
                  <a
                    href={cvData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white underline underline-offset-2 truncate"
                  >
                    www.linkedin.com/in/özgegüler
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/40 shrink-0" />
                  <span>{lang === 'tr' ? 'Doğum Tarihi:' : 'Date of Birth:'} {cvData.birthDate}</span>
                </div>
              </div>

              {/* Summary / Özet */}
              <div className="pt-3">
                <h3 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/40 mb-1.5">
                  {lang === 'tr' ? 'ÖZET' : 'SUMMARY'}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light bg-[#151515] p-4 rounded-sm border border-white/10">
                  {cvData.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Work Experience / İş Deneyimi */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Briefcase className="w-5 h-5 text-white/60" />
              <h2 className="text-xl font-serif italic text-white tracking-wide">
                {lang === 'tr' ? 'İŞ DENEYİMİ' : 'WORK EXPERIENCE'}
              </h2>
            </div>

            <div className="space-y-6">
              {cvData.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-[#151515] border border-white/10 rounded-sm p-6 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/10 pb-3">
                    <div>
                      <h3 className="text-lg font-serif italic text-white">{exp.company}</h3>
                      <p className="text-xs font-mono uppercase tracking-wider text-white/60">{exp.role}</p>
                    </div>
                    <span className="text-xs font-mono text-white/40 bg-black/50 px-3 py-1 rounded border border-white/10 w-fit">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-white/70 font-light">
                    {exp.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education / Eğitim */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <GraduationCap className="w-5 h-5 text-white/60" />
              <h2 className="text-xl font-serif italic text-white tracking-wide">
                {lang === 'tr' ? 'EĞİTİM' : 'EDUCATION'}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {cvData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-[#151515] border border-white/10 rounded-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif italic text-white">{edu.degree}</h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-white/60">{edu.school}</p>
                    <p className="text-xs text-white/40">{edu.faculty}</p>
                  </div>
                  <span className="text-xs font-mono text-white/40 bg-black/50 px-3 py-1.5 rounded border border-white/10 shrink-0">
                    {edu.period}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Grid: Software & Technical */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Software Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Code2 className="w-5 h-5 text-white/60" />
                <h2 className="text-xl font-serif italic text-white tracking-wide">
                  {lang === 'tr' ? 'YAZILIM BECERİLERİ' : 'SOFTWARE SKILLS'}
                </h2>
              </div>

              <div className="space-y-3.5 bg-[#151515] p-6 rounded-sm border border-white/10">
                {cvData.softwareSkills.map((skill, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-white">{skill.name}</span>
                      <span className="font-mono text-white/50 text-[11px]">{skill.level}</span>
                    </div>
                    <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/10">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Building className="w-5 h-5 text-white/60" />
                <h2 className="text-xl font-serif italic text-white tracking-wide">
                  {lang === 'tr' ? 'TEKNİK YETENEKLER' : 'TECHNICAL SKILLS'}
                </h2>
              </div>

              <div className="bg-[#151515] p-6 rounded-sm border border-white/10 grid grid-cols-1 gap-3">
                {cvData.technicalSkills.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-white/80 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Languages, License & Volunteer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Foreign Languages */}
            <div className="space-y-3 bg-[#151515] p-6 rounded-sm border border-white/10">
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-white/60" /> {lang === 'tr' ? 'DİL BECERİLERİ' : 'LANGUAGES'}
              </h3>
              <div className="space-y-2 text-xs">
                {cvData.languages.map((l, idx) => (
                  <div key={idx} className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-white font-medium">{l.name}</span>
                    <span className="text-white/40 font-mono">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* License & Driver */}
            <div className="space-y-3 bg-[#151515] p-6 rounded-sm border border-white/10">
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-white/60" /> {lang === 'tr' ? 'SÜRÜCÜ BELGESİ' : "DRIVER'S LICENSE"}
              </h3>
              <p className="text-xs text-white/80 flex items-center gap-2 font-light">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">{cvData.driverLicense}</span>
              </p>
            </div>

            {/* Certificates */}
            <div className="space-y-3 bg-[#151515] p-6 rounded-sm border border-white/10">
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-white/60" /> {lang === 'tr' ? 'SERTİFİKALAR' : 'CERTIFICATES'}
              </h3>
              <ul className="space-y-2 text-xs text-white/80 font-light">
                {cvData.certificates.map((cert, idx) => (
                  <li key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="truncate pr-2">{cert.title}</span>
                    <span className="font-mono text-white/40 text-[10px] shrink-0">{cert.date}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Volunteer Work / Gönüllülük Projesi */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <HeartHandshake className="w-5 h-5 text-white/60" />
              <h2 className="text-xl font-serif italic text-white tracking-wide">
                {lang === 'tr' ? 'GÖNÜLLÜLÜK PROJESİ' : 'VOLUNTEER PROJECT'}
              </h2>
            </div>

            {cvData.volunteer.map((vol, idx) => (
              <div key={idx} className="bg-[#151515] border border-white/10 rounded-sm p-6 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 border-b border-white/10 pb-2">
                  <div>
                    <h3 className="text-lg font-serif italic text-white">{vol.organization}</h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-white/60">{vol.location}</p>
                  </div>
                  <span className="text-xs font-mono text-white/40 bg-black/50 px-3 py-1 rounded border border-white/10 w-fit">
                    {vol.date}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-white/70 font-light">
                  {vol.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0 mt-1.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
