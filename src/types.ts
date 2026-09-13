export type CanvasPresetId = 'square' | 'story' | 'portrait' | 'landscape' | 'banner';

export interface CanvasPreset {
  id: CanvasPresetId;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  iconName: string;
}

export type LayerType = 'text' | 'shape' | 'icon' | 'image';

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  opacity: number; // 0 to 1
  isLocked: boolean;
  isHidden: boolean;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: '400' | '500' | '600' | '700' | '800';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  letterSpacing: number; // in px
  lineHeight: number; // multiplier e.g. 1.2
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  backgroundColor?: string;
  backgroundPadding?: number;
  backgroundBorderRadius?: number;
}

export type ShapeType =
  | 'rect'
  | 'circle'
  | 'triangle'
  | 'star5'
  | 'star8'
  | 'badge12'
  | 'hexagon'
  | 'diamond'
  | 'speech_bubble'
  | 'polaroid_card'
  | 'ribbon'
  | 'quote_mark'
  | 'divider_solid'
  | 'divider_dashed'
  | 'divider_wave'
  | 'blob'
  | 'corner_frame';

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  borderRadius: number;
}

export interface IconLayer extends BaseLayer {
  type: 'icon';
  iconName: string;
  color: string;
  strokeWidth: number;
}

export type FrameStyle = 'none' | 'polaroid' | 'classic' | 'passepartout' | 'film';

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  objectFit: 'cover' | 'contain';
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  filters: {
    brightness: number; // 0 to 200 (100 is default)
    contrast: number; // 0 to 200 (100 is default)
    saturation: number; // 0 to 200 (100 is default)
    grayscale: number; // 0 to 100
    sepia: number; // 0 to 100
    blur: number; // 0 to 20 in px
  };
  frameStyle?: FrameStyle;
  frameColor?: string; // background color of the frame (default white #ffffff)
  caption?: string; // text caption (especially for polaroid)
  captionFontFamily?: string;
  captionFontSize?: number;
  captionColor?: string;
  captionAlign?: 'left' | 'center' | 'right';
}

export type Layer = TextLayer | ShapeLayer | IconLayer | ImageLayer;

export type BackgroundType = 'solid' | 'gradient' | 'pattern' | 'image';

export interface CanvasBackground {
  type: BackgroundType;
  color: string;
  gradient?: {
    type: 'linear' | 'radial';
    angle: number; // degrees
    stops: { color: string; offset: number }[];
  };
  patternId?: string;
  patternColor?: string;
  patternScale?: number;
  imageUrl?: string;
  imageOpacity?: number;
  imageBlur?: number;
}

export interface ProjectState {
  version: number;
  name: string;
  preset: CanvasPresetId;
  width: number;
  height: number;
  background: CanvasBackground;
  layers: Layer[];
}

export interface TemplateDefinition {
  id: string;
  title: string;
  category: 'quote' | 'collage' | 'polaroid' | 'tips' | 'event' | 'artistic' | 'minimal' | 'celebration';
  description: string;
  preset: CanvasPresetId;
  background: CanvasBackground;
  layers: Layer[];
  thumbnailBg: string;
}
