import React, { useState } from 'react';
import {
  CanvasPresetId,
  ProjectState,
} from '../types';
import { CANVAS_PRESETS } from '../data/backgrounds';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Copy,
  FolderOpen,
  FileCode,
  Trash2,
  Check,
  Smartphone,
  Square,
  RectangleVertical,
  RectangleHorizontal,
  LayoutGrid,
  FileText,
} from 'lucide-react';

interface ToolbarProps {
  project: ProjectState;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  onFitScreen: () => void;
  onChangePreset: (presetId: CanvasPresetId) => void;
  onClearCanvas: () => void;
  onNewBlankCanvas: (presetId?: CanvasPresetId) => void;
  onExport: (format: 'png' | 'jpeg', scale?: number) => void;
  onCopyClipboard: () => void;
  onSaveJson: () => void;
  onLoadJson: (file: File) => void;
  isExporting: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  project,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomChange,
  onFitScreen,
  onChangePreset,
  onClearCanvas,
  onNewBlankCanvas,
  onExport,
  onCopyClipboard,
  onSaveJson,
  onLoadJson,
  isExporting,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const getPresetIcon = (id: CanvasPresetId) => {
    switch (id) {
      case 'square':
        return <Square className="w-4 h-4" />;
      case 'story':
        return <Smartphone className="w-4 h-4" />;
      case 'portrait':
        return <RectangleVertical className="w-4 h-4" />;
      case 'landscape':
        return <RectangleHorizontal className="w-4 h-4" />;
      case 'banner':
        return <LayoutGrid className="w-4 h-4" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  const handleCopy = async () => {
    await onCopyClipboard();
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: App Title & Preset Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-sky-500 to-amber-400 flex items-center justify-center shadow-md font-bold text-white text-base">
            S
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-100 leading-none">Studio Social</h1>
            <span className="text-[10px] text-emerald-400 font-medium tracking-wide">100% Offline & Libero</span>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Preset Selector Dropdown */}
        <div className="relative flex items-center">
          <label htmlFor="preset-select" className="sr-only">Formato Post</label>
          <div className="flex items-center bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 transition-colors cursor-pointer">
            <span className="mr-1.5 text-slate-400">{getPresetIcon(project.preset)}</span>
            <select
              id="preset-select"
              value={project.preset}
              onChange={(e) => onChangePreset(e.target.value as CanvasPresetId)}
              className="bg-transparent border-none outline-none font-medium cursor-pointer pr-1"
            >
              {CANVAS_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-800 text-slate-200">
                  {p.name} ({p.width}×{p.height})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Middle: Undo / Redo & Zoom Controls */}
      <div className="flex items-center space-x-1.5">
        <button
          id="btn-undo"
          onClick={onUndo}
          disabled={!canUndo}
          title="Annulla (Ctrl+Z)"
          className={`p-1.5 rounded-md text-slate-300 transition-colors ${
            canUndo ? 'hover:bg-slate-800 hover:text-white' : 'opacity-35 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          id="btn-redo"
          onClick={onRedo}
          disabled={!canRedo}
          title="Ripristina (Ctrl+Y)"
          className={`p-1.5 rounded-md text-slate-300 transition-colors ${
            canRedo ? 'hover:bg-slate-800 hover:text-white' : 'opacity-35 cursor-not-allowed'
          }`}
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Zoom */}
        <button
          id="btn-zoom-out"
          onClick={() => onZoomChange(Math.max(0.15, zoom - 0.1))}
          title="Riduci Zoom"
          className="p-1.5 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => (Math.round(zoom * 100) === 100 ? onFitScreen() : onZoomChange(1.0))}
          title="Clicca per alternare tra 100% (Grandezza Reale) e Adatta allo schermo"
          className="text-xs font-mono text-slate-300 hover:text-white px-1 py-0.5 rounded hover:bg-slate-800 min-w-[42px] text-center transition-colors cursor-pointer"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          id="btn-zoom-in"
          onClick={() => onZoomChange(Math.min(2.5, zoom + 0.1))}
          title="Aumenta Zoom"
          className="p-1.5 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          id="btn-zoom-100"
          onClick={() => onZoomChange(1.0)}
          title="Grandezza reale 1:1 (100% pixel reali di esportazione)"
          className={`px-1.5 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
            Math.round(zoom * 100) === 100
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          1:1
        </button>

        <button
          id="btn-fit-screen"
          onClick={onFitScreen}
          title="Adatta allo schermo"
          className="p-1.5 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Project actions & Export */}
      <div className="flex items-center space-x-2">
        {/* Nuovo Foglio Bianco */}
        <button
          id="btn-new-blank-canvas"
          onClick={() => onNewBlankCanvas(project.preset)}
          title="Nuovo Foglio Bianco (elimina livelli e imposta sfondo bianco)"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs text-indigo-200 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/70 border border-indigo-700/60 rounded-lg transition-colors shadow-sm font-medium"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Foglio Bianco</span>
        </button>

        {/* Clear */}
        <button
          id="btn-clear-canvas"
          onClick={onClearCanvas}
          title="Pulisci tela (svuota livelli)"
          className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-950/50 hover:text-rose-200 border border-rose-900/50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">Svuota</span>
        </button>

        {/* Load JSON */}
        <label
          htmlFor="load-project-input"
          title="Carica progetto da file JSON"
          className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Apri JSON</span>
          <input
            id="load-project-input"
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onLoadJson(file);
              e.target.value = '';
            }}
          />
        </label>

        {/* Quick Copy to Clipboard */}
        <button
          id="btn-quick-copy"
          onClick={handleCopy}
          disabled={isExporting}
          title="Copia immagine negli appunti"
          className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg transition-colors"
        >
          {copiedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copiata!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copia</span>
            </>
          )}
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            id="btn-export-menu"
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Esportazione...' : 'Esporta'}</span>
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-slate-200"
              onMouseLeave={() => setShowExportMenu(false)}
            >
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Immagine Grafica
              </div>

              <button
                id="btn-export-png"
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('png', 1);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex items-center justify-between"
              >
                <span>Scarica PNG (Standard)</span>
                <span className="text-[10px] text-slate-400">1080px</span>
              </button>

              <button
                id="btn-export-png-2x"
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('png', 2);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex items-center justify-between text-indigo-300"
              >
                <span>Scarica PNG HD (2x Retina)</span>
                <span className="text-[10px] text-indigo-400 font-semibold">2160px</span>
              </button>

              <button
                id="btn-export-jpg"
                onClick={() => {
                  setShowExportMenu(false);
                  onExport('jpeg', 1);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex items-center justify-between"
              >
                <span>Scarica JPEG</span>
                <span className="text-[10px] text-slate-400">Leggero</span>
              </button>

              <div className="my-1.5 border-t border-slate-700" />

              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Progetto Offline
              </div>

              <button
                id="btn-save-json"
                onClick={() => {
                  setShowExportMenu(false);
                  onSaveJson();
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex items-center space-x-2"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Salva Progetto (.json)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
