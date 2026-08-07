// Utility to resolve public images with automatic file system scanning and fallbacks

export const getPublicFilenames = (): string[] => {
  return [
    'VESİKA.png',
    'portfolio01.jpg', 'portfolio02.jpg', 'portfolio03.jpg', 'portfolio04.jpg', 'portfolio05.jpg',
    'portfolio06.jpg', 'portfolio07.jpg', 'portfolio08.jpg', 'portfolio09.jpg', 'portfolio10.jpg',
    'portfolio11.jpg', 'portfolio12.jpg', 'portfolio13.jpg', 'portfolio14.jpg', 'portfolio15.jpg',
    'portfolio16.jpg', 'portfolio17.jpg', 'portfolio18.jpg', 'portfolio19.jpg', 'portfolio20.jpg',
    'portfolio21.jpg', 'portfolio22.jpg', 'portfolio23.jpg', 'portfolio24.jpg', 'portfolio25.jpg'
  ];
};

export const findPageImageInPublic = (pageNum: number): string | null => {
  const files = getPublicFilenames();
  const pageStr = pageNum.toString();
  const padded = pageStr.padStart(2, '0');

  // 1. Exact name matches prioritizing portfolio01, portfolio1, 01, 1, etc.
  const match = files.find((file) => {
    const lower = file.toLowerCase();
    const nameWithoutExt = lower.substring(0, lower.lastIndexOf('.')) || lower;
    return (
      nameWithoutExt === `portfolio${padded}` ||
      nameWithoutExt === `portfolio${pageStr}` ||
      nameWithoutExt === `portfolio_${padded}` ||
      nameWithoutExt === `portfolio_${pageStr}` ||
      nameWithoutExt === `portfolio-${padded}` ||
      nameWithoutExt === `portfolio-${pageStr}` ||
      nameWithoutExt === padded ||
      nameWithoutExt === pageStr ||
      nameWithoutExt === `sayfa${pageStr}` ||
      nameWithoutExt === `sayfa${padded}` ||
      nameWithoutExt === `pafta${pageStr}` ||
      nameWithoutExt === `pafta${padded}` ||
      nameWithoutExt === `page${pageStr}` ||
      nameWithoutExt === `page${padded}`
    );
  });

  if (match) {
    return `/${encodeURI(match)}`;
  }

  // 2. Flexible number match (e.g. "portfolio_01.jpg", "pafta_1.jpg")
  const numberRegex = new RegExp(`(?:^|\\D)(?:0*${pageStr})(?:\\D|$)`, 'i');
  const softMatch = files.find((file) => {
    const lower = file.toLowerCase();
    if (lower.includes('vesika') || lower.includes('fotograf') || lower.includes('profile')) return false;
    return numberRegex.test(lower);
  });

  return softMatch ? `/${encodeURI(softMatch)}` : null;
};

export const getPageCandidateUrls = (pageNum: number): string[] => {
  const candidates: string[] = [];

  const globMatch = findPageImageInPublic(pageNum);
  if (globMatch) {
    candidates.push(globMatch);
  }

  const pageStr = pageNum.toString();
  const padded = pageStr.padStart(2, '0');

  // Primary standard names - portfolio01.jpg format prioritized
  candidates.push(`/portfolio${padded}.jpg`);
  candidates.push(`/portfolio${pageStr}.jpg`);
  candidates.push(`/portfolio${padded}.png`);
  candidates.push(`/portfolio${padded}.jpeg`);
  candidates.push(`/portfolio${padded}.webp`);

  // Secondary fallbacks (01.jpg, 1.jpg, sayfa1.jpg)
  candidates.push(`/${padded}.jpg`);
  candidates.push(`/${pageStr}.jpg`);
  candidates.push(`/${padded}.png`);
  candidates.push(`/${pageStr}.png`);
  candidates.push(`/sayfa${pageStr}.jpg`);

  return Array.from(new Set(candidates));
};

export const getProfilePhotoCandidates = (defaultAvatar: string): string[] => {
  const files = getPublicFilenames();
  const candidates: string[] = [];

  files.forEach((file) => {
    const lower = file.toLowerCase();
    if (
      lower.includes('vesika') ||
      lower.includes('fotograf') ||
      lower.includes('foto') ||
      lower.includes('profile') ||
      lower.includes('avatar')
    ) {
      candidates.push(`/${encodeURI(file)}`);
    }
  });

  const staticCandidates = [
    '/VESİKA.png',
    '/VESİKA.jpg',
    '/VESİKA.jpeg',
    '/VESİKA.PNG',
    '/VESİKA.JPG',
    '/vesika.png',
    '/vesika.jpg',
    '/fotograf.jpg',
    '/fotograf.png',
    '/foto.jpg',
    '/profile.jpg',
    '/profile.png',
  ];

  staticCandidates.forEach((p) => candidates.push(p));
  candidates.push(defaultAvatar);

  return Array.from(new Set(candidates));
};
