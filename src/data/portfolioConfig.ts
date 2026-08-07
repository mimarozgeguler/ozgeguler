import { PortfolioPage } from '../types';

export const TOTAL_PORTFOLIO_PAGES = 25;

export const pageCategoryTitles: Record<number, { title: string; category: string; description: string }> = {
  1: { title: "PORTFOLYO KAPAK", category: "Kapak", description: "Özlem Özge Güler - Mimari Portfolyo Seçkisi 2019-2025" },
  2: { title: "İÇİNDEKİLER & KONSEPT", category: "Genel", description: "Proje Dizinleri, Tasarım Metodolojisi ve Felsefesi" },
  3: { title: "KONUT PROJESİ - KONSEPT", category: "Konut", description: "Modern Yaşam Alanları ve Vaziyet Planı Analizi" },
  4: { title: "KONUT PROJESİ - KAT PLANLARI", category: "Konut", description: "Zemin ve Normal Kat Planları, Dolaşım Şemaları" },
  5: { title: "KONUT PROJESİ - KESİT & CEPHELER", category: "Konut", description: "A-A ve B-B Mimari Kesitleri, Doğu-Batı Cephe Detayları" },
  6: { title: "KARMA KULLANIM - PROJE GİRİŞ", category: "Ticari", description: "Kent İçi Karma Kullanımlı Kompleks Tasarımı" },
  7: { title: "KARMA KULLANIM - KÜTLE ŞEMALARI", category: "Ticari", description: "Form Oluşumu, Güneşlenme ve Rüzgar Analizleri" },
  8: { title: "KARMA KULLANIM - MİMARİ PLANLAR", category: "Ticari", description: "Ticari Baza ve Konut Blok Sistemi Planları" },
  9: { title: "BELEDİYE RUHSAT PAFTASI 01", category: "Ruhsat", description: "Ruhsat Çizim Standardı, Alan Hesap Cetvelleri" },
  10: { title: "BELEDİYE RUHSAT PAFTASI 02", category: "Ruhsat", description: "Sığınak, Otopark ve Yangın Tahliye Hesapları" },
  11: { title: "UYGULAMA PROJESİ - DETAY 01", category: "Detay", description: "Çatı ve Cephe Birleşim Sistem Detayları (1/10)" },
  12: { title: "UYGULAMA PROJESİ - DETAY 02", category: "Detay", description: "Merdiven Çözümleri ve Doğrama Detay Paftası" },
  13: { title: "3D GÖRSELLEŞTİRME - DIŞ MEKAN 01", category: "Render", description: "Dış Mekan Günışığı Render ve Malzeme Doku Analizi" },
  14: { title: "3D GÖRSELLEŞTİRME - DIŞ MEKAN 02", category: "Render", description: "Gece Atmosferi ve Cephe Aydınlatma Sahneleri" },
  15: { title: "3D GÖRSELLEŞTİRME - İÇ MEKAN 01", category: "Render", description: "Geniş Yaşam Alanı İç Mekan Lumion/Corona Render" },
  16: { title: "3D GÖRSELLEŞTİRME - İÇ MEKAN 02", category: "Render", description: "Mutfak ve Islak Hacim Detay İç Görselleri" },
  17: { title: "KAMUSAL ALAN & PARK TASARIMI", category: "Genel", description: "Kentsel Tasarım ve Peyzaj Entegrasyonu" },
  18: { title: "RESTORASYON & YENİDEN KULLANIM", category: "Genel", description: "Tarihi Doku Analizi ve Adaptif Yeniden Kullanım" },
  19: { title: "YARIŞMA PROJESİ - PAFTA 01", category: "Genel", description: "Mimari Fikir Yarışması Sunum Paftası" },
  20: { title: "YARIŞMA PROJESİ - PAFTA 02", category: "Genel", description: "Diyagramlar ve 3D İzometrik Patlatılmış Şemalar" },
  21: { title: "MALZEME & CEPHE MODÜLASYONU", category: "Detay", description: "Kompozit ve Ahşap Panel Cephe Sistem Paftası" },
  22: { title: "SÜRDÜRÜLEBİLİR MİMARİ ANALİZ", category: "Genel", description: "Pasif İklimlendirme ve Doğal Havalandırma Stratejileri" },
  23: { title: "AKUSTİK & AYDINLATMA ÇÖZÜMLERİ", category: "Ticari", description: "Auditorium ve Konferans Salonu Teknik Tasarımı" },
  24: { title: "MAKET & FİZİKSEL MODEL", category: "Genel", description: "1/100 ve 1/200 Çalışma Maketi Fotoğrafları" },
  25: { title: "SON SAYFA & İLETİŞİM", category: "Kapak", description: "Teşekkürler & İletişim Bilgileri" }
};

export function generatePortfolioPages(): PortfolioPage[] {
  const pages: PortfolioPage[] = [];

  for (let i = 1; i <= TOTAL_PORTFOLIO_PAGES; i++) {
    const meta = pageCategoryTitles[i] || {
      title: `PAFTA SAYFA ${i}`,
      category: "Genel",
      description: `Mimari Proje Çalışmaları - Sayfa ${i}`
    };

    pages.push({
      pageNumber: i,
      title: meta.title,
      description: meta.description,
      imageSrc: `/${i}.png`, // Primary path to 1.png, 2.png...
      fallbackTitle: meta.title,
      fallbackSubtitle: meta.description
    });
  }

  return pages;
}
