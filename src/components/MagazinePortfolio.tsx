import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  LayoutGrid,
  FileText,
  Compass,
  Layers,
  Eye,
  Upload,
  ImagePlus,
  FolderPlus,
  AlertTriangle,
  FileX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioPage } from '../types';
import { pageCategoryTitles, TOTAL_PORTFOLIO_PAGES } from '../data/portfolioConfig';
import { getPageCandidateUrls } from '../utils/imageResolver';

interface MagazinePortfolioProps {
  pages: PortfolioPage[];
  uploadedImages: Record<number, string>;
  onBulkUpload?: (files: FileList) => void;
  onSingleUpload?: (pageNum: number, file: File) => void;
  lang: 'tr' | 'en';
}

export const MagazinePortfolio: React.FC<MagazinePortfolioProps> = ({
  pages,
  uploadedImages,
  onBulkUpload,
  onSingleUpload,
  lang
}) => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1); // +1 = next/slide left, -1 = prev/slide right
  const [viewMode, setViewMode] = useState<'double' | 'single' | 'grid'>('double');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  
  // Candidate index map and failed images map
  const [pageCandidateIndex, setPageCandidateIndex] = useState<Record<number, number>>({});
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  // Stage & Zoom references
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Wheel Scroll Zooming
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      if (viewMode === 'grid') return;

      // Prevent default browser page scrolling when zooming over magazine stage
      e.preventDefault();

      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      setZoomLevel((prev) => {
        const next = Math.min(3.5, Math.max(1, prev + delta));
        return Math.round(next * 100) / 100;
      });
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      stage.removeEventListener('wheel', handleWheel);
    };
  }, [viewMode]);

  // Double Click Zoom Toggle Handler
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (viewMode === 'grid') return;
    e.stopPropagation();

    setZoomLevel((prev) => (prev > 1 ? 1 : 2.2));
  }, [viewMode]);

  // Filter Categories
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handle image load error across multiple candidates
  const handleImageError = (pageNum: number) => {
    const candidates = getPageCandidateUrls(pageNum);
    setPageCandidateIndex((prev) => {
      const currIdx = prev[pageNum] ?? 0;
      if (currIdx < candidates.length - 1) {
        return { ...prev, [pageNum]: currIdx + 1 };
      }
      setFailedImages((f) => ({ ...f, [pageNum]: true }));
      return prev;
    });
  };

  // Rescan all images across all pages
  const rescanImages = () => {
    setPageCandidateIndex({});
    setFailedImages({});
  };

  // Reset a single page's error state to retry loading
  const resetSinglePage = (pageNum: number) => {
    setPageCandidateIndex((prev) => ({ ...prev, [pageNum]: 0 }));
    setFailedImages((prev) => ({ ...prev, [pageNum]: false }));
  };

  // Stage Drag & Drop handlers
  const handleStageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleStageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleStageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onBulkUpload?.(e.dataTransfer.files);
      rescanImages();
    }
  };

  // Keyboard arrow listener for easy page turning
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (viewMode === 'grid') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevPage();
    } else if (e.key === 'Home') {
      jumpToPage(1);
    } else if (e.key === 'End') {
      jumpToPage(TOTAL_PORTFOLIO_PAGES);
    }
  }, [currentPage, viewMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Preload all portfolio page images into browser cache for instantaneous loading
  useEffect(() => {
    for (let i = 1; i <= TOTAL_PORTFOLIO_PAGES; i++) {
      const padded = i.toString().padStart(2, '0');
      const img = new Image();
      img.src = `/portfolio${padded}.jpg`;
    }
  }, []);

  // Page Turn Handlers
  const nextPage = () => {
    setDirection(1);
    if (viewMode === 'double') {
      if (currentPage === 1) {
        setCurrentPage(2);
      } else if (currentPage < TOTAL_PORTFOLIO_PAGES) {
        setCurrentPage((prev) => Math.min(prev + 2, TOTAL_PORTFOLIO_PAGES));
      }
    } else {
      if (currentPage < TOTAL_PORTFOLIO_PAGES) {
        setCurrentPage((prev) => prev + 1);
      }
    }
    setZoomLevel(1);
  };

  const prevPage = () => {
    setDirection(-1);
    if (viewMode === 'double') {
      if (currentPage <= 3) {
        setCurrentPage(1);
      } else {
        setCurrentPage((prev) => Math.max(prev - 2, 2));
      }
    } else {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
    setZoomLevel(1);
  };

  const jumpToPage = (num: number) => {
    const validNum = Math.max(1, Math.min(TOTAL_PORTFOLIO_PAGES, num));
    setDirection(validNum >= currentPage ? 1 : -1);
    if (viewMode === 'double' && validNum > 1 && validNum % 2 !== 0) {
      setCurrentPage(validNum - 1);
    } else {
      setCurrentPage(validNum);
    }
    setZoomLevel(1);
    if (viewMode === 'grid') {
      setViewMode('double');
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Get image source for page number
  const getPageImageSrc = (pageNum: number): string | null => {
    if (uploadedImages[pageNum]) {
      return uploadedImages[pageNum];
    }
    if (failedImages[pageNum]) {
      return null;
    }
    const candidates = getPageCandidateUrls(pageNum);
    const currIdx = pageCandidateIndex[pageNum] ?? 0;
    return candidates[currIdx] || null;
  };

  // Calculate current spread pages for double-page view
  const getSpreadPages = (): [number, number | null] => {
    if (currentPage === 1) {
      return [1, null]; // Cover page alone
    }
    const left = currentPage % 2 === 0 ? currentPage : currentPage - 1;
    const right = left + 1 <= TOTAL_PORTFOLIO_PAGES ? left + 1 : null;
    return [left, right];
  };

  // Preload adjacent page images for instant and buttery smooth transitions
  useEffect(() => {
    const pagesToPreload = new Set<number>();
    
    // Preload current page, previous 2 pages, and next 4 pages
    [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, currentPage + 3, currentPage + 4].forEach((p) => {
      if (p >= 1 && p <= TOTAL_PORTFOLIO_PAGES) {
        pagesToPreload.add(p);
      }
    });

    pagesToPreload.forEach((pageNum) => {
      const src = getPageImageSrc(pageNum);
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [currentPage, uploadedImages, failedImages, pageCandidateIndex]);

  // Animation Variants for 3D Digital Magazine Page Folding & Flipping Transitions
  const pageSlideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '25%' : '-25%',
      rotateY: dir > 0 ? 48 : -48,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: '0%',
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
        rotateY: { duration: 0.48, ease: [0.18, 1, 0.3, 1] },
        opacity: { duration: 0.28 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '25%' : '-25%',
      rotateY: dir < 0 ? 48 : -48,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
        rotateY: { duration: 0.42, ease: [0.18, 1, 0.3, 1] },
        opacity: { duration: 0.22 },
        scale: { duration: 0.28 },
      },
    }),
  };

  // Render Page Content (either real PNG or architectural fall-back sheet)
  const renderSinglePageCard = (pageNum: number, isRightPage: boolean | null = null) => {
    const src = getPageImageSrc(pageNum);
    const paddedNum = pageNum.toString().padStart(2, '0');
    const meta = pageCategoryTitles[pageNum] || {
      title: `PAFTA SAYFA ${pageNum}`,
      category: "Genel",
      description: "Mimari Proje Detay Paftası"
    };

    const imgAlignment =
      isRightPage === false
        ? 'object-right'
        : isRightPage === true
        ? 'object-left'
        : 'object-center';

    return (
      <div 
        className={`relative w-full h-full bg-[#111111] overflow-hidden select-none flex flex-col justify-between group/card ${
          zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onDoubleClick={handleDoubleClick}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files && e.dataTransfer.files.length === 1) {
            onSingleUpload?.(pageNum, e.dataTransfer.files[0]);
            resetSinglePage(pageNum);
          } else if (e.dataTransfer.files && e.dataTransfer.files.length > 1) {
            onBulkUpload?.(e.dataTransfer.files);
            rescanImages();
          }
        }}
      >
        {src ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={src}
              alt={`Portfolyo Sayfa ${pageNum}`}
              onError={() => handleImageError(pageNum)}
              className={`w-full h-full object-contain ${imgAlignment} pointer-events-none`}
              loading="eager"
            />
          </div>
        ) : (
          /* Explicit Error Card / Notice when Public Image Fails to Load */
          <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-between bg-[#141212] border border-red-500/30 text-white font-sans relative overflow-hidden">
            {/* Subtle red background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.08),transparent_70%)] pointer-events-none" />

            {/* Header Error Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-red-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider font-mono font-semibold text-red-400">
                  {lang === 'tr' ? `SAYFA ${pageNum} - GÖRSEL YÜKLEME HATASI` : `PAGE ${pageNum} - IMAGE LOAD ERROR`}
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-mono text-red-300/60 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                HTTP 404 - DOSYA EKSİK
              </span>
            </div>

            {/* Main Error Details Content */}
            <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center text-center px-2">
              <div className="w-12 h-12 mb-3 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 shadow-lg shadow-red-950/40">
                <FileX className="w-6 h-6 text-red-400" />
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-red-200 tracking-wide max-w-md">
                {lang === 'tr' ? `public/portfolio${paddedNum}.jpg Görseli Yüklenemedi` : `Could not load public/portfolio${paddedNum}.jpg`}
              </h3>

              <p className="text-xs text-red-300/80 mt-1.5 max-w-md leading-relaxed font-sans">
                {lang === 'tr' 
                  ? `Sunucudaki public/ klasöründe portfolio${paddedNum}.jpg dosyası bulunamadı veya yükleme hatası oluştu.` 
                  : `The file portfolio${paddedNum}.jpg was not found in public/ folder or failed to load.`}
              </p>

              {/* Technical Code & Error Box */}
              <div className="mt-3 p-3 bg-black/80 border border-red-500/20 rounded-lg text-left max-w-sm w-full font-mono text-[10px] text-white/70 space-y-1 shadow-inner">
                <div className="flex justify-between text-red-400/80 border-b border-white/10 pb-1 font-bold">
                  <span>HATA DETAYI</span>
                  <span className="text-red-400">404 NOT FOUND</span>
                </div>
                <p><span className="text-white/40">Pafta Adı:</span> <span className="text-white font-semibold">#{pageNum} - {meta.title}</span></p>
                <p><span className="text-white/40">Aranan Yol:</span> <span className="text-amber-300 font-bold">/public/portfolio${paddedNum}.jpg</span></p>
                <p><span className="text-white/40">Durum:</span> <span className="text-red-300">Görsel Okunamadı / Silinmiş</span></p>
              </div>

              {/* Action Buttons: Upload & Retry */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 z-20">
                <label className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-red-950/50 hover:scale-105">
                  <Upload className="w-4 h-4 text-white" />
                  <span>{lang === 'tr' ? `portfolio${paddedNum}.jpg Dosyasını Yükle` : `Upload portfolio${paddedNum}.jpg File`}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        onSingleUpload?.(pageNum, e.target.files[0]);
                        resetSinglePage(pageNum);
                      }
                    }}
                  />
                </label>

                <button
                  onClick={() => resetSinglePage(pageNum)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5"
                  title={lang === 'tr' ? 'Tekrar Yüklemeyi Deneyin' : 'Retry loading image'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? 'Tekrar Deneyin' : 'Retry'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Antet / Footer Bar */}
            <div className="relative z-10 border-t border-red-500/20 pt-2 flex items-center justify-between text-[9px] uppercase tracking-widest font-mono text-red-200/40">
              <span>{meta.category}</span>
              <span>ÖZLEM ÖZGE GÜLER • PAFTA {pageNum}/25</span>
            </div>
          </div>
        )}

        {/* Page Number Badge */}
        <div
          className={`absolute bottom-3 ${
            isRightPage ? 'right-3' : 'left-3'
          } bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[10px] font-mono text-white/60 italic z-20`}
        >
          {pageNum}
        </div>
      </div>
    );
  };

  const [spreadLeft, spreadRight] = getSpreadPages();

  return (
    <div
      ref={containerRef}
      onDragOver={handleStageDragOver}
      onDragLeave={handleStageDragLeave}
      onDrop={handleStageDrop}
      className={`flex flex-col bg-[#0A0A0A] min-h-[calc(100vh-120px)] ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 sm:p-6 overflow-auto bg-[#0A0A0A]' : 'relative'
      }`}
    >
      {/* Global Drag Overlay Notice */}
      {isDraggingOver && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center border-4 border-dashed border-white/50 text-white p-6">
          <FolderPlus className="w-16 h-16 mb-4 text-white animate-bounce" />
          <h3 className="text-2xl font-serif italic text-white mb-2">
            {lang === 'tr' ? 'Görselleri Buraya Bırakın' : 'Drop Images Here'}
          </h3>
          <p className="text-sm text-white/60 font-mono">
            {lang === 'tr' ? 'portfolio01.jpg, portfolio02.jpg ... portfolio25.jpg dosyaları otomatik olarak eşleştirilip kaydedilecektir.' : 'portfolio01.jpg, portfolio02.jpg... portfolio25.jpg files will be automatically mapped and saved.'}
          </p>
        </div>
      )}

      {/* Top Toolbar / Controller */}
      <div className="bg-[#0F0F0F] border-b border-white/10 p-3 sm:p-4 sticky top-[73px] sm:top-[85px] z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Mode Switchers */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center bg-[#151515] p-1 rounded-full border border-white/10">
              <button
                onClick={() => setViewMode('double')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                  viewMode === 'double'
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-white/50 hover:text-white'
                }`}
                title={lang === 'tr' ? 'Çift Sayfa Dergi Görünümü' : 'Spread View'}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'tr' ? 'Çift Sayfa' : 'Spread'}</span>
              </button>

              <button
                onClick={() => setViewMode('single')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                  viewMode === 'single'
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-white/50 hover:text-white'
                }`}
                title={lang === 'tr' ? 'Tek Sayfa İnceleme Görünümü' : 'Single Page View'}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'tr' ? 'Tek Sayfa' : 'Single'}</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-white/50 hover:text-white'
                }`}
                title={lang === 'tr' ? 'Tüm Sayfalar Izgara Görünümü' : 'Grid View'}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'tr' ? 'Izgara (25)' : 'Grid (25)'}</span>
              </button>
            </div>
          </div>

          {/* Center Navigation & Jump Slider */}
          {viewMode !== 'grid' && (
            <div className="flex items-center gap-3 w-full md:w-auto justify-center bg-[#151515] px-4 py-1.5 rounded-full border border-white/10">
              <button
                onClick={prevPage}
                disabled={currentPage <= 1}
                className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition-colors"
                title={lang === 'tr' ? 'Önceki Sayfa (Sol Ok)' : 'Previous Page'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-semibold text-white">
                  {viewMode === 'double' && spreadRight ? `${spreadLeft}-${spreadRight}` : currentPage}
                </span>
                <span className="text-xs text-white/40">/ {TOTAL_PORTFOLIO_PAGES} {lang === 'tr' ? 'Sayfa' : 'Pages'}</span>
              </div>

              <input
                type="range"
                min={1}
                max={TOTAL_PORTFOLIO_PAGES}
                value={currentPage}
                onChange={(e) => jumpToPage(parseInt(e.target.value, 10))}
                className="w-24 sm:w-36 accent-white cursor-pointer"
              />

              <button
                onClick={nextPage}
                disabled={currentPage >= TOTAL_PORTFOLIO_PAGES}
                className="p-1 text-white/70 hover:text-white disabled:opacity-30 transition-colors"
                title={lang === 'tr' ? 'Sonraki Sayfa (Sağ Ok)' : 'Next Page'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Right Controls: Zoom & Fullscreen */}
          <div className="flex items-center gap-2">
            {viewMode !== 'grid' && (
              <div className="flex items-center bg-[#151515] p-1 rounded-full border border-white/10 text-white/70">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                    className="p-1.5 hover:text-white transition-colors"
                    title={lang === 'tr' ? 'Uzaklaştır' : 'Zoom Out'}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono px-1 text-white/80 font-bold min-w-[36px] text-center">
                    %{Math.round(zoomLevel * 100)}
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(3.5, z + 0.25))}
                    className="p-1.5 hover:text-white transition-colors"
                    title={lang === 'tr' ? 'Yakınlaştır' : 'Zoom In'}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {zoomLevel !== 1 && (
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-1.5 hover:text-white transition-colors text-amber-400"
                      title={lang === 'tr' ? 'Yakınlaştırmayı Sıfırla (%100)' : 'Reset Zoom (100%)'}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-[#151515] hover:bg-white/10 text-white/80 border border-white/10 rounded-full transition-colors"
              title={isFullscreen ? (lang === 'tr' ? 'Tam Ekrandan Çık' : 'Exit Fullscreen') : (lang === 'tr' ? 'Tam Ekran Yap' : 'Fullscreen')}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Main Reading / Magazine Stage */}
      <div 
        ref={stageRef}
        style={{ perspective: 1200 }}
        className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden select-none"
      >
        
        {/* GRID VIEW MODE */}
        {viewMode === 'grid' && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-white/70" /> {lang === 'tr' ? '25 Sayfa Portfolyo Katalog' : '25-Page Portfolio Catalog'}
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {lang === 'tr' ? 'Açmak istediğiniz paftaya tıklayarak dergi modunda inceleyin.' : 'Click any page to inspect in magazine reader view.'}
                </p>
              </div>
              <span className="text-[10px] tracking-widest font-mono uppercase text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {lang === 'tr' ? '25 PAFTA SEÇKİSİ' : '25 ARCHITECTURAL SHEETS'}
              </span>
            </div>

            {/* Landscape Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: TOTAL_PORTFOLIO_PAGES }).map((_, idx) => {
                const pageNum = idx + 1;
                const src = getPageImageSrc(pageNum);
                const meta = pageCategoryTitles[pageNum];

                return (
                  <motion.div
                    key={pageNum}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => jumpToPage(pageNum)}
                    className="bg-[#151515] border border-white/10 hover:border-white/30 rounded overflow-hidden cursor-pointer shadow-2xl group transition-all"
                  >
                    {/* Horizontal / Landscape Aspect Ratio (16:10) */}
                    <div className="aspect-[16/10] bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center">
                      {src ? (
                        <img
                          src={src}
                          alt={`Sayfa ${pageNum}`}
                          onError={() => handleImageError(pageNum)}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="p-3 text-center flex flex-col items-center justify-center h-full bg-red-950/20 border border-red-500/30">
                          <AlertTriangle className="w-5 h-5 text-red-400 mb-1 animate-pulse" />
                          <span className="text-[10px] font-mono text-red-300 font-bold uppercase">
                            {lang === 'tr' ? `Pafta ${pageNum} Yüklenemedi` : `Page ${pageNum} Error`}
                          </span>
                          <span className="text-[9px] text-white/50 font-mono mt-0.5">
                            public/portfolio{pageNum.toString().padStart(2, '0')}.jpg eksik
                          </span>
                        </div>
                      )}


                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs gap-1">
                        <Eye className="w-4 h-4" /> İncele
                      </div>
                    </div>

                    <div className="py-2 px-3 bg-[#151515] border-t border-white/10 text-center">
                      <span className="text-xs font-mono font-semibold tracking-widest text-white/80">
                        {pageNum.toString().padStart(2, '0')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* DOUBLE PAGE (MAGAZINE SPREAD) VIEW MODE - LANDSCAPE SPREAD */}
        {viewMode === 'double' && (
          <div className="w-full flex flex-col items-center justify-center my-auto relative">
            
            {/* Left Floating Arrow Button for Page Slide */}
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-3 rounded-full border border-white/20 transition-all z-30 disabled:opacity-0 shadow-2xl hover:scale-110"
              title="Önceki Sayfaya Kaydır"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Floating Arrow Button for Page Slide */}
            <button
              onClick={nextPage}
              disabled={currentPage >= TOTAL_PORTFOLIO_PAGES}
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-3 rounded-full border border-white/20 transition-all z-30 disabled:opacity-0 shadow-2xl hover:scale-110"
              title="Sonraki Sayfaya Kaydır"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <motion.div
              layout
              drag={zoomLevel > 1}
              dragConstraints={{
                left: -Math.max(0, (zoomLevel - 1) * 700),
                right: Math.max(0, (zoomLevel - 1) * 700),
                top: -Math.max(0, (zoomLevel - 1) * 450),
                bottom: Math.max(0, (zoomLevel - 1) * 450),
              }}
              dragElastic={0.06}
              style={{ scale: zoomLevel }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className={`relative max-w-6xl xl:max-w-7xl w-full aspect-[16/5] sm:aspect-[3.2/1] bg-white rounded-sm border border-white/20 shadow-2xl shadow-black flex overflow-hidden ring-1 ring-white/10 ${
                zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              {/* Interactive Right Edge Page Turn Zone */}
              {currentPage < TOTAL_PORTFOLIO_PAGES && zoomLevel === 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPage();
                  }}
                  className="absolute top-0 right-0 w-24 sm:w-36 h-full z-40 cursor-pointer group/edge flex items-center justify-end pr-4 select-none"
                  title="Sonraki Sayfaya Çevir"
                >
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white/80 opacity-40 group-hover/edge:opacity-100 group-hover/edge:scale-105 transition-all duration-300 shadow-xl">
                    <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">ÇEVİR</span>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover/edge:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              )}

              {/* Interactive Left Edge Page Turn Zone */}
              {currentPage > 1 && zoomLevel === 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPage();
                  }}
                  className="absolute top-0 left-0 w-24 sm:w-36 h-full z-40 cursor-pointer group/edge flex items-center justify-start pl-4 select-none"
                  title="Önceki Sayfaya Çevir"
                >
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white/80 opacity-40 group-hover/edge:opacity-100 group-hover/edge:scale-105 transition-all duration-300 shadow-xl">
                    <ChevronLeft className="w-4 h-4 text-amber-400 group-hover/edge:-translate-x-0.5 transition-transform" />
                    <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">GERİ</span>
                  </div>
                </div>
              )}

              {/* COVER PAGE (Page 1) or TWO-PAGE LANDSCAPE SPREAD */}
              {currentPage === 1 ? (
                /* Cover Page - Render directly filling container without surrounding mock frame */
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key="cover-page-1"
                    custom={direction}
                    variants={pageSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_e, info) => {
                      if (info.offset.x < -60 || info.velocity.x < -200) {
                        if (currentPage < TOTAL_PORTFOLIO_PAGES) nextPage();
                      }
                    }}
                    className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
                  >
                    {renderSinglePageCard(1, null)}
                  </motion.div>
                </AnimatePresence>
              ) : (
                /* TWO-PAGE LANDSCAPE SPREAD WITH REALISTIC PAGE FLIP & LIGHT SPINE BULGE (BOMBE) */
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`spread-${spreadLeft}`}
                    custom={direction}
                    variants={pageSlideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_e, info) => {
                      if (info.offset.x < -60 || info.velocity.x < -200) {
                        if (currentPage < TOTAL_PORTFOLIO_PAGES) nextPage();
                      } else if (info.offset.x > 60 || info.velocity.x > 200) {
                        if (currentPage > 1) prevPage();
                      }
                    }}
                    className="w-full h-full flex relative cursor-grab active:cursor-grabbing select-none"
                  >
                    {/* Left Page */}
                    <div className="w-1/2 h-full relative overflow-hidden">
                      {renderSinglePageCard(spreadLeft, false)}
                      {/* Left page inner shadow at book spine crease */}
                      <div className="absolute inset-y-0 right-0 w-8 sm:w-14 bg-gradient-to-l from-black/30 via-black/10 to-transparent pointer-events-none z-20" />
                    </div>

                    {/* Central Book Spine Crease Line (Sayfa Birleşim Yeri) */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-black/50 shadow-[0_0_8px_rgba(0,0,0,0.5)] pointer-events-none z-30" />

                    {/* Right Page */}
                    <div className="w-1/2 h-full relative overflow-hidden">
                      {/* Right page inner shadow at book spine crease */}
                      <div className="absolute inset-y-0 left-0 w-8 sm:w-14 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none z-20" />
                      {spreadRight ? (
                        renderSinglePageCard(spreadRight, true)
                      ) : (
                        <div className="w-full h-full bg-[#151515] flex flex-col items-center justify-center text-white/50 p-8 text-center">
                          <Compass className="w-8 h-8 text-white/60 mb-3" />
                          <h4 className="text-2xl font-serif italic text-white">
                            {lang === 'tr' ? 'Portfolyo Sonu' : 'End of Portfolio'}
                          </h4>
                          <p className="text-xs text-white/40 max-w-xs mt-1 font-light">
                            {lang === 'tr' ? 'Özlem Özge Güler 25 Sayfa Mimari Portfolyo Seçkisi' : 'Özlem Özge Güler 25-Page Architectural Portfolio Selection'}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        )}

        {/* SINGLE PAGE VIEW MODE - LANDSCAPE FORMAT */}
        {viewMode === 'single' && (
          <div className="w-full flex flex-col items-center justify-center my-auto relative">
            
            {/* Left Floating Arrow Button for Page Slide */}
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-3 rounded-full border border-white/20 transition-all z-30 disabled:opacity-0 shadow-2xl hover:scale-110"
              title="Önceki Sayfaya Kaydır"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Floating Arrow Button for Page Slide */}
            <button
              onClick={nextPage}
              disabled={currentPage >= TOTAL_PORTFOLIO_PAGES}
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-3 rounded-full border border-white/20 transition-all z-30 disabled:opacity-0 shadow-2xl hover:scale-110"
              title="Sonraki Sayfaya Kaydır"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <motion.div
              layout
              drag={zoomLevel > 1}
              dragConstraints={{
                left: -Math.max(0, (zoomLevel - 1) * 600),
                right: Math.max(0, (zoomLevel - 1) * 600),
                top: -Math.max(0, (zoomLevel - 1) * 400),
                bottom: Math.max(0, (zoomLevel - 1) * 400),
              }}
              dragElastic={0.06}
              style={{ scale: zoomLevel }}
              className={`relative max-w-5xl w-full aspect-[16/10] bg-white rounded-sm border border-white/20 shadow-2xl shadow-black overflow-hidden ring-1 ring-white/10 ${
                zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
            >
              {/* Interactive Right Edge Page Turn Zone */}
              {currentPage < TOTAL_PORTFOLIO_PAGES && zoomLevel === 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPage();
                  }}
                  className="absolute top-0 right-0 w-24 sm:w-32 h-full z-40 cursor-pointer group/edge flex items-center justify-end pr-4 select-none"
                  title="Sonraki Sayfa"
                >
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white/80 opacity-40 group-hover/edge:opacity-100 group-hover/edge:scale-105 transition-all duration-300 shadow-xl">
                    <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">ÇEVİR</span>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover/edge:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              )}

              {/* Interactive Left Edge Page Turn Zone */}
              {currentPage > 1 && zoomLevel === 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPage();
                  }}
                  className="absolute top-0 left-0 w-24 sm:w-32 h-full z-40 cursor-pointer group/edge flex items-center justify-start pl-4 select-none"
                  title="Önceki Sayfa"
                >
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white/80 opacity-40 group-hover/edge:opacity-100 group-hover/edge:scale-105 transition-all duration-300 shadow-xl">
                    <ChevronLeft className="w-4 h-4 text-amber-400 group-hover/edge:-translate-x-0.5 transition-transform" />
                    <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">GERİ</span>
                  </div>
                </div>
              )}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`page-${currentPage}`}
                  custom={direction}
                  variants={pageSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag={zoomLevel === 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_e, info) => {
                    if (zoomLevel > 1) return;
                    if (info.offset.x < -60 || info.velocity.x < -200) {
                      if (currentPage < TOTAL_PORTFOLIO_PAGES) nextPage();
                    } else if (info.offset.x > 60 || info.velocity.x > 200) {
                      if (currentPage > 1) prevPage();
                    }
                  }}
                  className="w-full h-full cursor-grab active:cursor-grabbing"
                >
                  {renderSinglePageCard(currentPage, null)}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        )}

      </div>

      {/* Bottom Thumbnail Navigation Strip */}
      {viewMode !== 'grid' && (
        <div className="bg-[#0F0F0F] border-t border-white/10 p-3 overflow-x-auto sticky bottom-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max px-2">
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] shrink-0 pr-3 border-r border-white/10">
              SAYFALAR (1-25):
            </span>

            {Array.from({ length: TOTAL_PORTFOLIO_PAGES }).map((_, idx) => {
              const pNum = idx + 1;
              const isActive =
                currentPage === pNum ||
                (viewMode === 'double' && (spreadLeft === pNum || spreadRight === pNum));

              return (
                <button
                  key={pNum}
                  onClick={() => jumpToPage(pNum)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-all shrink-0 border ${
                    isActive
                      ? 'bg-white text-black font-semibold border-white shadow'
                      : 'bg-[#151515] text-white/50 border-white/10 hover:text-white hover:border-white/30'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
