export interface SamplePhoto {
  id: string;
  title: string;
  category: 'natura' | 'paesaggio' | 'minimal' | 'astratto' | 'architettura';
  dataUrl: string;
}

// Crisp inline SVGs encoded as data URLs so they load instantly and 100% offline
const makeSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'nature_foliage',
    title: 'Foglie Tropicali & Luce',
    category: 'natura',
    dataUrl: makeSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1b4332"/>
            <stop offset="100%" stop-color="#081c15"/>
          </linearGradient>
          <linearGradient id="leaf1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#74c69d"/>
            <stop offset="100%" stop-color="#2d6a4f"/>
          </linearGradient>
          <linearGradient id="leaf2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#52b788"/>
            <stop offset="100%" stop-color="#1b4332"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#bg)"/>
        <circle cx="650" cy="180" r="140" fill="#d8f3dc" opacity="0.25"/>
        <path d="M 0 800 C 150 600 250 400 350 200 C 450 400 400 700 300 800 Z" fill="url(#leaf1)" opacity="0.9"/>
        <path d="M 250 800 C 400 550 550 450 750 350 C 650 600 550 750 400 800 Z" fill="url(#leaf2)" opacity="0.85"/>
        <path d="M 50 800 Q 200 450 500 300" stroke="#d8f3dc" stroke-width="4" fill="none" opacity="0.5"/>
        <path d="M 280 800 Q 420 520 700 420" stroke="#d8f3dc" stroke-width="4" fill="none" opacity="0.4"/>
      </svg>
    `),
  },
  {
    id: 'sunset_horizon',
    title: 'Tramonto sulle Dune',
    category: 'paesaggio',
    dataUrl: makeSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#264653"/>
            <stop offset="45%" stop-color="#e76f51"/>
            <stop offset="70%" stop-color="#f4a261"/>
            <stop offset="100%" stop-color="#e9c46a"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#sky)"/>
        <circle cx="400" cy="380" r="130" fill="#fff" opacity="0.85"/>
        <path d="M 0 540 Q 200 480 400 530 T 800 510 L 800 800 L 0 800 Z" fill="#d67562"/>
        <path d="M 0 620 Q 300 580 550 630 T 800 600 L 800 800 L 0 800 Z" fill="#bc4749"/>
        <path d="M 0 710 Q 250 680 500 730 T 800 700 L 800 800 L 0 800 Z" fill="#7f4f24"/>
      </svg>
    `),
  },
  {
    id: 'minimal_architecture',
    title: 'Ombre & Architettura',
    category: 'architettura',
    dataUrl: makeSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#f8fafc"/>
        <rect x="120" y="80" width="560" height="640" fill="#e2e8f0"/>
        <polygon points="120,720 400,240 680,720" fill="#0f172a" opacity="0.9"/>
        <polygon points="400,240 680,720 680,240" fill="#3b82f6" opacity="0.8"/>
        <circle cx="280" cy="240" r="70" fill="#f59e0b"/>
        <line x1="80" y1="80" x2="720" y2="720" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,6"/>
      </svg>
    `),
  },
  {
    id: 'ocean_breeze',
    title: 'Oceano & Onde Blu',
    category: 'paesaggio',
    dataUrl: makeSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="oceanBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#bae6fd"/>
            <stop offset="50%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#082f49"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="url(#oceanBg)"/>
        <circle cx="200" cy="180" r="60" fill="#ffffff" opacity="0.9"/>
        <path d="M 0 460 Q 200 420 400 460 T 800 460 L 800 800 L 0 800 Z" fill="#0369a1" opacity="0.7"/>
        <path d="M 0 550 Q 200 500 400 550 T 800 550 L 800 800 L 0 800 Z" fill="#0284c7" opacity="0.8"/>
        <path d="M 0 650 Q 200 600 400 650 T 800 650 L 800 800 L 0 800 Z" fill="#38bdf8" opacity="0.6"/>
      </svg>
    `),
  },
  {
    id: 'cozy_coffee',
    title: 'Momento Caffè & Lettura',
    category: 'minimal',
    dataUrl: makeSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <rect width="800" height="800" fill="#fdf6ee"/>
        <circle cx="400" cy="400" r="260" fill="#f7e1d7"/>
        <circle cx="400" cy="400" r="180" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
        <circle cx="400" cy="400" r="140" fill="#6f4e37"/>
        <circle cx="380" cy="380" r="100" fill="#4a3525"/>
        <path d="M 360 360 C 370 320 420 320 430 360 C 440 400 390 420 360 360" fill="#fdf6ee" opacity="0.85"/>
        <rect x="180" y="660" width="440" height="20" rx="10" fill="#d67562" opacity="0.5"/>
      </svg>
    `),
  },
  {
    id: 'abstract_waves',
    title: 'Forme Fluide & Astratte',
    category: 'astratto',
    dataUrl: makeSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
        <defs>
          <linearGradient id="gradFlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1"/>
            <stop offset="50%" stop-color="#ec4899"/>
            <stop offset="100%" stop-color="#fbbf24"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="#0f172a"/>
        <circle cx="400" cy="400" r="320" fill="url(#gradFlow)" opacity="0.85"/>
        <path d="M 200 400 Q 300 200 500 300 T 700 500 Q 500 700 300 600 Z" fill="#ffffff" opacity="0.2"/>
        <circle cx="280" cy="280" r="90" fill="#0f172a" opacity="0.4"/>
      </svg>
    `),
  },
];
