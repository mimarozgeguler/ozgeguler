export interface PortfolioPage {
  pageNumber: number;
  title?: string;
  category?: 'konut' | 'ticari' | 'ruhsat' | 'render' | 'detay' | 'kapak' | 'genel';
  description?: string;
  imageSrc: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  school: string;
  faculty: string;
  period: string;
}

export interface SkillItem {
  name: string;
  level: string;
  percentage: number;
}

export interface Certificate {
  title: string;
  date: string;
}

export interface Volunteer {
  organization: string;
  location: string;
  date: string;
  highlights: string[];
}

export interface CVData {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  birthDate: string;
  summary: string;
  experiences: WorkExperience[];
  education: Education[];
  technicalSkills: string[];
  softwareSkills: SkillItem[];
  languages: SkillItem[];
  driverLicense: string;
  certificates: Certificate[];
  volunteer: Volunteer[];
}
