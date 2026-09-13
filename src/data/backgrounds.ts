import { CanvasPreset } from '../types';

export const CANVAS_PRESETS: CanvasPreset[] = [
  {
    id: 'square',
    name: 'Quadrato (1:1)',
    subtitle: '1080 × 1080 px • Instagram, Facebook, LinkedIn',
    width: 1080,
    height: 1080,
    iconName: 'Square',
  },
  {
    id: 'story',
    name: 'Storia / Reel (9:16)',
    subtitle: '1080 × 1920 px • Instagram Story, TikTok, Shorts',
    width: 1080,
    height: 1920,
    iconName: 'Smartphone',
  },
  {
    id: 'portrait',
    name: 'Ritratto (4:5)',
    subtitle: '1080 × 1350 px • Feed Instagram alto impatto',
    width: 1080,
    height: 1350,
    iconName: 'RectangleVertical',
  },
  {
    id: 'landscape',
    name: 'Orizzontale (16:9)',
    subtitle: '1200 × 675 px • Twitter / X, YouTube thumbnail',
    width: 1200,
    height: 675,
    iconName: 'RectangleHorizontal',
  },
  {
    id: 'banner',
    name: 'Banner / Feed (1.91:1)',
    subtitle: '1200 × 628 px • Post Facebook, Anteprime Web',
    width: 1200,
    height: 628,
    iconName: 'LayoutGrid',
  },
];

export interface ColorPalette {
  name: string;
  colors: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Minimal & Neutri',
    colors: ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#94a3b8', '#475569', '#1e293b', '#0f172a', '#020617'],
  },
  {
    name: 'Terra & Terracotta',
    colors: ['#fdf6ee', '#f7e1d7', '#edafb8', '#d67562', '#bc4749', '#7f4f24', '#582f0e', '#3a1e05'],
  },
  {
    name: 'Foresta & Muschio',
    colors: ['#f2f7f2', '#d8f3dc', '#b7e4c7', '#74c69d', '#40916c', '#2d6a4f', '#1b4332', '#081c15'],
  },
  {
    name: 'Tramonto & Calore',
    colors: ['#fff1e6', '#fde2e4', '#fad2e1', '#f07167', '#e76f51', '#f4a261', '#e9c46a', '#264653'],
  },
  {
    name: 'Oceano & Notte',
    colors: ['#f0f8ff', '#e0f2fe', '#bae6fd', '#38bdf8', '#0284c7', '#0369a1', '#1e3a8a', '#0a192f'],
  },
  {
    name: 'Pastello Creativo',
    colors: ['#fefae0', '#ffccd5', '#ffb3c6', '#e8dff5', '#fce1e4', '#ddedff', '#d8f8e1', '#cbf3f0'],
  },
  {
    name: 'Vibranti & Neon',
    colors: ['#ff0055', '#ff5400', '#ffbd00', '#10b981', '#06b6d4', '#6366f1', '#a855f7', '#ec4899'],
  },
];

export interface GradientPreset {
  id: string;
  name: string;
  type: 'linear' | 'radial';
  angle: number;
  stops: { color: string; offset: number }[];
  preview: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'aurora',
    name: 'Aurora Boreale',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#0f2027', offset: 0 },
      { color: '#203a43', offset: 50 },
      { color: '#2c5364', offset: 100 },
    ],
    preview: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  },
  {
    id: 'sunset_peach',
    name: 'Pesca al Tramonto',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#ff7e5f', offset: 0 },
      { color: '#feb47b', offset: 100 },
    ],
    preview: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
  },
  {
    id: 'cotton_candy',
    name: 'Nuvola Pastello',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#a1c4fd', offset: 0 },
      { color: '#c2e9fb', offset: 100 },
    ],
    preview: 'linear-gradient(120deg, #a1c4fd, #c2e9fb)',
  },
  {
    id: 'velvet_noir',
    name: 'Velluto Notturno',
    type: 'linear',
    angle: 180,
    stops: [
      { color: '#141e30', offset: 0 },
      { color: '#243b55', offset: 100 },
    ],
    preview: 'linear-gradient(180deg, #141e30, #243b55)',
  },
  {
    id: 'lavender_dream',
    name: 'Lavanda & Perla',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#f5f7fa', offset: 0 },
      { color: '#c3cfe2', offset: 100 },
    ],
    preview: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
  },
  {
    id: 'matcha_mint',
    name: 'Matcha & Salvia',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#d4fc79', offset: 0 },
      { color: '#96e6a1', offset: 100 },
    ],
    preview: 'linear-gradient(135deg, #d4fc79, #96e6a1)',
  },
  {
    id: 'deep_crimson',
    name: 'Rubino & Borgogna',
    type: 'linear',
    angle: 145,
    stops: [
      { color: '#4a00e0', offset: 0 },
      { color: '#8e2de2', offset: 100 },
    ],
    preview: 'linear-gradient(145deg, #4a00e0, #8e2de2)',
  },
  {
    id: 'warm_dune',
    name: 'Dune Calde',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#f3e7e9', offset: 0 },
      { color: '#e3eeff', offset: 100 },
    ],
    preview: 'linear-gradient(135deg, #f3e7e9, #e3eeff)',
  },
  {
    id: 'subtle_clay',
    name: 'Argilla & Lino',
    type: 'linear',
    angle: 160,
    stops: [
      { color: '#ece9e6', offset: 0 },
      { color: '#ffffff', offset: 100 },
    ],
    preview: 'linear-gradient(160deg, #ece9e6, #ffffff)',
  },
  {
    id: 'cyber_dusk',
    name: 'Bagliore Ciano',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#0052d4', offset: 0 },
      { color: '#4364f7', offset: 50 },
      { color: '#6fb1fc', offset: 100 },
    ],
    preview: 'linear-gradient(135deg, #0052d4, #4364f7, #6fb1fc)',
  },
];

export interface PatternPreset {
  id: string;
  name: string;
  description: string;
  generateSvg: (color: string, scale?: number) => string;
}

export const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'dots',
    name: 'Puntini Puntiformi',
    description: 'Matrice di piccoli punti ordinati',
    generateSvg: (color: string, scale = 24) => `
      <svg width="${scale}" height="${scale}" viewBox="0 0 ${scale} ${scale}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${scale / 2}" cy="${scale / 2}" r="${Math.max(1.5, scale / 12)}" fill="${color}" />
      </svg>
    `,
  },
  {
    id: 'grid',
    name: 'Griglia Geometrica',
    description: 'Linee orizzontali e verticali sottili',
    generateSvg: (color: string, scale = 32) => `
      <svg width="${scale}" height="${scale}" viewBox="0 0 ${scale} ${scale}" xmlns="http://www.w3.org/2000/svg">
        <path d="M ${scale} 0 L 0 0 0 ${scale}" fill="none" stroke="${color}" stroke-width="1"/>
      </svg>
    `,
  },
  {
    id: 'diagonal_lines',
    name: 'Righe Diagonali',
    description: 'Tratteggio obliquo a 45 gradi',
    generateSvg: (color: string, scale = 20) => `
      <svg width="${scale}" height="${scale}" viewBox="0 0 ${scale} ${scale}" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="${scale}" x2="${scale}" y2="0" stroke="${color}" stroke-width="1.5"/>
      </svg>
    `,
  },
  {
    id: 'crosses',
    name: 'Crocette Minimal',
    description: 'Piccole croci decorative ordinate',
    generateSvg: (color: string, scale = 36) => `
      <svg width="${scale}" height="${scale}" viewBox="0 0 ${scale} ${scale}" xmlns="http://www.w3.org/2000/svg">
        <path d="M ${scale/2 - 3} ${scale/2} h 6 M ${scale/2} ${scale/2 - 3} v 6" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: 'waves',
    name: 'Onde Sottili',
    description: 'Ondulazioni orizzontali armoniose',
    generateSvg: (color: string, scale = 40) => `
      <svg width="${scale}" height="${scale/2}" viewBox="0 0 ${scale} ${scale/2}" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 ${scale/4} Q ${scale/4} 0 ${scale/2} ${scale/4} T ${scale} ${scale/4}" fill="none" stroke="${color}" stroke-width="1.5"/>
      </svg>
    `,
  },
  {
    id: 'isometric',
    name: 'Griglia Isometrica',
    description: 'Texture romboidale tridimensionale',
    generateSvg: (color: string, scale = 36) => `
      <svg width="${scale}" height="${scale * 1.732}" viewBox="0 0 ${scale} ${scale * 1.732}" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 L ${scale} ${scale * 0.866} L 0 ${scale * 1.732} Z" fill="none" stroke="${color}" stroke-width="1"/>
      </svg>
    `,
  },
];
