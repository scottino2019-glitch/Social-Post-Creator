import React, { useState } from 'react';
import {
  TemplateDefinition,
  CanvasBackground,
  Layer,
  ShapeType,
  CanvasPresetId,
} from '../types';
import { TEMPLATES } from '../data/templates';
import { FONT_LIST, FontDefinition } from '../data/fonts';
import { FontPicker } from './FontPicker';
import { SHAPE_LIST } from '../data/shapes';
import { ICON_CATALOG, ICON_CATEGORIES } from '../data/icons';
import { COLOR_PALETTES, GRADIENT_PRESETS, PATTERN_PRESETS } from '../data/backgrounds';
import { SAMPLE_PHOTOS } from '../data/samplePhotos';
import {
  SINGLE_BOX_PRESETS,
  COLLAGE_GRID_LAYOUTS,
  SingleBoxPreset,
  CollageGridLayout,
} from '../data/boxes';
import {
  LayoutTemplate,
  Type,
  Sparkles,
  Shapes,
  Palette,
  Image as ImageIcon,
  Layers as LayersIcon,
  Search,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  ArrowUpDown,
  LayoutList,
  Plus,
  Quote,
  Flame,
  Grid,
  LayoutGrid,
  FileText,
  Smartphone,
  Square,
  RectangleVertical,
  RectangleHorizontal,
} from 'lucide-react';

export type SidebarTab =
  | 'templates'
  | 'boxes'
  | 'text'
  | 'photos'
  | 'shapes'
  | 'icons'
  | 'backgrounds'
  | 'layers';

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onApplyTemplate: (template: TemplateDefinition) => void;
  onNewBlankCanvas: (presetId?: CanvasPresetId) => void;
  onAddBoxPreset: (preset: SingleBoxPreset) => void;
  onApplyCollageGrid: (grid: CollageGridLayout) => void;
  onAddTextLayer: (presetType: 'title' | 'subtitle' | 'body' | 'quote' | 'badge' | 'handwriting') => void;
  onAddCustomTextLayer?: (options: {
    text: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: '400' | '500' | '600' | '700' | '800';
    fontStyle: 'normal' | 'italic';
    color: string;
    backgroundColor?: string;
    backgroundPadding?: number;
    backgroundBorderRadius?: number;
    letterSpacing?: number;
    textAlign?: 'left' | 'center' | 'right';
  }) => void;
  customFonts?: FontDefinition[];
  onAddCustomFont?: (font: FontDefinition) => void;
  onRemoveCustomFont?: (family: string) => void;
  onAddShapeLayer: (shapeType: ShapeType) => void;
  onAddIconLayer: (iconName: string) => void;
  onAddImageLayer: (src: string, name?: string) => void;
  onUploadImage: (file: File) => void;
  background: CanvasBackground;
  onChangeBackground: (bg: CanvasBackground) => void;
  layers: Layer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onReorderLayer: (fromIndex: number, toIndex: number) => void;
  onToggleLayerVisibility: (id: string) => void;
  onToggleLayerLock: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onBringToFront?: (id: string) => void;
  onSendToBack?: (id: string) => void;
  onAutoStackLayers?: () => void;
  onDistributeLayers?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onApplyTemplate,
  onNewBlankCanvas,
  onAddBoxPreset,
  onApplyCollageGrid,
  onAddTextLayer,
  onAddCustomTextLayer,
  customFonts = [],
  onAddCustomFont,
  onRemoveCustomFont,
  onAddShapeLayer,
  onAddIconLayer,
  onAddImageLayer,
  onUploadImage,
  background,
  onChangeBackground,
  layers,
  selectedLayerId,
  onSelectLayer,
  onReorderLayer,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onDeleteLayer,
  onBringToFront,
  onSendToBack,
  onAutoStackLayers,
  onDistributeLayers,
}) => {
  // Filters & searches
  const [templateCategory, setTemplateCategory] = useState<string>('all');
  const [iconCategory, setIconCategory] = useState<string>('Tutte');
  const [iconSearch, setIconSearch] = useState<string>('');
  const [shapeCategory, setShapeCategory] = useState<string>('all');
  const [bgSubTab, setBgSubTab] = useState<'solid' | 'gradient' | 'pattern' | 'custom'>('solid');

  // Free text composer state
  const [freeText, setFreeText] = useState<string>('Il mio messaggio speciale ✨');
  const [freeFont, setFreeFont] = useState<string>('Playfair Display');
  const [freeStylePreset, setFreeStylePreset] = useState<'title' | 'subtitle' | 'body' | 'script' | 'quote' | 'badge'>('title');
  const [freeColor, setFreeColor] = useState<string>('#ffffff');
  const [isFontPickerOpen, setIsFontPickerOpen] = useState<boolean>(false);

  const filteredTemplates = TEMPLATES.filter((t) => {
    if (templateCategory === 'all') return true;
    return t.category === templateCategory;
  });

  const filteredIcons = ICON_CATALOG.filter((item) => {
    const matchCat = iconCategory === 'Tutte' || item.category === iconCategory;
    const matchSearch =
      iconSearch.trim() === '' ||
      item.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
      item.label.toLowerCase().includes(iconSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredShapes = SHAPE_LIST.filter((s) => {
    if (shapeCategory === 'all') return true;
    return s.category === shapeCategory;
  });

  return (
    <aside className="w-80 md:w-96 bg-slate-900 border-r border-slate-800 flex flex-col h-full z-20 shrink-0 select-none">
      {/* Tab Navigation Icons */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-2 py-1.5 overflow-x-auto no-scrollbar space-x-1">
        {[
          { id: 'templates' as SidebarTab, label: 'Template', icon: LayoutTemplate },
          { id: 'boxes' as SidebarTab, label: 'Box Collage', icon: LayoutGrid },
          { id: 'text' as SidebarTab, label: 'Testo', icon: Type },
          { id: 'photos' as SidebarTab, label: 'Foto', icon: ImageIcon },
          { id: 'shapes' as SidebarTab, label: 'Forme', icon: Shapes },
          { id: 'icons' as SidebarTab, label: 'Icone', icon: Sparkles },
          { id: 'backgrounds' as SidebarTab, label: 'Sfondo', icon: Palette },
          { id: 'layers' as SidebarTab, label: 'Livelli', icon: LayersIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors shrink-0 ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* =========================================================================
            TAB 1: TEMPLATES
           ========================================================================= */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Template Pronti
              </h2>
              <p className="text-[11px] text-slate-500">
                Layout completi non commerciali per ogni occasione: citazioni, polaroid, consigli e collage.
              </p>
            </div>

            {/* Inizia con Foglio Bianco */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-800/80 to-slate-800/80 border-2 border-indigo-500/30 hover:border-indigo-400/60 rounded-xl p-3.5 transition-all shadow-sm">
              <div className="flex items-center space-x-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center text-slate-800 font-bold border border-slate-200 shrink-0">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Foglio Bianco
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-normal">
                      Nuovo da zero
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Tela bianca pulita per comporre liberamente con i tuoi box e testi
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onNewBlankCanvas('square')}
                  className="px-2 py-1.5 bg-slate-800/90 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 rounded-lg text-left text-[11px] text-slate-200 transition-colors flex items-center space-x-1.5"
                >
                  <Square className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Quadrato (1:1)</span>
                </button>
                <button
                  onClick={() => onNewBlankCanvas('story')}
                  className="px-2 py-1.5 bg-slate-800/90 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 rounded-lg text-left text-[11px] text-slate-200 transition-colors flex items-center space-x-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Storia (9:16)</span>
                </button>
                <button
                  onClick={() => onNewBlankCanvas('portrait')}
                  className="px-2 py-1.5 bg-slate-800/90 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 rounded-lg text-left text-[11px] text-slate-200 transition-colors flex items-center space-x-1.5"
                >
                  <RectangleVertical className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Ritratto (4:5)</span>
                </button>
                <button
                  onClick={() => onNewBlankCanvas('landscape')}
                  className="px-2 py-1.5 bg-slate-800/90 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 rounded-lg text-left text-[11px] text-slate-200 transition-colors flex items-center space-x-1.5"
                >
                  <RectangleHorizontal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">Panoramico (16:9)</span>
                </button>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Tutti' },
                { id: 'collage', label: 'Collage Foto' },
                { id: 'quote', label: 'Citazioni' },
                { id: 'polaroid', label: 'Polaroid' },
                { id: 'tips', label: 'Consigli' },
                { id: 'event', label: 'Eventi' },
                { id: 'celebration', label: 'Festa' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTemplateCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    templateCategory === cat.id
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 gap-3">
              {filteredTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  id={`template-item-${tmpl.id}`}
                  onClick={() => onApplyTemplate(tmpl)}
                  className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 rounded-xl p-3 cursor-pointer transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start space-x-3">
                    {/* Thumbnail preview box */}
                    <div
                      className="w-16 h-16 rounded-lg shrink-0 border border-slate-700/80 flex items-center justify-center p-2 text-slate-600 font-bold overflow-hidden shadow-inner"
                      style={{ background: tmpl.thumbnailBg }}
                    >
                      <LayoutTemplate className="w-6 h-6 text-slate-700/60" />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                          {tmpl.title}
                        </h3>
                        <span className="text-[10px] bg-slate-700/80 text-slate-300 px-1.5 py-0.5 rounded capitalize">
                          {tmpl.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                        {tmpl.description}
                      </p>
                      <div className="mt-2 flex items-center text-[10px] text-indigo-400 group-hover:text-indigo-300 font-medium">
                        <Plus className="w-3 h-3 mr-1" />
                        Applica alla tela
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: BOX LIBERI & COLLAGE
           ========================================================================= */}
        {activeTab === 'boxes' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Box Liberi & Collage
              </h2>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Costruisci il tuo collage su misura: aggiungi riquadri singoli da disporre liberamente oppure applica una griglia preimpostata sul foglio.
              </p>
            </div>

            {/* Inizia su Foglio Bianco Shortcut */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Nuovo Foglio Bianco</h4>
                  <p className="text-[10px] text-slate-400">Pulisce la tela per iniziare un nuovo collage</p>
                </div>
              </div>
              <button
                onClick={() => onNewBlankCanvas()}
                className="px-2.5 py-1 text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm shrink-0"
              >
                Crea Foglio
              </button>
            </div>

            {/* SEZIONE 1: Riquadri Singoli da Aggiungere e Spostare */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Square className="w-3.5 h-3.5 text-indigo-400" />
                  Riquadri Singoli Liberi
                </h3>
                <span className="text-[10px] text-slate-500">Clicca per aggiungere</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Aggiungi un riquadro alla tela, spostalo o ridimensionalo con i controlli e cliccaci per caricare la foto.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {SINGLE_BOX_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onAddBoxPreset(preset)}
                    className="group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 rounded-xl p-2.5 text-left transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="w-full aspect-[4/3] bg-slate-900/80 rounded-lg flex items-center justify-center p-2 mb-2 border border-slate-700/50 group-hover:border-indigo-500/30">
                      {/* Mini schematic preview */}
                      <div
                        className="bg-slate-800 border-2 border-indigo-400/80 flex items-center justify-center"
                        style={{
                          width: preset.width >= preset.height ? '75%' : `${(preset.width / preset.height) * 60}%`,
                          height: preset.height >= preset.width ? '75%' : `${(preset.height / preset.width) * 60}%`,
                          borderRadius: preset.borderRadius > 50 ? '9999px' : `${Math.min(preset.borderRadius / 4, 12)}px`,
                          boxShadow: preset.shadow ? '0 4px 10px rgba(0,0,0,0.3)' : undefined,
                        }}
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-400/80" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                        {preset.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-[10px] text-indigo-400 font-medium">
                      <Plus className="w-3 h-3 mr-0.5" />
                      Aggiungi alla tela
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SEZIONE 2: Griglie Preimpostate */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
                  Griglie Collage Preimpostate
                </h3>
                <span className="text-[10px] text-slate-500">Layout pronti</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dispone automaticamente i riquadri fotografici con spaziature equilibrate su tutto il foglio.
              </p>

              <div className="space-y-2">
                {COLLAGE_GRID_LAYOUTS.map((grid) => (
                  <div
                    key={grid.id}
                    onClick={() => onApplyCollageGrid(grid)}
                    className="group bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-indigo-500/50 rounded-xl p-3 cursor-pointer transition-all shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-950/40 border border-indigo-700/30 flex items-center justify-center shrink-0 text-indigo-400 font-bold">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                            {grid.name}
                          </h4>
                          <span className="text-[10px] bg-slate-700/80 text-slate-300 px-1.5 py-0.5 rounded shrink-0">
                            {grid.boxCount} Foto
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {grid.description}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-2 px-2.5 py-1 text-[10px] font-semibold bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white rounded-lg transition-colors shrink-0"
                    >
                      Applica
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggerimento utile */}
            <div className="bg-indigo-950/20 border border-indigo-800/30 rounded-xl p-3 text-[11px] text-indigo-300/90 leading-relaxed">
              <strong>💡 Come caricare le tue foto:</strong>
              <span className="block mt-1 text-slate-300">
                Clicca su qualsiasi riquadro presente sulla tela: nel pannello di destra (Ispettore) potrai cliccare su <em>"Carica Foto dal Computer"</em> oppure scegliere una delle foto grafiche fornite.
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: TESTO & TIPOGRAFIA
           ========================================================================= */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Testo Libero & Tipografia
              </h2>
              <p className="text-[11px] text-slate-500">
                Scrivi il tuo testo personalizzato, scegli tra i caratteri o carica i tuoi font personali (.ttf, .otf).
              </p>
            </div>

            {/* SEZIONE 1: COMPONI IL TUO TESTO LIBERO */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" />
                  Componi Testo Libero
                </span>
                <span className="text-[10px] text-slate-400">Scrivi e inserisci</span>
              </div>

              {/* Textarea */}
              <div>
                <textarea
                  rows={2}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="Scrivi qui il tuo messaggio o citazione..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              {/* Quick sample suggestions */}
              <div className="flex flex-wrap gap-1">
                {[
                  'Momento Speciale ✨',
                  'La bellezza nei dettagli',
                  'New Post 🚀',
                  'Relax & Benessere 🌿',
                ].map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => setFreeText(phrase)}
                    className="text-[10px] bg-slate-900/90 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded-md border border-slate-750 transition-colors"
                  >
                    {phrase}
                  </button>
                ))}
              </div>

              {/* Stile Preset */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Stile Testo</label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  {[
                    { id: 'title', label: 'Titolo', size: 72, weight: '700' },
                    { id: 'subtitle', label: 'Sottotitolo', size: 46, weight: '600' },
                    { id: 'body', label: 'Paragrafo', size: 38, weight: '400' },
                    { id: 'script', label: 'Corsivo', size: 52, weight: '400', font: 'Dancing Script' },
                    { id: 'quote', label: 'Citazione', size: 48, weight: '500', font: 'Cormorant Garamond', italic: true },
                    { id: 'badge', label: 'Badge', size: 28, weight: '700', isBadge: true },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setFreeStylePreset(st.id as any);
                        if (st.font) setFreeFont(st.font);
                      }}
                      className={`py-1 px-2 rounded-lg border text-center transition-colors ${
                        freeStylePreset === st.id
                          ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Chooser trigger card */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400">Carattere (Font)</label>
                  {customFonts.some((f) => f.family.toLowerCase() === freeFont.toLowerCase()) && (
                    <span className="text-[9px] text-amber-300 font-semibold bg-amber-500/20 px-1.5 py-0.2 rounded">
                      Personale ⭐
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsFontPickerOpen(true)}
                    className="flex-1 bg-slate-900 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500 rounded-xl p-2 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div
                        className="text-sm text-white truncate"
                        style={{ fontFamily: freeFont }}
                      >
                        {freeFont}
                      </div>
                      <span className="text-[9px] text-slate-400 group-hover:text-indigo-300">
                        Sfoglia tutti i font o carica il tuo (.ttf, .otf)
                      </span>
                    </div>
                    <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Color & Quick Palette */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400">Colore Testo</label>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="color"
                      value={freeColor}
                      onChange={(e) => setFreeColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-300">{freeColor}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['#ffffff', '#f8fafc', '#cbd5e1', '#38bdf8', '#818cf8', '#f43f5e', '#fbbf24', '#34d399', '#0f172a'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFreeColor(c)}
                      className={`w-5 h-5 rounded-md border transition-transform ${
                        freeColor === c ? 'scale-115 border-white ring-1 ring-white' : 'border-slate-700'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Insert Free Text CTA Button */}
              <button
                type="button"
                onClick={() => {
                  const isBadge = freeStylePreset === 'badge';
                  const isQuote = freeStylePreset === 'quote';
                  const isScript = freeStylePreset === 'script';
                  const isSubtitle = freeStylePreset === 'subtitle';
                  const isBody = freeStylePreset === 'body';

                  let fontSize = 72;
                  let fontWeight: '400' | '500' | '600' | '700' | '800' = '700';
                  let fontStyle: 'normal' | 'italic' = 'normal';
                  let backgroundColor: string | undefined = undefined;
                  let backgroundPadding: number | undefined = undefined;
                  let backgroundBorderRadius: number | undefined = undefined;
                  let letterSpacing = 0;

                  if (isBadge) {
                    fontSize = 28;
                    fontWeight = '700';
                    backgroundColor = '#4f46e5';
                    backgroundPadding = 16;
                    backgroundBorderRadius = 24;
                    letterSpacing = 2;
                  } else if (isQuote) {
                    fontSize = 48;
                    fontWeight = '500';
                    fontStyle = 'italic';
                  } else if (isScript) {
                    fontSize = 52;
                    fontWeight = '400';
                  } else if (isSubtitle) {
                    fontSize = 46;
                    fontWeight = '600';
                    letterSpacing = 1;
                  } else if (isBody) {
                    fontSize = 38;
                    fontWeight = '400';
                  }

                  if (onAddCustomTextLayer) {
                    onAddCustomTextLayer({
                      text: freeText.trim() || 'Il tuo testo qui...',
                      fontFamily: freeFont,
                      fontSize,
                      fontWeight,
                      fontStyle,
                      color: freeColor,
                      backgroundColor,
                      backgroundPadding,
                      backgroundBorderRadius,
                      letterSpacing,
                    });
                  } else {
                    onAddTextLayer('title');
                  }
                }}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Inserisci Testo sulla Tela</span>
              </button>
            </div>

            {/* SEZIONE 2: I TUOI FONT PERSONALI & CARICAMENTO */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Font Personali
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-semibold">
                  {customFonts.length} caricati
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Puoi usare qualsiasi file font dal tuo computer (.ttf, .otf, .woff) o aggiungere Google Fonts per nome.
              </p>

              <button
                type="button"
                onClick={() => setIsFontPickerOpen(true)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-750 hover:bg-slate-700 border border-slate-600/80 text-white rounded-xl text-xs font-semibold transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Carica Font Personale (.ttf, .otf)</span>
              </button>

              {customFonts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customFonts.map((cf) => (
                    <button
                      key={cf.family}
                      type="button"
                      onClick={() => setFreeFont(cf.family)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                        freeFont.toLowerCase() === cf.family.toLowerCase()
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-200 font-semibold'
                          : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span style={{ fontFamily: cf.family }}>{cf.name}</span>
                      <span className="text-[9px] text-amber-400/80">⭐</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SEZIONE 3: MODELLI RAPIDI PREIMPOSTATI */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300">Modelli Rapidi di Testo</h3>
                <span className="text-[10px] text-slate-500">1 click</span>
              </div>

              <div className="space-y-1.5">
                <button
                  id="add-text-title"
                  onClick={() => onAddTextLayer('title')}
                  className="w-full text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-2.5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-extrabold text-slate-100 font-['Playfair_Display']">
                      Titolo Grande d'Impatto
                    </div>
                    <span className="text-[10px] text-slate-400">Playfair Display, 72px, Bold</span>
                  </div>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                </button>

                <button
                  id="add-text-subtitle"
                  onClick={() => onAddTextLayer('subtitle')}
                  className="w-full text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-2.5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200 font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
                      Sottotitolo / Categoria
                    </div>
                    <span className="text-[10px] text-slate-400">Jakarta Sans, 44px, Semibold</span>
                  </div>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                </button>

                <button
                  id="add-text-body"
                  onClick={() => onAddTextLayer('body')}
                  className="w-full text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-2.5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs text-slate-300 font-['DM_Sans']">
                      Paragrafo di testo leggibile
                    </div>
                    <span className="text-[10px] text-slate-400">DM Sans, 38px, Regular</span>
                  </div>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                </button>

                <button
                  id="add-text-quote"
                  onClick={() => onAddTextLayer('quote')}
                  className="w-full text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-2.5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs italic text-amber-300 font-['Cormorant_Garamond']">
                      “Citazione o Aforisma Poetico”
                    </div>
                    <span className="text-[10px] text-slate-400">Cormorant Garamond, 48px, Italic</span>
                  </div>
                  <Quote className="w-4 h-4 text-amber-400/70" />
                </button>

                <button
                  id="add-text-handwriting"
                  onClick={() => onAddTextLayer('handwriting')}
                  className="w-full text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-2.5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-bold text-rose-300 font-['Caveat']">
                      Scrittura a mano & Nota spontanea
                    </div>
                    <span className="text-[10px] text-slate-400">Caveat, 54px, Spontaneo</span>
                  </div>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                </button>

                <button
                  id="add-text-badge"
                  onClick={() => onAddTextLayer('badge')}
                  className="w-full text-left bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/60 rounded-xl p-2.5 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                      TAG EVIDENZIATORE (28px)
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">Con pillola di sfondo</div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                </button>
              </div>
            </div>

            {/* SEZIONE 4: CATALOGO FONT */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tutti i Font Disponibili ({FONT_LIST.length + customFonts.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFontPickerOpen(true)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300"
                >
                  Vedi tutti...
                </button>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {[...customFonts, ...FONT_LIST].map((font) => (
                  <div
                    key={font.family}
                    onClick={() => {
                      setFreeFont(font.family);
                    }}
                    className={`p-2 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                      freeFont.toLowerCase() === font.family.toLowerCase()
                        ? 'bg-indigo-950/40 border-indigo-500 text-white'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-750 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className="text-sm font-medium truncate"
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </div>
                      <span className="text-[9px] text-slate-400">{font.description}</span>
                    </div>
                    {font.isCustom ? (
                      <span className="text-[9px] text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded shrink-0">
                        Personale
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded capitalize shrink-0">
                        {font.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Font Picker Modal */}
            <FontPicker
              isOpen={isFontPickerOpen}
              onClose={() => setIsFontPickerOpen(false)}
              currentFont={freeFont}
              onSelectFont={(fontFamily) => setFreeFont(fontFamily)}
              customFonts={customFonts}
              onAddCustomFont={onAddCustomFont || (() => {})}
              onRemoveCustomFont={onRemoveCustomFont || (() => {})}
              sampleText={freeText || 'Anteprima Carattere ✨'}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 3: LIBRERIA ICONE
           ========================================================================= */}
        {activeTab === 'icons' && (
          <div className="space-y-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Libreria Icone Open Source
              </h2>
              <p className="text-[11px] text-slate-500">
                Oltre 60 icone vettoriali per arricchire post, badge, reazioni e separatori.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="icon-search-input"
                type="text"
                placeholder="Cerca icona (es. cuore, sole, musica)..."
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1">
              {ICON_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setIconCategory(cat)}
                  className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
                    iconCategory === cat
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-1">
              {filteredIcons.map((item) => {
                const IconComp = item.component;
                return (
                  <button
                    key={item.name}
                    id={`icon-btn-${item.name}`}
                    onClick={() => onAddIconLayer(item.name)}
                    title={`${item.label} (${item.name})`}
                    className="flex flex-col items-center justify-center p-2.5 bg-slate-800/80 hover:bg-slate-750 hover:border-indigo-500/60 border border-slate-700/70 rounded-xl text-slate-300 hover:text-white transition-all group"
                  >
                    <IconComp className="w-6 h-6 mb-1 text-slate-300 group-hover:text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] text-slate-400 truncate w-full text-center group-hover:text-slate-200">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: FORME GEOMETRICHE & BADGE
           ========================================================================= */}
        {activeTab === 'shapes' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Forme & Badge
              </h2>
              <p className="text-[11px] text-slate-500">
                Forme geometriche essenziali, cornici polaroid, stelle, nastri e separatori.
              </p>
            </div>

            {/* Shape Categories */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'Tutte' },
                { id: 'basic', label: 'Base' },
                { id: 'badges', label: 'Stelle & Badge' },
                { id: 'layout', label: 'Cornici' },
                { id: 'dividers', label: 'Divisori' },
                { id: 'decorative', label: 'Decorative' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setShapeCategory(cat.id)}
                  className={`px-2 py-0.5 text-[10px] rounded-full transition-colors ${
                    shapeCategory === cat.id
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Shapes list */}
            <div className="grid grid-cols-2 gap-2">
              {filteredShapes.map((shape) => (
                <button
                  key={shape.type}
                  id={`shape-btn-${shape.type}`}
                  onClick={() => onAddShapeLayer(shape.type)}
                  className="p-3 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/70 hover:border-indigo-500/60 rounded-xl text-left transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-12 h-10 flex items-center justify-center mb-1.5 text-slate-400 group-hover:text-indigo-400">
                    {/* Visual icon preview for shape */}
                    {shape.type === 'rect' && <div className="w-8 h-6 border-2 border-current rounded-xs" />}
                    {shape.type === 'circle' && <div className="w-7 h-7 border-2 border-current rounded-full" />}
                    {shape.type === 'triangle' && <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-current" />}
                    {shape.type === 'diamond' && <div className="w-6 h-6 border-2 border-current rotate-45" />}
                    {shape.type === 'hexagon' && <Shapes className="w-6 h-6" />}
                    {shape.type === 'star5' && <Sparkles className="w-6 h-6" />}
                    {shape.type === 'star8' && <Sparkles className="w-6 h-6" />}
                    {shape.type === 'badge12' && <div className="w-7 h-7 rounded-full border-2 border-dashed border-current" />}
                    {shape.type === 'ribbon' && <div className="w-8 h-4 bg-current rounded-xs" />}
                    {shape.type === 'polaroid_card' && <div className="w-6 h-8 border-2 border-current pb-2" />}
                    {shape.type === 'speech_bubble' && <div className="w-7 h-5 border-2 border-current rounded-sm" />}
                    {shape.type === 'corner_frame' && <div className="w-7 h-7 border border-dashed border-current" />}
                    {shape.type === 'quote_mark' && <Quote className="w-6 h-6" />}
                    {shape.type === 'blob' && <div className="w-7 h-6 rounded-[40%_60%_70%_30%] border-2 border-current" />}
                    {shape.type === 'divider_solid' && <div className="w-8 h-1 bg-current rounded-full" />}
                    {shape.type === 'divider_dashed' && <div className="w-8 h-0 border-t-2 border-dashed border-current" />}
                    {shape.type === 'divider_wave' && <div className="w-8 h-2 border-b-2 border-current rounded-full" />}
                  </div>
                  <span className="text-[11px] font-medium text-slate-200 group-hover:text-indigo-300 line-clamp-1">
                    {shape.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: SFONDI (Colori, Gradienti, Pattern SVG, Immagini)
           ========================================================================= */}
        {activeTab === 'backgrounds' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Sfondo Tela
              </h2>
              <p className="text-[11px] text-slate-500">
                Personalizza con colori pieni d'autore, gradienti sofisticati o texture geometriche.
              </p>
            </div>

            {/* Sub Tabs */}
            <div className="flex bg-slate-800 rounded-lg p-1 space-x-1 text-xs">
              {[
                { id: 'solid' as const, label: 'Colori' },
                { id: 'gradient' as const, label: 'Gradienti' },
                { id: 'pattern' as const, label: 'Pattern SVG' },
                { id: 'custom' as const, label: 'Foto' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setBgSubTab(sub.id)}
                  className={`flex-1 py-1 text-center rounded-md font-medium transition-colors ${
                    bgSubTab === sub.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* 1. Solid Palettes */}
            {bgSubTab === 'solid' && (
              <div className="space-y-3">
                {/* Custom Color Picker Input */}
                <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                  <span className="text-xs text-slate-300">Colore personalizzato</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={background.color || '#ffffff'}
                      onChange={(e) =>
                        onChangeBackground({
                          type: 'solid',
                          color: e.target.value,
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-400">
                      {background.color || '#ffffff'}
                    </span>
                  </div>
                </div>

                {COLOR_PALETTES.map((pal) => (
                  <div key={pal.name} className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">{pal.name}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {pal.colors.map((c) => (
                        <button
                          key={c}
                          title={c}
                          onClick={() =>
                            onChangeBackground({
                              type: 'solid',
                              color: c,
                            })
                          }
                          className="w-7 h-7 rounded-lg border border-white/10 shadow-xs hover:scale-115 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Gradients */}
            {bgSubTab === 'gradient' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENT_PRESETS.map((grad) => (
                    <button
                      key={grad.id}
                      onClick={() =>
                        onChangeBackground({
                          type: 'gradient',
                          color: grad.stops[0].color,
                          gradient: {
                            type: grad.type,
                            angle: grad.angle,
                            stops: grad.stops,
                          },
                        })
                      }
                      className="group p-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all"
                    >
                      <div
                        className="w-full h-14 rounded-lg shadow-inner mb-1.5 border border-white/10 group-hover:scale-102 transition-transform"
                        style={{ background: grad.preview }}
                      />
                      <span className="text-[11px] font-medium text-slate-200 block truncate">
                        {grad.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SVG Patterns */}
            {bgSubTab === 'pattern' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {PATTERN_PRESETS.map((pat) => (
                    <button
                      key={pat.id}
                      onClick={() =>
                        onChangeBackground({
                          type: 'pattern',
                          color: background.color || '#f8fafc',
                          patternId: pat.id,
                          patternColor: '#cbd5e1',
                          patternScale: 28,
                        })
                      }
                      className="p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all flex flex-col items-center text-center group"
                    >
                      <Grid className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 mb-1" />
                      <span className="text-[11px] font-medium text-slate-200">
                        {pat.name}
                      </span>
                      <span className="text-[9px] text-slate-400 line-clamp-1">
                        {pat.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Custom Image Background */}
            {bgSubTab === 'custom' && (
              <div className="space-y-3">
                <label
                  htmlFor="bg-image-uploader"
                  className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer block transition-colors bg-slate-800/40"
                >
                  <Upload className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200 block">
                    Carica Sfondo dal Computer
                  </span>
                  <span className="text-[10px] text-slate-500">JPG, PNG, WebP (Completamente locale)</span>
                  <input
                    id="bg-image-uploader"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            onChangeBackground({
                              type: 'image',
                              color: '#000000',
                              imageUrl: ev.target.result as string,
                              imageOpacity: 1,
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {background.imageUrl && (
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">Opacità Sfondo</span>
                      <span className="text-xs text-slate-400">
                        {Math.round((background.imageOpacity ?? 1) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={background.imageOpacity ?? 1}
                      onChange={(e) =>
                        onChangeBackground({
                          ...background,
                          imageOpacity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-indigo-500"
                    />

                    <button
                      onClick={() =>
                        onChangeBackground({
                          type: 'solid',
                          color: '#ffffff',
                        })
                      }
                      className="w-full text-center text-xs text-rose-400 hover:text-rose-300 pt-1"
                    >
                      Rimuovi Immagine Sfondo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 6: FOTO & IMMAGINI (Upload + Sample Photos)
           ========================================================================= */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Foto & Collage
              </h2>
              <p className="text-[11px] text-slate-500">
                Carica le tue foto personali da ritagliare o prova le composizioni locali.
              </p>
            </div>

            {/* Offline Drag & Drop Uploader */}
            <label
              htmlFor="photo-layer-uploader"
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer block transition-colors bg-slate-800/40 group"
            >
              <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="text-xs font-semibold text-slate-200 block">
                Carica Foto dal Tuo Dispositivo
              </span>
              <span className="text-[10px] text-slate-500">
                Nessun caricamento server, 100% privato e offline
              </span>
              <input
                id="photo-layer-uploader"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadImage(file);
                  e.target.value = '';
                }}
              />
            </label>

            {/* Offline Sample Aesthetic Photos */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Foto di Esempio Pronte (Offline)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_PHOTOS.map((photo) => (
                  <button
                    key={photo.id}
                    id={`sample-photo-${photo.id}`}
                    onClick={() => onAddImageLayer(photo.dataUrl, photo.title)}
                    className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl p-1.5 text-left transition-all"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={photo.title}
                      className="w-full h-24 object-cover rounded-lg mb-1 group-hover:scale-102 transition-transform"
                    />
                    <span className="text-[10px] font-medium text-slate-300 block truncate">
                      {photo.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: GESTIONE LIVELLI (Layers Manager)
           ========================================================================= */}
        {activeTab === 'layers' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Livelli ({layers.length})
                </h2>
                <span className="text-[10px] text-slate-500">Dall'alto verso il basso (primo piano → sfondo)</span>
              </div>
            </div>

            {/* Quick Auto-arrangement on Scene */}
            {layers.length > 1 && (
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/80 space-y-1.5">
                <span className="text-[10px] font-semibold text-indigo-300 block uppercase tracking-wider">
                  Sistemazione sulla Scena
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onAutoStackLayers && onAutoStackLayers()}
                    title="Allinea e separa tutti gli elementi in colonna senza sovrapporli"
                    className="flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 rounded-lg text-indigo-200 text-[11px] font-medium transition-colors"
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span>Disponi in Colonna</span>
                  </button>
                  <button
                    onClick={() => onDistributeLayers && onDistributeLayers()}
                    title="Distribuisci equamente lo spazio verticale tra gli elementi"
                    className="flex items-center justify-center space-x-1.5 py-1.5 px-2 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 rounded-lg text-slate-200 text-[11px] font-medium transition-colors"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Distribuisci Spazi</span>
                  </button>
                </div>
              </div>
            )}

            {layers.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                Nessun elemento sulla tela. Aggiungi testo, forme o icone!
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {/* Reversed order: top layers shown first */}
                {[...layers].reverse().map((layer, revIdx) => {
                  const actualIdx = layers.length - 1 - revIdx;
                  const isSelected = layer.id === selectedLayerId;

                  const getTypeIcon = () => {
                    switch (layer.type) {
                      case 'text':
                        return <Type className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
                      case 'shape':
                        return <Square className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
                      case 'icon':
                        return <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
                      case 'image':
                        return <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
                    }
                  };

                  return (
                    <div
                      key={layer.id}
                      id={`layer-item-${layer.id}`}
                      onClick={() => onSelectLayer(layer.id)}
                      className={`flex flex-col p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm'
                          : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          {getTypeIcon()}
                          <div className="min-w-0 flex-1">
                            <span className="truncate font-medium block">{layer.name}</span>
                            <span className="text-[9px] font-mono text-slate-500 block">
                              X:{layer.x} Y:{layer.y} • {layer.width}×{layer.height}px
                            </span>
                          </div>
                        </div>

                        {/* Layer controls */}
                        <div className="flex items-center space-x-0.5 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
                          {/* Bring to absolute top */}
                          <button
                            onClick={() => onBringToFront && onBringToFront(layer.id)}
                            disabled={actualIdx === layers.length - 1}
                            title="Porta in cima (primo piano assoluto)"
                            className="p-1 text-slate-400 hover:text-indigo-300 disabled:opacity-20"
                          >
                            <ChevronsUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Move 1 step Up */}
                          <button
                            onClick={() => {
                              if (actualIdx < layers.length - 1) {
                                onReorderLayer(actualIdx, actualIdx + 1);
                              }
                            }}
                            disabled={actualIdx === layers.length - 1}
                            title="Porta sopra (+1)"
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Move 1 step Down */}
                          <button
                            onClick={() => {
                              if (actualIdx > 0) {
                                onReorderLayer(actualIdx, actualIdx - 1);
                              }
                            }}
                            disabled={actualIdx === 0}
                            title="Porta sotto (-1)"
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Send to absolute bottom */}
                          <button
                            onClick={() => onSendToBack && onSendToBack(layer.id)}
                            disabled={actualIdx === 0}
                            title="Invia in fondo (sullo sfondo assoluto)"
                            className="p-1 text-slate-400 hover:text-amber-300 disabled:opacity-20"
                          >
                            <ChevronsDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Visibility */}
                          <button
                            onClick={() => onToggleLayerVisibility(layer.id)}
                            title={layer.isHidden ? 'Mostra livello' : 'Nascondi livello'}
                            className={`p-1 ${layer.isHidden ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                          >
                            {layer.isHidden ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Lock */}
                          <button
                            onClick={() => onToggleLayerLock(layer.id)}
                            title={layer.isLocked ? 'Sblocca livello' : 'Blocca livello'}
                            className={`p-1 ${layer.isLocked ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                          >
                            {layer.isLocked ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteLayer(layer.id)}
                            title="Elimina livello"
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
