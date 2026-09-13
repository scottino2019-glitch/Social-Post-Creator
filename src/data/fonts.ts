export interface FontDefinition {
  family: string;
  name: string;
  category: 'sans' | 'serif' | 'display' | 'handwriting' | 'mono';
  weights?: ('400' | '500' | '600' | '700' | '800')[];
  description: string;
  isCustom?: boolean;
  dataUrl?: string;
}

export const FONT_LIST: FontDefinition[] = [
  // Sans-serif
  {
    family: 'Plus Jakarta Sans',
    name: 'Jakarta Sans',
    category: 'sans',
    weights: ['400', '500', '600', '700'],
    description: 'Moderno, pulito e leggibile',
  },
  {
    family: 'Montserrat',
    name: 'Montserrat',
    category: 'sans',
    weights: ['400', '600', '700', '800'],
    description: 'Geometrico e contemporaneo',
  },
  {
    family: 'Outfit',
    name: 'Outfit',
    category: 'sans',
    weights: ['400', '600', '800'],
    description: 'Dinamico e amichevole',
  },
  {
    family: 'DM Sans',
    name: 'DM Sans',
    category: 'sans',
    weights: ['400', '700'],
    description: 'Equilibrato e versatile',
  },
  {
    family: 'Syne',
    name: 'Syne',
    category: 'sans',
    weights: ['600', '800'],
    description: 'Artistico ed espressivo',
  },
  {
    family: 'Zen Kaku Gothic New',
    name: 'Zen Kaku Gothic',
    category: 'sans',
    weights: ['400', '500', '700'],
    description: 'Gothico giapponese moderno e lineare',
  },

  // Serif
  {
    family: 'Playfair Display',
    name: 'Playfair Display',
    category: 'serif',
    weights: ['400', '500', '700'],
    description: 'Elegante, classico e raffinato',
  },
  {
    family: 'Cormorant Garamond',
    name: 'Cormorant',
    category: 'serif',
    weights: ['400', '600'],
    description: 'Letterario e poetico',
  },
  {
    family: 'Lora',
    name: 'Lora',
    category: 'serif',
    weights: ['400', '600'],
    description: 'Serif contemporaneo per storie e post',
  },
  {
    family: 'Cinzel',
    name: 'Cinzel',
    category: 'serif',
    weights: ['500', '700'],
    description: 'Monumentale e sofisticato',
  },
  {
    family: 'Cinzel Decorative',
    name: 'Cinzel Decorative',
    category: 'serif',
    weights: ['700'],
    description: 'Lettere capitali decorate e lussuose',
  },

  // Display / Bold
  {
    family: 'Bebas Neue',
    name: 'Bebas Neue',
    category: 'display',
    weights: ['400'],
    description: 'Titoli d\'impatto e poster',
  },
  {
    family: 'Anton',
    name: 'Anton',
    category: 'display',
    weights: ['400'],
    description: 'Ultra bold per titoli pubblicitari',
  },
  {
    family: 'Oswald',
    name: 'Oswald',
    category: 'display',
    weights: ['500', '700'],
    description: 'Compatto e forte',
  },
  {
    family: 'Righteous',
    name: 'Righteous',
    category: 'display',
    weights: ['400'],
    description: 'Stile geometrico vintage',
  },
  {
    family: 'Abril Fatface',
    name: 'Abril Fatface',
    category: 'display',
    weights: ['400'],
    description: 'Tipografia editoriale audace',
  },
  {
    family: 'Bungee Tint',
    name: 'Bungee Tint',
    category: 'display',
    weights: ['400'],
    description: 'Stile urbano colorato e impattante',
  },
  {
    family: 'Henny Penny',
    name: 'Henny Penny',
    category: 'display',
    weights: ['400'],
    description: 'Stravagante, giocoso e fiabesco',
  },
  {
    family: 'Londrina Shadow',
    name: 'Londrina Shadow',
    category: 'display',
    weights: ['400'],
    description: 'Titoli ombrati dallo stile poster brasiliano',
  },
  {
    family: 'Londrina Sketch',
    name: 'Londrina Sketch',
    category: 'display',
    weights: ['400'],
    description: 'Effetto bozzetto fatto a mano',
  },
  {
    family: 'Rock 3D',
    name: 'Rock 3D',
    category: 'display',
    weights: ['400'],
    description: 'Effetto tridimensionale audace e geometrico',
  },
  {
    family: 'Noto Color Emoji',
    name: 'Noto Color Emoji',
    category: 'display',
    weights: ['400'],
    description: 'Set di emoji a colori standard Google',
  },
  {
    family: 'Noto Emoji',
    name: 'Noto Emoji',
    category: 'display',
    weights: ['400', '500', '600', '700'],
    description: 'Emoji vettoriali monocromatiche',
  },

  // Handwriting / Script
  {
    family: 'Caveat',
    name: 'Caveat',
    category: 'handwriting',
    weights: ['400', '700'],
    description: 'Scrittura spontanea a mano',
  },
  {
    family: 'Dancing Script',
    name: 'Dancing Script',
    category: 'handwriting',
    weights: ['500', '700'],
    description: 'Corsivo fluido ed espressivo',
  },
  {
    family: 'Great Vibes',
    name: 'Great Vibes',
    category: 'handwriting',
    weights: ['400'],
    description: 'Corsivo calligrafico da invito e nozze',
  },
  {
    family: 'Sacramento',
    name: 'Sacramento',
    category: 'handwriting',
    weights: ['400'],
    description: 'Firma a mano sottile ed elegante',
  },
  {
    family: 'Alex Brush',
    name: 'Alex Brush',
    category: 'handwriting',
    weights: ['400'],
    description: 'Pennellata rapida e decorativa',
  },
  {
    family: 'Satisfy',
    name: 'Satisfy',
    category: 'handwriting',
    weights: ['400'],
    description: 'Scrittura a mano anni \'50 morbida',
  },
  {
    family: 'Pacifico',
    name: 'Pacifico',
    category: 'handwriting',
    weights: ['400'],
    description: 'Fresco, estivo e rotondo',
  },
  {
    family: 'Marck Script',
    name: 'Marck Script',
    category: 'handwriting',
    weights: ['400'],
    description: 'Corsivo aggraziato e leggibile',
  },
  {
    family: 'Permanent Marker',
    name: 'Permanent Marker',
    category: 'handwriting',
    weights: ['400'],
    description: 'Tratto deciso con pennarello',
  },
  {
    family: 'Crafty Girls',
    name: 'Crafty Girls',
    category: 'handwriting',
    weights: ['400'],
    description: 'Scrittura a mano informale e divertente',
  },
  {
    family: 'Gaegu',
    name: 'Gaegu',
    category: 'handwriting',
    weights: ['400', '700'],
    description: 'Stile coreano disegnato a mano e carino',
  },
  {
    family: 'Long Cang',
    name: 'Long Cang',
    category: 'handwriting',
    weights: ['400'],
    description: 'Calligrafia cinese corsiva a pennello',
  },
  {
    family: 'Ma Shan Zheng',
    name: 'Ma Shan Zheng',
    category: 'handwriting',
    weights: ['400'],
    description: 'Calligrafia cinese a pennello espressiva',
  },
  {
    family: 'Mr Dafoe',
    name: 'Mr Dafoe',
    category: 'handwriting',
    weights: ['400'],
    description: 'Corsivo retrò stile insegna classica',
  },
  {
    family: 'Nanum Brush Script',
    name: 'Nanum Brush Script',
    category: 'handwriting',
    weights: ['400'],
    description: 'Calligrafia coreana a pennello',
  },
  {
    family: 'Playwrite HR Lijeva',
    name: 'Playwrite HR Lijeva',
    category: 'handwriting',
    weights: ['100', '400'],
    description: 'Corsivo scolastico personalizzabile',
  },
  {
    family: 'Rock Salt',
    name: 'Rock Salt',
    category: 'handwriting',
    weights: ['400'],
    description: 'Tratto energico a pennarello feltro',
  },

  // Monospace / Retro
  {
    family: 'Space Grotesk',
    name: 'Space Grotesk',
    category: 'mono',
    weights: ['500', '700'],
    description: 'Tech moderno e audace',
  },
  {
    family: 'Fira Code',
    name: 'Fira Code',
    category: 'mono',
    weights: ['400', '600'],
    description: 'Stile macchina da scrivere digitale',
  },
];
