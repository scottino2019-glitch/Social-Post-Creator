import React, { useState } from 'react';
import {
  Layer,
  TextLayer,
  ShapeLayer,
  IconLayer,
  ImageLayer,
  ProjectState,
  CanvasPresetId,
} from '../types';
import { FONT_LIST, FontDefinition } from '../data/fonts';
import { FontPicker } from './FontPicker';
import { SHAPE_LIST } from '../data/shapes';
import { COLOR_PALETTES } from '../data/backgrounds';
import { SAMPLE_PHOTOS } from '../data/samplePhotos';
import { PHOTO_PLACEHOLDER_SVG } from '../data/boxes';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignStartVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignEndHorizontal,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
  RotateCw,
  Sliders,
  Type,
  Maximize2,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Info,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  LayoutList,
  ArrowUpDown,
  Move,
} from 'lucide-react';

interface InspectorProps {
  project: ProjectState;
  selectedLayer: Layer | null;
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onBringForward?: (id: string) => void;
  onSendBackward?: (id: string) => void;
  onChangePreset: (preset: CanvasPresetId) => void;
  onAlignLayer: (
    alignment:
      | 'left'
      | 'center-h'
      | 'right'
      | 'top'
      | 'center-v'
      | 'bottom'
      | 'center-both'
      | 'nudge-up'
      | 'nudge-down'
      | 'nudge-left'
      | 'nudge-right'
  ) => void;
  onAutoStackLayers?: () => void;
  onDistributeLayers?: () => void;
  onSeparateTexts?: () => void;
  onAdjustSpacing?: (delta: number) => void;
  customFonts?: FontDefinition[];
  onAddCustomFont?: (font: FontDefinition) => void;
  onRemoveCustomFont?: (family: string) => void;
  zoom?: number;
}

export const Inspector: React.FC<InspectorProps> = ({
  project,
  selectedLayer,
  onUpdateLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  onChangePreset,
  onAlignLayer,
  onAutoStackLayers,
  onDistributeLayers,
  onSeparateTexts,
  onAdjustSpacing,
  customFonts = [],
  onAddCustomFont,
  onRemoveCustomFont,
  zoom = 0.5,
}) => {
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'text' | 'caption'>('text');

  const quickColors = [
    '#ffffff',
    '#f8fafc',
    '#94a3b8',
    '#0f172a',
    '#e11d48',
    '#ea580c',
    '#d97706',
    '#16a34a',
    '#0284c7',
    '#6366f1',
    '#a855f7',
  ];

  if (!selectedLayer) {
    return (
      <aside className="w-72 md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-20 shrink-0 select-none p-4 overflow-y-auto">
        <div className="space-y-5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Impostazioni Tela
            </h2>
            <span className="text-[11px] text-slate-500">
              Nessun elemento selezionato. Clicca su un testo o forma per modificarlo.
            </span>
          </div>

          {/* Canvas Specs */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Dimensioni attuali:</span>
              <span className="font-mono text-indigo-400 font-semibold">
                {project.width} × {project.height} px
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Rapporto:</span>
              <span className="font-medium text-slate-200 capitalize">
                {project.preset}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Numero di livelli:</span>
              <span className="font-medium text-slate-200">
                {project.layers.length}
              </span>
            </div>
          </div>

          {/* Scene Organization Tools */}
          {project.layers.length > 1 && (
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  Sistemazione Scena
                </h3>
                <span className="text-[9px] text-slate-400">Non altera X</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Risolvi sovrapposizioni e allinea gli elementi con spaziatura uniforme:
              </p>
              <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => onSeparateTexts ? onSeparateTexts() : onAutoStackLayers?.()}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 rounded-lg text-indigo-200 text-xs font-medium transition-colors"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>Separa Testi Sovrapposti</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDistributeLayers && onDistributeLayers()}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-slate-200 text-xs font-medium transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Distribuisci Spazi Equi</span>
                </button>
              </div>

              {/* Incremental Spacing Adjuster */}
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-700/50 pt-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Distanza tra livelli:</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => onAdjustSpacing && onAdjustSpacing(-15)}
                    title="Riduci spazio di 15px (compatta)"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 hover:text-white text-[10px] font-medium transition-colors"
                  >
                    -15px
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustSpacing && onAdjustSpacing(15)}
                    title="Aumenta spazio di 15px (allontana)"
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-indigo-300 hover:text-white text-[10px] font-medium transition-colors"
                  >
                    +15px
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Shortcuts Guide */}
          <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/50 space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Scorciatoie Utili
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center justify-between">
                <span>Trascina con mouse:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">Sposta</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Frecce direzionali:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">1px Nudge</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shift + Frecce:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">10px Nudge</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Ctrl + Z / Ctrl + Y:</span>
                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">Annulla/Ripristina</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full z-20 shrink-0 select-none overflow-y-auto p-4 space-y-5">
      {/* Header with Layer Name & Type */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="min-w-0 flex-1 mr-2">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {selectedLayer.type}
            </span>
            <input
              type="text"
              value={selectedLayer.name}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, { name: e.target.value })
              }
              className="text-xs font-semibold text-slate-200 bg-transparent hover:bg-slate-800 px-1 py-0.5 rounded border border-transparent hover:border-slate-700 truncate w-full"
            />
          </div>
        </div>

        {/* Quick Layer Operations */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => onDuplicateLayer(selectedLayer.id)}
            title="Duplica livello"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() =>
              onUpdateLayer(selectedLayer.id, { isLocked: !selectedLayer.isLocked })
            }
            title={selectedLayer.isLocked ? 'Sblocca' : 'Blocca'}
            className={`p-1.5 rounded-lg transition-colors ${
              selectedLayer.isLocked
                ? 'text-amber-400 bg-amber-950/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {selectedLayer.isLocked ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => onDeleteLayer(selectedLayer.id)}
            title="Elimina elemento"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Layer Alignment Shortcuts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Allineamento su Tela
          </label>
          <button
            onClick={() => onAlignLayer('center-both')}
            title="Centra perfettamente sia in orizzontale che in verticale"
            className="text-[10px] text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600/50 px-2 py-0.5 rounded border border-indigo-500/30 transition-colors"
          >
            Centra Entrambi
          </button>
        </div>
        <div className="grid grid-cols-6 gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => onAlignLayer('left')}
            title="Allinea a Sinistra"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded flex justify-center"
          >
            <AlignStartHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlignLayer('center-h')}
            title="Centra Orizzontalmente"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded flex justify-center"
          >
            <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlignLayer('right')}
            title="Allinea a Destra"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded flex justify-center"
          >
            <AlignEndHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlignLayer('top')}
            title="Allinea in Alto"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded flex justify-center"
          >
            <AlignStartVertical className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlignLayer('center-v')}
            title="Centra Verticalmente"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded flex justify-center"
          >
            <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAlignLayer('bottom')}
            title="Allinea in Basso"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded flex justify-center"
          >
            <AlignEndVertical className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Way Rapid Nudge & Separation Pad */}
        <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Move className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-medium text-slate-300">Sposta di 20px:</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onAlignLayer('nudge-left')}
              title="Sposta a Sinistra di 20px"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
            <button
              onClick={() => onAlignLayer('nudge-up')}
              title="Sposta in Alto di 20px"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 hover:text-white transition-colors"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => onAlignLayer('nudge-down')}
              title="Sposta in Basso di 20px"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 hover:text-white transition-colors"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => onAlignLayer('nudge-right')}
              title="Sposta a Destra di 20px"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 hover:text-white transition-colors"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Depth / Order & Scene Arrangement */}
      {(() => {
        const layerIndex = project.layers.findIndex((l) => l.id === selectedLayer.id);
        const totalLayers = project.layers.length;
        const isAtBottom = layerIndex <= 0;
        const isAtTop = layerIndex >= totalLayers - 1;

        return (
          <div className="space-y-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sovrapposizione & Livelli
              </label>
              {layerIndex >= 0 && (
                <span className="text-[10px] font-medium bg-slate-700/70 text-indigo-300 px-2 py-0.5 rounded-full">
                  Livello {layerIndex + 1} di {totalLayers}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                disabled={isAtBottom}
                onClick={() => onSendToBack(selectedLayer.id)}
                title="Invia in fondo (sullo sfondo assoluto)"
                className="flex flex-col items-center justify-center py-1.5 px-1 text-[10px] bg-slate-800 hover:bg-slate-700 disabled:opacity-35 disabled:pointer-events-none border border-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <ChevronsDown className="w-3.5 h-3.5 mb-0.5 text-slate-300" />
                <span className="truncate">Fondo</span>
              </button>

              <button
                type="button"
                disabled={isAtBottom}
                onClick={() => onSendBackward && onSendBackward(selectedLayer.id)}
                title="Sposta indietro di 1 livello"
                className="flex flex-col items-center justify-center py-1.5 px-1 text-[10px] bg-slate-800 hover:bg-slate-700 disabled:opacity-35 disabled:pointer-events-none border border-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <ChevronDown className="w-3.5 h-3.5 mb-0.5 text-amber-300" />
                <span className="truncate">-1 Sotto</span>
              </button>

              <button
                type="button"
                disabled={isAtTop}
                onClick={() => onBringForward && onBringForward(selectedLayer.id)}
                title="Sposta avanti di 1 livello"
                className="flex flex-col items-center justify-center py-1.5 px-1 text-[10px] bg-slate-800 hover:bg-slate-700 disabled:opacity-35 disabled:pointer-events-none border border-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <ChevronUp className="w-3.5 h-3.5 mb-0.5 text-indigo-300" />
                <span className="truncate">+1 Sopra</span>
              </button>

              <button
                type="button"
                disabled={isAtTop}
                onClick={() => onBringToFront(selectedLayer.id)}
                title="Porta in cima (primo piano assoluto)"
                className="flex flex-col items-center justify-center py-1.5 px-1 text-[10px] bg-slate-800 hover:bg-slate-700 disabled:opacity-35 disabled:pointer-events-none border border-slate-700 rounded-lg text-slate-200 transition-colors"
              >
                <ChevronsUp className="w-3.5 h-3.5 mb-0.5 text-slate-300" />
                <span className="truncate">In Cima</span>
              </button>
            </div>

            {/* Scene-wide layout buttons when multiple layers exist */}
            {totalLayers > 1 && (
              <div className="pt-2.5 border-t border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
                    Sistemazione e Spazi
                  </span>
                  <span className="text-[9px] text-slate-500">Non altera X</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSeparateTexts ? onSeparateTexts() : onAutoStackLayers?.()}
                    title="Separa i testi sovrapposti mantenendo le posizioni orizzontali"
                    className="flex items-center justify-center space-x-1 py-1.5 px-1 text-[10px] bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 rounded-lg text-indigo-200 transition-colors"
                  >
                    <LayoutList className="w-3 h-3" />
                    <span className="truncate">Separa Testi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDistributeLayers && onDistributeLayers()}
                    title="Distribuisce equamente lo spazio verticale tra gli elementi senza accavallarli"
                    className="flex items-center justify-center space-x-1 py-1.5 px-1 text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition-colors"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span className="truncate">Spazi Equi</span>
                  </button>
                </div>

                {/* Incremental Spacing Adjuster */}
                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-700/50">
                  <span className="text-[9px] text-slate-400 font-medium pl-0.5">Distanza livelli:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => onAdjustSpacing && onAdjustSpacing(-15)}
                      title="Riduci spazio di 15px (compatta)"
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 hover:text-white text-[9px] font-medium transition-colors"
                    >
                      -15px
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustSpacing && onAdjustSpacing(15)}
                      title="Aumenta spazio di 15px (allontana)"
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-indigo-300 hover:text-white text-[9px] font-medium transition-colors"
                    >
                      +15px
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Geometry: X, Y, Width, Height, Rotation */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Posizione e Dimensioni
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">X</span>
            <input
              type="number"
              value={selectedLayer.x}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })
              }
              className="w-16 bg-transparent text-right text-slate-100 outline-none font-mono"
            />
          </div>
          <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Y</span>
            <input
              type="number"
              value={selectedLayer.y}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })
              }
              className="w-16 bg-transparent text-right text-slate-100 outline-none font-mono"
            />
          </div>
          <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Larghezza</span>
            <input
              type="number"
              value={selectedLayer.width}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  width: Math.max(10, parseInt(e.target.value) || 10),
                })
              }
              className="w-16 bg-transparent text-right text-slate-100 outline-none font-mono"
            />
          </div>
          <div className="flex items-center justify-between bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <span className="text-slate-400">Altezza</span>
            <input
              type="number"
              value={selectedLayer.height}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  height: Math.max(10, parseInt(e.target.value) || 10),
                })
              }
              className="w-16 bg-transparent text-right text-slate-100 outline-none font-mono"
            />
          </div>
        </div>

        {/* Rotation & Opacity */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Rotazione ({selectedLayer.rotation}°)</span>
            <button
              onClick={() =>
                onUpdateLayer(selectedLayer.id, {
                  rotation: (selectedLayer.rotation + 90) % 360,
                })
              }
              title="Ruota +90°"
              className="p-1 hover:bg-slate-800 rounded text-slate-300"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={selectedLayer.rotation}
            onChange={(e) =>
              onUpdateLayer(selectedLayer.id, { rotation: parseInt(e.target.value) })
            }
            className="w-full accent-indigo-500"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Opacità</span>
            <span className="text-slate-300 font-mono">
              {Math.round(selectedLayer.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={selectedLayer.opacity}
            onChange={(e) =>
              onUpdateLayer(selectedLayer.id, { opacity: parseFloat(e.target.value) })
            }
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* =======================================================================
          TEXT LAYER SPECIFIC CONTROLS
         ======================================================================= */}
      {selectedLayer.type === 'text' && (
        <div className="space-y-4 border-t border-slate-800 pt-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Type className="w-3.5 h-3.5" />
            <span>Proprietà Testo</span>
          </label>

          {/* Direct Text Editor Textarea */}
          <div>
            <textarea
              rows={3}
              value={(selectedLayer as TextLayer).text}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, { text: e.target.value })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none font-sans"
              placeholder="Scrivi qui il tuo testo..."
            />
          </div>

          {/* Font Family Selector with Visual Preview & Custom Font Support */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-400">Carattere (Font)</label>
              {customFonts.some(
                (f) =>
                  f.family.toLowerCase() ===
                  (selectedLayer as TextLayer).fontFamily.toLowerCase()
              ) && (
                <span className="text-[9px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  Font Personale ⭐
                </span>
              )}
            </div>

            {/* Visual Font Card & Trigger */}
            <div className="p-2.5 bg-slate-800 border border-slate-750 rounded-xl space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div
                    className="text-base text-white font-medium truncate"
                    style={{ fontFamily: (selectedLayer as TextLayer).fontFamily }}
                  >
                    {(selectedLayer as TextLayer).fontFamily}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Clicca per cambiare o caricare font personali
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPickerTarget('text');
                    setIsFontPickerOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1 transition-colors shrink-0 cursor-pointer"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Sfoglia / Carica</span>
                </button>
              </div>

              {/* Fast dropdown selector with optgroups */}
              <select
                value={(selectedLayer as TextLayer).fontFamily}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, { fontFamily: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-indigo-500"
              >
                {customFonts.length > 0 && (
                  <optgroup label="⭐ I Tuoi Font Personali">
                    {customFonts.map((f) => (
                      <option key={f.family} value={f.family}>
                        ⭐ {f.name} (Personale)
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="✍️ Corsivi & Calligrafia Speciale">
                  {FONT_LIST.filter((f) => f.category === 'handwriting').map((f) => (
                    <option key={f.family} value={f.family}>
                      {f.name} {f.scriptBadge ? `[${f.scriptBadge}]` : ''}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="⚡ Display & Bold">
                  {FONT_LIST.filter((f) => f.category === 'display').map((f) => (
                    <option key={f.family} value={f.family}>
                      {f.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="👑 Serif">
                  {FONT_LIST.filter((f) => f.category === 'serif').map((f) => (
                    <option key={f.family} value={f.family}>
                      {f.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="💼 Sans-serif & Mono">
                  {FONT_LIST.filter((f) => f.category === 'sans' || f.category === 'mono').map((f) => (
                    <option key={f.family} value={f.family}>
                      {f.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Font Size & Weight with visual calibration */}
          <div className="space-y-2.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-200">Dimensione Carattere</label>
              <span className="text-[10px] text-indigo-300 font-mono bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded-full">
                {(selectedLayer as TextLayer).fontSize}px (Tela) • ~{Math.round((selectedLayer as TextLayer).fontSize * zoom)}px a schermo
              </span>
            </div>

            {/* Slider + Stepper Input */}
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="12"
                max="200"
                step="1"
                value={(selectedLayer as TextLayer).fontSize}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    fontSize: Math.max(10, parseInt(e.target.value) || 12),
                  })
                }
                className="flex-1 accent-indigo-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  title="Riduci font (-2px)"
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, {
                      fontSize: Math.max(10, (selectedLayer as TextLayer).fontSize - 2),
                    })
                  }
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={(selectedLayer as TextLayer).fontSize}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, {
                      fontSize: Math.max(10, parseInt(e.target.value) || 12),
                    })
                  }
                  className="w-13 bg-slate-900 border border-slate-700 rounded px-1 py-0.5 text-center text-xs text-white font-mono font-bold"
                />
                <button
                  type="button"
                  title="Aumenta font (+2px)"
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, {
                      fontSize: Math.min(300, (selectedLayer as TextLayer).fontSize + 2),
                    })
                  }
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quick Size Preset Pills */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {[
                { label: 'Didascalia', size: 28 },
                { label: 'Testo', size: 38 },
                { label: 'Sottotitolo', size: 48 },
                { label: 'Titolo', size: 72 },
                { label: 'Grande', size: 96 },
                { label: 'Hero', size: 120 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onUpdateLayer(selectedLayer.id, { fontSize: p.size })}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    (selectedLayer as TextLayer).fontSize === p.size
                      ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-900 border-slate-750 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {p.label} ({p.size}px)
                </button>
              ))}
            </div>

            {/* Explanatory Notice for 1080p Resolution vs Preview Zoom */}
            <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-[10px] text-slate-300 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-indigo-200">Perché 20px sembra piccolo? </span>
                La tela è in formato HD nativo a <strong className="text-white">1080×1080px (ideale per i social)</strong>. Con lo zoom di visualizzazione ({Math.round(zoom * 100)}%), 20px corrisponde a soli ~{Math.round(20 * zoom)}px a monitor. Per post social leggibili da smartphone, usa <strong className="text-emerald-300">36–48px</strong> per testi e <strong className="text-emerald-300">64–96px</strong> per titoli.
              </div>
            </div>

            {/* Weight selector */}
            <div className="pt-1">
              <label className="text-[10px] text-slate-400 block mb-1">Spessore Carattere (Weight)</label>
              <select
                value={(selectedLayer as TextLayer).fontWeight}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    fontWeight: e.target.value as any,
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100"
              >
                <option value="400">Regular (400) - Normale</option>
                <option value="500">Medium (500) - Medio</option>
                <option value="600">Semibold (600) - Semigrassetto</option>
                <option value="700">Bold (700) - Grassetto</option>
                <option value="800">Extra Bold (800) - Molto Grassetto</option>
              </select>
            </div>
          </div>

          {/* Text Alignment & Style */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 grid grid-cols-3 bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => onUpdateLayer(selectedLayer.id, { textAlign: 'left' })}
                className={`py-1 text-xs rounded flex justify-center ${
                  (selectedLayer as TextLayer).textAlign === 'left'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateLayer(selectedLayer.id, { textAlign: 'center' })}
                className={`py-1 text-xs rounded flex justify-center ${
                  (selectedLayer as TextLayer).textAlign === 'center'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateLayer(selectedLayer.id, { textAlign: 'right' })}
                className={`py-1 text-xs rounded flex justify-center ${
                  (selectedLayer as TextLayer).textAlign === 'right'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Italic toggle */}
            <button
              onClick={() =>
                onUpdateLayer(selectedLayer.id, {
                  fontStyle:
                    (selectedLayer as TextLayer).fontStyle === 'italic'
                      ? 'normal'
                      : 'italic',
                })
              }
              className={`px-3 py-1.5 rounded-lg border text-xs font-serif italic ${
                (selectedLayer as TextLayer).fontStyle === 'italic'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              I
            </button>

            {/* Uppercase toggle */}
            <button
              onClick={() =>
                onUpdateLayer(selectedLayer.id, {
                  textTransform:
                    (selectedLayer as TextLayer).textTransform === 'uppercase'
                      ? 'none'
                      : 'uppercase',
                })
              }
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                (selectedLayer as TextLayer).textTransform === 'uppercase'
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              AA
            </button>
          </div>

          {/* Letter Spacing & Line Height */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Spaziatura</span>
                <span>{(selectedLayer as TextLayer).letterSpacing}px</span>
              </div>
              <input
                type="range"
                min="-2"
                max="12"
                value={(selectedLayer as TextLayer).letterSpacing}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    letterSpacing: parseInt(e.target.value),
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Interlinea</span>
                <span>{(selectedLayer as TextLayer).lineHeight}</span>
              </div>
              <input
                type="range"
                min="0.9"
                max="2.2"
                step="0.05"
                value={(selectedLayer as TextLayer).lineHeight}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    lineHeight: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-400">Colore Testo</label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={(selectedLayer as TextLayer).color}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, { color: e.target.value })
                  }
                  className="w-6 h-6 rounded cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-300">
                  {(selectedLayer as TextLayer).color}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {quickColors.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateLayer(selectedLayer.id, { color: c })}
                  className="w-5 h-5 rounded border border-white/15"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Optional Background Pill */}
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">Evidenziatore Pillola</span>
              <input
                type="color"
                value={(selectedLayer as TextLayer).backgroundColor || '#ffffff'}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    backgroundColor: e.target.value,
                    backgroundPadding:
                      (selectedLayer as TextLayer).backgroundPadding || 12,
                    backgroundBorderRadius:
                      (selectedLayer as TextLayer).backgroundBorderRadius || 12,
                  })
                }
                className="w-6 h-6 rounded cursor-pointer bg-transparent"
              />
            </div>
            {(selectedLayer as TextLayer).backgroundColor && (
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, {
                      backgroundColor: undefined,
                      backgroundPadding: undefined,
                    })
                  }
                  className="text-[10px] text-rose-400 hover:text-rose-300"
                >
                  Rimuovi sfondo testo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =======================================================================
          SHAPE LAYER SPECIFIC CONTROLS
         ======================================================================= */}
      {selectedLayer.type === 'shape' && (
        <div className="space-y-4 border-t border-slate-800 pt-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Proprietà Forma Geometrica
          </label>

          {/* Change Shape Type */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Tipo di Forma</label>
            <select
              value={(selectedLayer as ShapeLayer).shapeType}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  shapeType: e.target.value as any,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
            >
              {SHAPE_LIST.map((s) => (
                <option key={s.type} value={s.type}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fill Color */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-400">Colore di Riempimento</label>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, { fillColor: 'transparent' })
                  }
                  className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
                >
                  Trasparente
                </button>
                <input
                  type="color"
                  value={
                    (selectedLayer as ShapeLayer).fillColor === 'transparent'
                      ? '#ffffff'
                      : (selectedLayer as ShapeLayer).fillColor
                  }
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, { fillColor: e.target.value })
                  }
                  className="w-6 h-6 rounded cursor-pointer bg-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {quickColors.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateLayer(selectedLayer.id, { fillColor: c })}
                  className="w-5 h-5 rounded border border-white/15"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Stroke / Border */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-slate-400">Bordo / Tratto</label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="color"
                  value={
                    (selectedLayer as ShapeLayer).strokeColor === 'transparent'
                      ? '#000000'
                      : (selectedLayer as ShapeLayer).strokeColor
                  }
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, { strokeColor: e.target.value })
                  }
                  className="w-6 h-6 rounded cursor-pointer bg-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Spessore Bordo</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={(selectedLayer as ShapeLayer).strokeWidth}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, {
                      strokeWidth: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Stile Linea</label>
                <select
                  value={(selectedLayer as ShapeLayer).strokeStyle}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, {
                      strokeStyle: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-100"
                >
                  <option value="solid">Continua</option>
                  <option value="dashed">Tratteggiata</option>
                  <option value="dotted">Puntinata</option>
                </select>
              </div>
            </div>

            {/* Corner Radius */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Raggio Angoli (Corner Radius)</span>
                <span>{(selectedLayer as ShapeLayer).borderRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={(selectedLayer as ShapeLayer).borderRadius}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    borderRadius: parseInt(e.target.value),
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          ICON LAYER SPECIFIC CONTROLS
         ======================================================================= */}
      {selectedLayer.type === 'icon' && (
        <div className="space-y-4 border-t border-slate-800 pt-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Proprietà Icona
          </label>

          {/* Icon Color */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] text-slate-400">Colore Icona</label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={(selectedLayer as IconLayer).color}
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, { color: e.target.value })
                  }
                  className="w-6 h-6 rounded cursor-pointer bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-300">
                  {(selectedLayer as IconLayer).color}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {quickColors.map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateLayer(selectedLayer.id, { color: c })}
                  className="w-5 h-5 rounded border border-white/15"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Stroke Width */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Spessore Tratto Icona</span>
              <span>{(selectedLayer as IconLayer).strokeWidth}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={(selectedLayer as IconLayer).strokeWidth}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  strokeWidth: parseFloat(e.target.value),
                })
              }
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      )}

      {/* =======================================================================
          IMAGE LAYER SPECIFIC CONTROLS (Filters, Radius, Borders, Replace)
         ======================================================================= */}
      {selectedLayer.type === 'image' && (
        <div className="space-y-4 border-t border-slate-800 pt-3">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Foto & Riquadro Collage
          </label>

          {/* Sostituisci / Carica Foto */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                Immagine del Box
              </span>
              {(selectedLayer as ImageLayer).src !== PHOTO_PLACEHOLDER_SVG && (
                <button
                  onClick={() =>
                    onUpdateLayer(selectedLayer.id, {
                      src: PHOTO_PLACEHOLDER_SVG,
                      name: 'Box Foto Vuoto',
                    })
                  }
                  title="Rimuovi la foto attuale e lascia il riquadro vuoto"
                  className="text-[10px] text-slate-400 hover:text-rose-300 transition-colors"
                >
                  Svuota box
                </button>
              )}
            </div>

            {/* Upload Button */}
            <label
              htmlFor={`upload-photo-${selectedLayer.id}`}
              className="flex items-center justify-center space-x-2 w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Carica Foto dal Computer</span>
              <input
                id={`upload-photo-${selectedLayer.id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        onUpdateLayer(selectedLayer.id, {
                          src: reader.result,
                          name: file.name.slice(0, 24),
                        });
                      }
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                  }
                }}
              />
            </label>

            {/* Quick sample photos */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">
                Oppure scegli una foto d'esempio:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {SAMPLE_PHOTOS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      onUpdateLayer(selectedLayer.id, {
                        src: p.dataUrl,
                        name: p.title,
                      })
                    }
                    title={p.title}
                    className="relative aspect-square rounded-md overflow-hidden border border-slate-700 hover:border-indigo-400 transition-all group"
                  >
                    <img
                      src={p.dataUrl}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fit mode */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() =>
                onUpdateLayer(selectedLayer.id, { objectFit: 'cover' })
              }
              className={`py-1.5 rounded-lg border text-center ${
                (selectedLayer as ImageLayer).objectFit === 'cover'
                  ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              Riempi (Cover)
            </button>
            <button
              onClick={() =>
                onUpdateLayer(selectedLayer.id, { objectFit: 'contain' })
              }
              className={`py-1.5 rounded-lg border text-center ${
                (selectedLayer as ImageLayer).objectFit === 'contain'
                  ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              Adatta (Contain)
            </button>
          </div>

          {/* Stile Cornice & Polaroid Integrata */}
          <div className="space-y-2.5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Stile Cornice & Effetti
              </span>
              <span className="text-[10px] text-indigo-300 font-mono">
                {((selectedLayer as ImageLayer).frameStyle || 'none') === 'polaroid'
                  ? '📷 Polaroid'
                  : ((selectedLayer as ImageLayer).frameStyle || 'none')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'none', label: 'Piatta (Normale)' },
                { id: 'polaroid', label: '📷 Polaroid Vintage' },
                { id: 'passepartout', label: '🖼️ Passepartout' },
                { id: 'film', label: '🎞️ Pellicola' },
                { id: 'classic', label: '🎨 Cornice Legno' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    const updates: Partial<ImageLayer> = {
                      frameStyle: style.id as any,
                    };
                    if (style.id === 'polaroid') {
                      if (!(selectedLayer as ImageLayer).caption) {
                        updates.caption = 'Momento Speciale ✨';
                        updates.captionFontFamily = 'Caveat';
                        updates.captionFontSize = 28;
                        updates.captionColor = '#334155';
                      }
                      updates.frameColor = (selectedLayer as ImageLayer).frameColor || '#ffffff';
                    }
                    onUpdateLayer(selectedLayer.id, updates);
                  }}
                  className={`py-1.5 px-2 rounded-lg border text-left text-[11px] truncate transition-colors ${
                    ((selectedLayer as ImageLayer).frameStyle || 'none') === style.id
                      ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-sm'
                      : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            {/* If Polaroid style is selected: show direct caption & frame editor */}
            {(selectedLayer as ImageLayer).frameStyle === 'polaroid' && (
              <div className="mt-3 pt-3 border-t border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-amber-300">
                    Didascalia Polaroid
                  </span>
                  <span className="text-[9px] text-slate-400">Scritta a mano integrata</span>
                </div>

                <input
                  type="text"
                  value={(selectedLayer as ImageLayer).caption ?? ''}
                  placeholder="Scrivi qui la didascalia..."
                  onChange={(e) =>
                    onUpdateLayer(selectedLayer.id, { caption: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />

                {/* Font choice for polaroid */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400">
                      Carattere Didascalia
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setPickerTarget('caption');
                        setIsFontPickerOpen(true);
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                    >
                      Sfoglia font...
                    </button>
                  </div>
                  <select
                    value={(selectedLayer as ImageLayer).captionFontFamily || 'Caveat'}
                    onChange={(e) =>
                      onUpdateLayer(selectedLayer.id, {
                        captionFontFamily: e.target.value,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-hidden focus:border-indigo-500"
                  >
                    {customFonts.length > 0 && (
                      <optgroup label="⭐ Font Personali">
                        {customFonts.map((f) => (
                          <option key={f.family} value={f.family}>
                            ⭐ {f.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Consigliati per Polaroid">
                      <option value="Caveat">Caveat (Corsivo naturale a mano)</option>
                      <option value="Dancing Script">Dancing Script (Corsivo elegante)</option>
                      <option value="Pacifico">Pacifico (Retrò morbido)</option>
                      <option value="Permanent Marker">Permanent Marker (Pennarello)</option>
                      <option value="Outfit">Outfit (Moderno geometrico)</option>
                      <option value="Playfair Display">Playfair Display (Classico graziato)</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    </optgroup>
                  </select>
                </div>

                {/* Font Size & Text Color */}
                <div className="grid grid-cols-2 gap-2 items-center">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>Dimensione</span>
                      <span>{(selectedLayer as ImageLayer).captionFontSize || 28}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="56"
                      value={(selectedLayer as ImageLayer).captionFontSize || 28}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          captionFontSize: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Colore Testo</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={(selectedLayer as ImageLayer).captionColor || '#334155'}
                        onChange={(e) =>
                          onUpdateLayer(selectedLayer.id, {
                            captionColor: e.target.value,
                          })
                        }
                        className="w-7 h-7 rounded cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] text-slate-300 font-mono truncate">
                        {(selectedLayer as ImageLayer).captionColor || '#334155'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Frame background color */}
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Colore Carta Cornice</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {[
                      { col: '#ffffff', name: 'Bianco puro' },
                      { col: '#fefce8', name: 'Crema vintage' },
                      { col: '#f1f5f9', name: 'Grigio chiaro' },
                      { col: '#0f172a', name: 'Notte scura' },
                    ].map((c) => (
                      <button
                        key={c.col}
                        type="button"
                        title={c.name}
                        onClick={() =>
                          onUpdateLayer(selectedLayer.id, { frameColor: c.col })
                        }
                        style={{ backgroundColor: c.col }}
                        className={`w-6 h-6 rounded-md border border-slate-600 transition-transform ${
                          ((selectedLayer as ImageLayer).frameColor || '#ffffff') === c.col
                            ? 'ring-2 ring-indigo-400 scale-110'
                            : 'hover:scale-105'
                        }`}
                      />
                    ))}
                    <input
                      type="color"
                      value={(selectedLayer as ImageLayer).frameColor || '#ffffff'}
                      onChange={(e) =>
                        onUpdateLayer(selectedLayer.id, {
                          frameColor: e.target.value,
                        })
                      }
                      className="w-7 h-7 rounded cursor-pointer bg-transparent ml-auto"
                      title="Scegli colore personalizzato"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Border Radius */}
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Arrotondamento Angoli</span>
              <span>{(selectedLayer as ImageLayer).borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              value={(selectedLayer as ImageLayer).borderRadius}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  borderRadius: parseInt(e.target.value),
                })
              }
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Border Width & Color */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Bordo Foto</span>
              <input
                type="color"
                value={(selectedLayer as ImageLayer).borderColor || '#ffffff'}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, { borderColor: e.target.value })
                }
                className="w-5 h-5 rounded cursor-pointer bg-transparent"
              />
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={(selectedLayer as ImageLayer).borderWidth}
              onChange={(e) =>
                onUpdateLayer(selectedLayer.id, {
                  borderWidth: parseInt(e.target.value),
                })
              }
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Photographic Filters */}
          <div className="space-y-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Filtri Fotografici
              </span>
              <button
                onClick={() =>
                  onUpdateLayer(selectedLayer.id, {
                    filters: {
                      brightness: 100,
                      contrast: 100,
                      saturation: 100,
                      grayscale: 0,
                      sepia: 0,
                      blur: 0,
                    },
                  })
                }
                className="text-[10px] text-indigo-400 hover:text-indigo-300"
              >
                Reimposta
              </button>
            </div>

            {/* Brightness */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Luminosità</span>
                <span>{(selectedLayer as ImageLayer).filters.brightness}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                value={(selectedLayer as ImageLayer).filters.brightness}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    filters: {
                      ...(selectedLayer as ImageLayer).filters,
                      brightness: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Contrasto</span>
                <span>{(selectedLayer as ImageLayer).filters.contrast}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                value={(selectedLayer as ImageLayer).filters.contrast}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    filters: {
                      ...(selectedLayer as ImageLayer).filters,
                      contrast: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Grayscale */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Bianco & Nero</span>
                <span>{(selectedLayer as ImageLayer).filters.grayscale}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={(selectedLayer as ImageLayer).filters.grayscale}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    filters: {
                      ...(selectedLayer as ImageLayer).filters,
                      grayscale: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Sepia */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Vintage / Seppia</span>
                <span>{(selectedLayer as ImageLayer).filters.sepia}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={(selectedLayer as ImageLayer).filters.sepia}
                onChange={(e) =>
                  onUpdateLayer(selectedLayer.id, {
                    filters: {
                      ...(selectedLayer as ImageLayer).filters,
                      sepia: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Visual Font Picker Modal */}
      <FontPicker
        isOpen={isFontPickerOpen}
        onClose={() => setIsFontPickerOpen(false)}
        currentFont={
          pickerTarget === 'text' && selectedLayer?.type === 'text'
            ? (selectedLayer as TextLayer).fontFamily
            : pickerTarget === 'caption' && selectedLayer?.type === 'image'
            ? (selectedLayer as ImageLayer).captionFontFamily || 'Caveat'
            : 'Plus Jakarta Sans'
        }
        onSelectFont={(fontFamily) => {
          if (selectedLayer) {
            if (pickerTarget === 'text' && selectedLayer.type === 'text') {
              onUpdateLayer(selectedLayer.id, { fontFamily });
            } else if (pickerTarget === 'caption' && selectedLayer.type === 'image') {
              onUpdateLayer(selectedLayer.id, { captionFontFamily: fontFamily });
            }
          }
        }}
        customFonts={customFonts}
        onAddCustomFont={onAddCustomFont || (() => {})}
        onRemoveCustomFont={onRemoveCustomFont || (() => {})}
        sampleText={
          selectedLayer?.type === 'text'
            ? (selectedLayer as TextLayer).text
            : selectedLayer?.type === 'image' && (selectedLayer as ImageLayer).caption
            ? (selectedLayer as ImageLayer).caption
            : 'Anteprima Tipografica ✨'
        }
      />
    </aside>
  );
};
