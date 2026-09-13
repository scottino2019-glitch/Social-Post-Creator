import { ShapeType } from '../types';

export interface ShapeDefinition {
  type: ShapeType;
  name: string;
  category: 'basic' | 'badges' | 'decorative' | 'dividers' | 'layout';
  defaultWidth: number;
  defaultHeight: number;
  defaultFill: string;
  defaultStroke: string;
  defaultStrokeWidth: number;
}

export const SHAPE_LIST: ShapeDefinition[] = [
  // Basic
  {
    type: 'rect',
    name: 'Rettangolo / Box',
    category: 'basic',
    defaultWidth: 320,
    defaultHeight: 200,
    defaultFill: '#ffffff',
    defaultStroke: '#e2e8f0',
    defaultStrokeWidth: 0,
  },
  {
    type: 'circle',
    name: 'Cerchio',
    category: 'basic',
    defaultWidth: 200,
    defaultHeight: 200,
    defaultFill: '#f8fafc',
    defaultStroke: '#cbd5e1',
    defaultStrokeWidth: 0,
  },
  {
    type: 'triangle',
    name: 'Triangolo',
    category: 'basic',
    defaultWidth: 200,
    defaultHeight: 180,
    defaultFill: '#f1f5f9',
    defaultStroke: '#94a3b8',
    defaultStrokeWidth: 0,
  },
  {
    type: 'diamond',
    name: 'Rombo',
    category: 'basic',
    defaultWidth: 180,
    defaultHeight: 180,
    defaultFill: '#f1f5f9',
    defaultStroke: '#94a3b8',
    defaultStrokeWidth: 0,
  },
  {
    type: 'hexagon',
    name: 'Esagono',
    category: 'basic',
    defaultWidth: 200,
    defaultHeight: 180,
    defaultFill: '#f8fafc',
    defaultStroke: '#64748b',
    defaultStrokeWidth: 2,
  },

  // Badges & Stars
  {
    type: 'star5',
    name: 'Stella a 5 Punte',
    category: 'badges',
    defaultWidth: 160,
    defaultHeight: 160,
    defaultFill: '#fbbf24',
    defaultStroke: 'transparent',
    defaultStrokeWidth: 0,
  },
  {
    type: 'star8',
    name: 'Stella a 8 Punte',
    category: 'badges',
    defaultWidth: 160,
    defaultHeight: 160,
    defaultFill: '#f59e0b',
    defaultStroke: 'transparent',
    defaultStrokeWidth: 0,
  },
  {
    type: 'badge12',
    name: 'Badge Sigillo (12 Punte)',
    category: 'badges',
    defaultWidth: 180,
    defaultHeight: 180,
    defaultFill: '#f43f5e',
    defaultStroke: '#ffffff',
    defaultStrokeWidth: 2,
  },
  {
    type: 'ribbon',
    name: 'Nastro Banner',
    category: 'badges',
    defaultWidth: 320,
    defaultHeight: 80,
    defaultFill: '#0ea5e9',
    defaultStroke: 'transparent',
    defaultStrokeWidth: 0,
  },

  // Layout & Cards
  {
    type: 'polaroid_card',
    name: 'Cornice Polaroid',
    category: 'layout',
    defaultWidth: 280,
    defaultHeight: 340,
    defaultFill: '#ffffff',
    defaultStroke: '#e2e8f0',
    defaultStrokeWidth: 1,
  },
  {
    type: 'speech_bubble',
    name: 'Fumetto Parlato',
    category: 'layout',
    defaultWidth: 280,
    defaultHeight: 180,
    defaultFill: '#ffffff',
    defaultStroke: '#0f172a',
    defaultStrokeWidth: 2,
  },
  {
    type: 'corner_frame',
    name: 'Cornice Angolari',
    category: 'layout',
    defaultWidth: 340,
    defaultHeight: 340,
    defaultFill: 'transparent',
    defaultStroke: '#f8fafc',
    defaultStrokeWidth: 3,
  },

  // Decorative & Dividers
  {
    type: 'quote_mark',
    name: 'Virgolette Giganti',
    category: 'decorative',
    defaultWidth: 120,
    defaultHeight: 100,
    defaultFill: '#94a3b8',
    defaultStroke: 'transparent',
    defaultStrokeWidth: 0,
  },
  {
    type: 'blob',
    name: 'Forma Organica / Macchia',
    category: 'decorative',
    defaultWidth: 280,
    defaultHeight: 260,
    defaultFill: '#e0e7ff',
    defaultStroke: 'transparent',
    defaultStrokeWidth: 0,
  },
  {
    type: 'divider_solid',
    name: 'Linea Divisoria Piena',
    category: 'dividers',
    defaultWidth: 300,
    defaultHeight: 4,
    defaultFill: '#94a3b8',
    defaultStroke: 'transparent',
    defaultStrokeWidth: 0,
  },
  {
    type: 'divider_dashed',
    name: 'Linea Tratteggiata',
    category: 'dividers',
    defaultWidth: 300,
    defaultHeight: 4,
    defaultFill: 'transparent',
    defaultStroke: '#94a3b8',
    defaultStrokeWidth: 2,
  },
  {
    type: 'divider_wave',
    name: 'Onda Decorativa',
    category: 'dividers',
    defaultWidth: 300,
    defaultHeight: 30,
    defaultFill: 'transparent',
    defaultStroke: '#6366f1',
    defaultStrokeWidth: 3,
  },
];
