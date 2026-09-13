import { ImageLayer, Layer } from '../types';

export const PHOTO_PLACEHOLDER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <rect width="600" height="600" fill="#f8fafc"/>
  <rect x="24" y="24" width="552" height="552" rx="16" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-dasharray="14,14"/>
  <circle cx="300" cy="250" r="70" fill="#e2e8f0"/>
  <path d="M 240 280 L 280 230 L 320 270 L 350 240 L 380 285 Z" fill="#94a3b8"/>
  <circle cx="270" cy="220" r="16" fill="#94a3b8"/>
  <text x="300" y="375" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" fill="#475569" text-anchor="middle">Riquadro Foto Libero</text>
  <text x="300" y="415" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">Clicca nell'ispettore per caricare la foto</text>
</svg>
`.trim())}`;

export interface SingleBoxPreset {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  objectFit: 'cover' | 'contain';
  initialSrc?: string;
  frameStyle?: 'none' | 'polaroid' | 'classic' | 'passepartout' | 'film';
  frameColor?: string;
  caption?: string;
  captionFontFamily?: string;
  captionFontSize?: number;
  captionColor?: string;
}

export const SINGLE_BOX_PRESETS: SingleBoxPreset[] = [
  {
    id: 'box_square',
    name: 'Riquadro Quadrato 1:1',
    description: 'Classico riquadro per feed social e griglie simmetriche',
    width: 440,
    height: 440,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    objectFit: 'cover',
  },
  {
    id: 'box_portrait',
    name: 'Riquadro Ritratto 4:5',
    description: 'Formato verticale ottimizzato per figure e ritratti',
    width: 380,
    height: 475,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    objectFit: 'cover',
  },
  {
    id: 'box_landscape',
    name: 'Riquadro Orizzontale 16:9',
    description: 'Formato panoramico per paesaggi o dettagli orizzontali',
    width: 520,
    height: 292,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    objectFit: 'cover',
  },
  {
    id: 'box_story',
    name: 'Riquadro Verticale Storia',
    description: 'Riquadro alto e slanciato stile Instagram Story',
    width: 320,
    height: 568,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    objectFit: 'cover',
  },
  {
    id: 'box_circle',
    name: 'Riquadro Tondo (Avatar)',
    description: 'Cerchio perfetto con bordo per foto profilo o accenti',
    width: 380,
    height: 380,
    borderRadius: 190,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadow: { color: 'rgba(0,0,0,0.12)', blur: 16, offsetX: 0, offsetY: 6 },
    objectFit: 'cover',
  },
  {
    id: 'box_polaroid',
    name: 'Cornice Polaroid Vintage',
    description: 'Polaroid unificata: cornice e foto unite per sovrapposizioni perfette',
    width: 380,
    height: 470,
    borderRadius: 6,
    borderWidth: 0,
    borderColor: 'transparent',
    shadow: { color: 'rgba(0,0,0,0.18)', blur: 26, offsetX: 0, offsetY: 12 },
    objectFit: 'cover',
    frameStyle: 'polaroid',
    frameColor: '#ffffff',
    caption: 'Momento Speciale ✨',
    captionFontFamily: 'Caveat',
    captionFontSize: 28,
    captionColor: '#334155',
  },
  {
    id: 'box_soft_card',
    name: 'Card Morbida Smussata',
    description: 'Angoli ampi e ombra soft per uno stile moderno',
    width: 440,
    height: 440,
    borderRadius: 28,
    borderWidth: 0,
    borderColor: 'transparent',
    shadow: { color: 'rgba(0,0,0,0.15)', blur: 20, offsetX: 0, offsetY: 8 },
    objectFit: 'cover',
  },
  {
    id: 'box_dark_frame',
    name: 'Cornice Scura Elegante',
    description: 'Bordo sottile scuro per collage minimalisti',
    width: 420,
    height: 420,
    borderRadius: 0,
    borderWidth: 3,
    borderColor: '#0f172a',
    objectFit: 'cover',
  },
];

export interface CollageGridLayout {
  id: string;
  name: string;
  description: string;
  boxCount: number;
  generateLayers: (canvasWidth: number, canvasHeight: number) => Layer[];
}

export const COLLAGE_GRID_LAYOUTS: CollageGridLayout[] = [
  {
    id: 'grid_duo_horizontal',
    name: 'Duo 2 Foto (50 / 50)',
    description: 'Due grandi riquadri affiancati per confronti o coppie di foto',
    boxCount: 2,
    generateLayers: (w, h) => {
      const padding = Math.round(w * 0.05);
      const gap = Math.round(w * 0.03);
      const boxW = Math.round((w - padding * 2 - gap) / 2);
      const boxH = Math.round(h - padding * 2);

      return [
        {
          id: `box_duo_1_${Date.now()}`,
          type: 'image',
          name: 'Foto Sinistra',
          x: padding,
          y: padding,
          width: boxW,
          height: boxH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_duo_2_${Date.now() + 1}`,
          type: 'image',
          name: 'Foto Destra',
          x: padding + boxW + gap,
          y: padding,
          width: boxW,
          height: boxH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
      ];
    },
  },
  {
    id: 'grid_duo_vertical',
    name: 'Duo 2 Foto (Sopra & Sotto)',
    description: 'Due riquadri panoramici impilati verticalmente',
    boxCount: 2,
    generateLayers: (w, h) => {
      const padding = Math.round(w * 0.05);
      const gap = Math.round(h * 0.03);
      const boxW = Math.round(w - padding * 2);
      const boxH = Math.round((h - padding * 2 - gap) / 2);

      return [
        {
          id: `box_vert_1_${Date.now()}`,
          type: 'image',
          name: 'Foto Superiore',
          x: padding,
          y: padding,
          width: boxW,
          height: boxH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_vert_2_${Date.now() + 1}`,
          type: 'image',
          name: 'Foto Inferiore',
          x: padding,
          y: padding + boxH + gap,
          width: boxW,
          height: boxH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
      ];
    },
  },
  {
    id: 'grid_trio_hero',
    name: 'Trio Mosaico (1 Grande + 2 Piccoli)',
    description: 'Un riquadro hero prominente a sinistra e due dettagli a destra',
    boxCount: 3,
    generateLayers: (w, h) => {
      const padding = Math.round(w * 0.05);
      const gap = Math.round(w * 0.03);
      const totalW = w - padding * 2;
      const totalH = h - padding * 2;

      const heroW = Math.round(totalW * 0.58);
      const sideW = totalW - heroW - gap;
      const sideH = Math.round((totalH - gap) / 2);

      return [
        {
          id: `box_hero_${Date.now()}`,
          type: 'image',
          name: 'Foto Principale',
          x: padding,
          y: padding,
          width: heroW,
          height: totalH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_side1_${Date.now() + 1}`,
          type: 'image',
          name: 'Dettaglio Alto',
          x: padding + heroW + gap,
          y: padding,
          width: sideW,
          height: sideH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_side2_${Date.now() + 2}`,
          type: 'image',
          name: 'Dettaglio Basso',
          x: padding + heroW + gap,
          y: padding + sideH + gap,
          width: sideW,
          height: sideH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 14,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
      ];
    },
  },
  {
    id: 'grid_quad_2x2',
    name: 'Griglia 4 Foto (2x2)',
    description: 'Quattro riquadri quadrati bilanciati per un collage armonico',
    boxCount: 4,
    generateLayers: (w, h) => {
      const padding = Math.round(w * 0.05);
      const gap = Math.round(w * 0.03);
      const boxW = Math.round((w - padding * 2 - gap) / 2);
      const boxH = Math.round((h - padding * 2 - gap) / 2);

      return [
        {
          id: `box_quad_1_${Date.now()}`,
          type: 'image',
          name: 'Foto 1 (Alto Sx)',
          x: padding,
          y: padding,
          width: boxW,
          height: boxH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_quad_2_${Date.now() + 1}`,
          type: 'image',
          name: 'Foto 2 (Alto Dx)',
          x: padding + boxW + gap,
          y: padding,
          width: boxW,
          height: boxH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_quad_3_${Date.now() + 2}`,
          type: 'image',
          name: 'Foto 3 (Basso Sx)',
          x: padding,
          y: padding + boxH + gap,
          width: boxW,
          height: boxH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_quad_4_${Date.now() + 3}`,
          type: 'image',
          name: 'Foto 4 (Basso Dx)',
          x: padding + boxW + gap,
          y: padding + boxH + gap,
          width: boxW,
          height: boxH,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#e2e8f0',
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
      ];
    },
  },
  {
    id: 'grid_six_3x2',
    name: 'Mosaico 6 Foto (3x2)',
    description: 'Sei riquadri per un catalogo o una gallery ricca di scatti',
    boxCount: 6,
    generateLayers: (w, h) => {
      const padding = Math.round(w * 0.05);
      const gap = Math.round(w * 0.025);
      const boxW = Math.round((w - padding * 2 - gap * 2) / 3);
      const boxH = Math.round((h - padding * 2 - gap) / 2);

      const layers: Layer[] = [];
      let idx = 1;
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          layers.push({
            id: `box_grid6_${idx}_${Date.now() + idx}`,
            type: 'image',
            name: `Foto ${idx}`,
            x: padding + col * (boxW + gap),
            y: padding + row * (boxH + gap),
            width: boxW,
            height: boxH,
            rotation: 0,
            opacity: 1,
            isLocked: false,
            isHidden: false,
            src: PHOTO_PLACEHOLDER_SVG,
            objectFit: 'cover',
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#e2e8f0',
            filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
          });
          idx++;
        }
      }
      return layers;
    },
  },
  {
    id: 'grid_polaroid_trio',
    name: 'Tris Polaroid Sparse Vintage',
    description: 'Tre stampe polaroid sovrapposte con cornice e didascalia integrate',
    boxCount: 3,
    generateLayers: (w, h) => {
      const pW = Math.round(w * 0.44);
      const pH = Math.round(pW * 1.25);

      return [
        {
          id: `box_pola_1_${Date.now()}`,
          type: 'image',
          name: 'Polaroid Sx',
          x: Math.round(w * 0.12),
          y: Math.round(h * 0.18),
          width: pW,
          height: pH,
          rotation: -7,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          frameStyle: 'polaroid',
          frameColor: '#ffffff',
          caption: 'Scatto #1 • Ricordo ✨',
          captionFontFamily: 'Caveat',
          captionFontSize: 24,
          captionColor: '#334155',
          borderRadius: 6,
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: { color: 'rgba(0,0,0,0.18)', blur: 24, offsetX: 0, offsetY: 10 },
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_pola_2_${Date.now() + 1}`,
          type: 'image',
          name: 'Polaroid Dx',
          x: Math.round(w * 0.45),
          y: Math.round(h * 0.12),
          width: pW,
          height: pH,
          rotation: 6,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          frameStyle: 'polaroid',
          frameColor: '#ffffff',
          caption: 'Scatto #2 • Estate ☀️',
          captionFontFamily: 'Caveat',
          captionFontSize: 24,
          captionColor: '#334155',
          borderRadius: 6,
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: { color: 'rgba(0,0,0,0.22)', blur: 28, offsetX: 0, offsetY: 12 },
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
        {
          id: `box_pola_3_${Date.now() + 2}`,
          type: 'image',
          name: 'Polaroid Centro Basso',
          x: Math.round(w * 0.28),
          y: Math.round(h * 0.46),
          width: pW,
          height: pH,
          rotation: -2,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          src: PHOTO_PLACEHOLDER_SVG,
          objectFit: 'cover',
          frameStyle: 'polaroid',
          frameColor: '#ffffff',
          caption: 'Scatto #3 • Sorrisi 🤍',
          captionFontFamily: 'Caveat',
          captionFontSize: 24,
          captionColor: '#334155',
          borderRadius: 6,
          borderWidth: 0,
          borderColor: 'transparent',
          shadow: { color: 'rgba(0,0,0,0.26)', blur: 32, offsetX: 0, offsetY: 14 },
          filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
        },
      ];
    },
  },
];
