import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ProjectState,
  CanvasPresetId,
  Layer,
  ImageLayer,
  TextLayer,
  TemplateDefinition,
  CanvasBackground,
  ShapeType,
} from './types';
import { CANVAS_PRESETS } from './data/backgrounds';
import { TEMPLATES } from './data/templates';
import { FONT_LIST, FontDefinition } from './data/fonts';
import { initializeCustomFonts } from './utils/fontManager';
import { SHAPE_LIST } from './data/shapes';
import {
  SINGLE_BOX_PRESETS,
  COLLAGE_GRID_LAYOUTS,
  SingleBoxPreset,
  CollageGridLayout,
  PHOTO_PLACEHOLDER_SVG,
} from './data/boxes';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { Inspector } from './components/Inspector';
import { toPng, toJpeg, toBlob } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Trash2, FileText, AlertTriangle } from 'lucide-react';

const INITIAL_PROJECT: ProjectState = {
  version: 1,
  name: 'Mio Post Social',
  preset: 'square',
  width: 1080,
  height: 1080,
  background: TEMPLATES[0].background,
  layers: JSON.parse(JSON.stringify(TEMPLATES[0].layers)),
};

export default function App() {
  const [project, setProject] = useState<ProjectState>(INITIAL_PROJECT);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('templates');
  const [zoom, setZoom] = useState<number>(0.55);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);

  // Undo / Redo History
  const [history, setHistory] = useState<ProjectState[]>([INITIAL_PROJECT]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Custom user-loaded fonts
  const [customFonts, setCustomFonts] = useState<FontDefinition[]>([]);

  // Initialize stored custom fonts on mount
  useEffect(() => {
    initializeCustomFonts().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setCustomFonts(loaded);
      }
    });
  }, []);

  const handleAddCustomFont = (font: FontDefinition) => {
    setCustomFonts((prev) => [
      font,
      ...prev.filter((f) => f.family.toLowerCase() !== font.family.toLowerCase()),
    ]);
  };

  const handleRemoveCustomFont = (family: string) => {
    setCustomFonts((prev) =>
      prev.filter((f) => f.family.toLowerCase() !== family.toLowerCase())
    );
  };

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Auto calculate optimal zoom to fit canvas in viewport
  const handleFitScreen = useCallback(() => {
    if (!canvasContainerRef.current) return;
    const containerW = canvasContainerRef.current.clientWidth - 80;
    const containerH = canvasContainerRef.current.clientHeight - 80;
    if (containerW <= 0 || containerH <= 0) return;

    const scaleW = containerW / project.width;
    const scaleH = containerH / project.height;
    const bestZoom = Math.min(scaleW, scaleH, 1.0);
    // Round to 2 decimal places
    setZoom(Math.max(0.2, Math.round(bestZoom * 100) / 100));
  }, [project.width, project.height]);

  useEffect(() => {
    handleFitScreen();
    window.addEventListener('resize', handleFitScreen);
    return () => window.removeEventListener('resize', handleFitScreen);
  }, [handleFitScreen]);

  // Helper to push a state to history
  const pushHistory = (newProject: ProjectState) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newProject];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setProject(JSON.parse(JSON.stringify(history[nextIndex])));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setProject(JSON.parse(JSON.stringify(history[nextIndex])));
    }
  };

  // Keyboard Shortcuts (Undo, Redo, Delete, Duplicate, Deselect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInputActive) {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isInputActive) {
          e.preventDefault();
          handleRedo();
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputActive) {
        if (selectedLayerId) {
          e.preventDefault();
          handleDeleteLayer(selectedLayerId);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        if (selectedLayerId && !isInputActive) {
          e.preventDefault();
          handleDuplicateLayer(selectedLayerId);
        }
      } else if (e.key === 'Escape') {
        setSelectedLayerId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, selectedLayerId]);

  // Update a layer
  const handleUpdateLayer = (id: string, updates: Partial<Layer>) => {
    setProject((prev) => {
      const updatedLayers = prev.layers.map((l) =>
        l.id === id ? ({ ...l, ...updates } as Layer) : l
      );
      const newProj = { ...prev, layers: updatedLayers };
      return newProj;
    });
  };

  // Duplicate layer
  const handleDuplicateLayer = (id: string) => {
    const layerToDup = project.layers.find((l) => l.id === id);
    if (!layerToDup) return;

    const newLayer: Layer = {
      ...JSON.parse(JSON.stringify(layerToDup)),
      id: 'layer_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: `${layerToDup.name} (Copia)`,
      x: layerToDup.x + 30,
      y: layerToDup.y + 30,
    };

    const newProject: ProjectState = {
      ...project,
      layers: [...project.layers, newLayer],
    };
    setProject(newProject);
    pushHistory(newProject);
    setSelectedLayerId(newLayer.id);
  };

  // Delete layer
  const handleDeleteLayer = (id: string) => {
    const newProject: ProjectState = {
      ...project,
      layers: project.layers.filter((l) => l.id !== id),
    };
    setProject(newProject);
    pushHistory(newProject);
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  // Change preset format
  const handleChangePreset = (presetId: CanvasPresetId) => {
    const preset = CANVAS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const newProj: ProjectState = {
      ...project,
      preset: presetId,
      width: preset.width,
      height: preset.height,
    };
    setProject(newProj);
    pushHistory(newProj);
    setTimeout(handleFitScreen, 100);
  };

  // Apply a complete template
  const handleApplyTemplate = (template: TemplateDefinition) => {
    const preset = CANVAS_PRESETS.find((p) => p.id === template.preset) || CANVAS_PRESETS[0];
    const newProj: ProjectState = {
      version: 1,
      name: template.title,
      preset: template.preset,
      width: preset.width,
      height: preset.height,
      background: JSON.parse(JSON.stringify(template.background)),
      layers: JSON.parse(JSON.stringify(template.layers)),
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(null);
    setTimeout(handleFitScreen, 100);
  };

  // Background update
  const handleChangeBackground = (bg: CanvasBackground) => {
    const newProj: ProjectState = {
      ...project,
      background: bg,
    };
    setProject(newProj);
    pushHistory(newProj);
  };

  // Add Text Layer
  const handleAddTextLayer = (
    presetType: 'title' | 'subtitle' | 'body' | 'quote' | 'badge' | 'handwriting'
  ) => {
    const id = 'text_' + Date.now();
    let newLayer: Layer;

    const contentW = Math.round(project.width * 0.8);
    const centerX = Math.round((project.width - contentW) / 2);

    // Smart vertical layout slot per preset type to prevent overlapping
    let targetY: number;
    switch (presetType) {
      case 'badge':
        targetY = Math.round(project.height * 0.16);
        break;
      case 'title':
        targetY = Math.round(project.height * 0.26);
        break;
      case 'subtitle':
        targetY = Math.round(project.height * 0.44);
        break;
      case 'body':
        targetY = Math.round(project.height * 0.56);
        break;
      case 'quote':
        targetY = Math.round(project.height * 0.38);
        break;
      case 'handwriting':
        targetY = Math.round(project.height * 0.70);
        break;
      default:
        targetY = Math.round(project.height * 0.45);
        break;
    }

    // Offset downwards if this slot is already occupied
    const isOccupied = project.layers.some(
      (l) => !l.isHidden && Math.abs(l.y - targetY) < 45
    );
    if (isOccupied) {
      targetY = Math.min(project.height - 180, targetY + 55);
    }

    switch (presetType) {
      case 'title':
        newLayer = {
          id,
          type: 'text',
          name: 'Titolo Grande',
          x: centerX,
          y: targetY,
          width: contentW,
          height: 150,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          text: 'IL TUO TITOLO QUI',
          fontFamily: 'Playfair Display',
          fontSize: 72,
          fontWeight: '700',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#0f172a',
          letterSpacing: 0,
          lineHeight: 1.2,
          textTransform: 'none',
        };
        break;

      case 'subtitle':
        newLayer = {
          id,
          type: 'text',
          name: 'Sottotitolo',
          x: centerX,
          y: targetY,
          width: contentW,
          height: 70,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          text: 'SOTTOTITOLO O CATEGORIA',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 44,
          fontWeight: '700',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#0284c7',
          letterSpacing: 2,
          lineHeight: 1.2,
          textTransform: 'uppercase',
        };
        break;

      case 'quote':
        newLayer = {
          id,
          type: 'text',
          name: 'Citazione Poetica',
          x: centerX,
          y: targetY,
          width: contentW,
          height: 180,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          text: '“La semplicità è la massima sofisticazione.”',
          fontFamily: 'Cormorant Garamond',
          fontSize: 48,
          fontWeight: '500',
          fontStyle: 'italic',
          textAlign: 'center',
          color: '#1e293b',
          letterSpacing: 0,
          lineHeight: 1.4,
          textTransform: 'none',
        };
        break;

      case 'badge': {
        const badgeW = Math.round(project.width * 0.38);
        newLayer = {
          id,
          type: 'text',
          name: 'Badge Tag',
          x: Math.round((project.width - badgeW) / 2),
          y: targetY,
          width: badgeW,
          height: 58,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          text: 'IN EVIDENZA',
          fontFamily: 'Plus Jakarta Sans',
          fontSize: 28,
          fontWeight: '700',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#4f46e5',
          letterSpacing: 2,
          lineHeight: 1,
          textTransform: 'uppercase',
          backgroundColor: '#e0e7ff',
          backgroundPadding: 16,
          backgroundBorderRadius: 24,
        };
        break;
      }

      case 'handwriting':
        newLayer = {
          id,
          type: 'text',
          name: 'Nota Spontanea',
          x: centerX,
          y: targetY,
          width: contentW,
          height: 90,
          rotation: -3,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          text: 'Un momento da ricordare con un sorriso ☀️',
          fontFamily: 'Caveat',
          fontSize: 54,
          fontWeight: '700',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#d97706',
          letterSpacing: 0,
          lineHeight: 1.2,
          textTransform: 'none',
        };
        break;

      case 'body':
      default:
        newLayer = {
          id,
          type: 'text',
          name: 'Paragrafo Testo',
          x: centerX,
          y: targetY,
          width: contentW,
          height: 180,
          rotation: 0,
          opacity: 1,
          isLocked: false,
          isHidden: false,
          text: 'Scrivi qui la tua riflessione, nota personale o spiegazione per arricchire il tuo post.',
          fontFamily: 'DM Sans',
          fontSize: 38,
          fontWeight: '400',
          fontStyle: 'normal',
          textAlign: 'center',
          color: '#475569',
          letterSpacing: 0,
          lineHeight: 1.5,
          textTransform: 'none',
        };
        break;
    }

    const newProj: ProjectState = {
      ...project,
      layers: [...project.layers, newLayer],
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(newLayer.id);
  };

  // Add Custom Free Text Layer with personal font and custom styles
  const handleAddCustomTextLayer = (options: {
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
  }) => {
    const id = 'text_' + Date.now();
    const contentW = Math.min(840, Math.round(project.width * 0.85));
    const h = Math.max(70, Math.round(options.fontSize * 2.2));

    let customY = Math.round((project.height - h) / 2);
    const isCustomSlotOccupied = project.layers.some(
      (l) => !l.isHidden && Math.abs(l.y - customY) < 40
    );
    if (isCustomSlotOccupied) {
      const textCount = project.layers.filter((l) => l.type === 'text').length;
      customY = Math.min(project.height - h - 50, customY + (textCount % 4) * 45);
    }

    const newLayer: TextLayer = {
      id,
      type: 'text',
      name: options.text.trim().slice(0, 24) || 'Testo Libero',
      x: Math.round((project.width - contentW) / 2),
      y: customY,
      width: contentW,
      height: h,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isHidden: false,
      text: options.text || 'Il tuo testo qui...',
      fontFamily: options.fontFamily || 'Plus Jakarta Sans',
      fontSize: options.fontSize || 42,
      fontWeight: options.fontWeight || '600',
      fontStyle: options.fontStyle || 'normal',
      textAlign: options.textAlign || 'center',
      color: options.color || '#ffffff',
      letterSpacing: options.letterSpacing || 0,
      lineHeight: 1.35,
      textTransform: 'none',
      backgroundColor: options.backgroundColor,
      backgroundPadding: options.backgroundPadding,
      backgroundBorderRadius: options.backgroundBorderRadius,
    };

    const newProj: ProjectState = {
      ...project,
      layers: [...project.layers, newLayer],
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(newLayer.id);
  };

  // Add Shape Layer
  const handleAddShapeLayer = (shapeType: ShapeType) => {
    const shapeDef = SHAPE_LIST.find((s) => s.type === shapeType) || SHAPE_LIST[0];
    const id = 'shape_' + Date.now();

    const shapeCount = project.layers.filter((l) => l.type === 'shape').length;
    const offset = (shapeCount % 4) * 28;

    const newLayer: Layer = {
      id,
      type: 'shape',
      name: shapeDef.name,
      x: Math.round((project.width - shapeDef.defaultWidth) / 2) + offset,
      y: Math.round((project.height - shapeDef.defaultHeight) / 2) + offset,
      width: shapeDef.defaultWidth,
      height: shapeDef.defaultHeight,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isHidden: false,
      shapeType,
      fillColor: shapeDef.defaultFill,
      strokeColor: shapeDef.defaultStroke,
      strokeWidth: shapeDef.defaultStrokeWidth,
      strokeStyle: 'solid',
      borderRadius: shapeType === 'rect' ? 16 : 0,
    };

    const newProj: ProjectState = {
      ...project,
      layers: [...project.layers, newLayer],
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(newLayer.id);
  };

  // Add Icon Layer
  const handleAddIconLayer = (iconName: string) => {
    const id = 'icon_' + Date.now();
    const size = 120;
    const iconCount = project.layers.filter((l) => l.type === 'icon').length;
    const offset = (iconCount % 4) * 32;

    const newLayer: Layer = {
      id,
      type: 'icon',
      name: `Icona ${iconName}`,
      x: Math.round((project.width - size) / 2) + offset,
      y: Math.round((project.height - size) / 2) + offset,
      width: size,
      height: size,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isHidden: false,
      iconName,
      color: '#4f46e5',
      strokeWidth: 2,
    };

    const newProj: ProjectState = {
      ...project,
      layers: [...project.layers, newLayer],
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(newLayer.id);
  };

  // Add Image Layer from data URL
  const handleAddImageLayer = (src: string, name = 'Foto') => {
    const id = 'img_' + Date.now();
    const w = Math.round(project.width * 0.6);
    const h = Math.round(project.height * 0.5);
    const imgCount = project.layers.filter((l) => l.type === 'image').length;
    const offset = (imgCount % 4) * 30;

    const newLayer: Layer = {
      id,
      type: 'image',
      name,
      x: Math.round((project.width - w) / 2) + offset,
      y: Math.round((project.height - h) / 2) + offset,
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isHidden: false,
      src,
      objectFit: 'cover',
      borderRadius: 16,
      borderWidth: 0,
      borderColor: 'transparent',
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        grayscale: 0,
        sepia: 0,
        blur: 0,
      },
    };

    const newProj: ProjectState = {
      ...project,
      layers: [...project.layers, newLayer],
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(newLayer.id);
  };

  // Upload custom user image from local computer (offline)
  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleAddImageLayer(e.target.result as string, file.name.split('.')[0] || 'Foto Caricata');
      }
    };
    reader.readAsDataURL(file);
  };

  // Layer Reordering
  const handleReorderLayer = (fromIndex: number, toIndex: number) => {
    const layers = [...project.layers];
    const [moved] = layers.splice(fromIndex, 1);
    layers.splice(toIndex, 0, moved);

    const newProj: ProjectState = { ...project, layers };
    setProject(newProj);
    pushHistory(newProj);
  };

  // Layer Visibility & Lock
  const handleToggleLayerVisibility = (id: string) => {
    const layer = project.layers.find((l) => l.id === id);
    if (!layer) return;
    handleUpdateLayer(id, { isHidden: !layer.isHidden });
  };

  const handleToggleLayerLock = (id: string) => {
    const layer = project.layers.find((l) => l.id === id);
    if (!layer) return;
    handleUpdateLayer(id, { isLocked: !layer.isLocked });
  };

  // Layer Bring to Front & Send to Back
  const handleBringToFront = (id: string) => {
    const idx = project.layers.findIndex((l) => l.id === id);
    if (idx < 0 || idx === project.layers.length - 1) return;
    handleReorderLayer(idx, project.layers.length - 1);
  };

  const handleSendToBack = (id: string) => {
    const idx = project.layers.findIndex((l) => l.id === id);
    if (idx <= 0) return;
    handleReorderLayer(idx, 0);
  };

  const handleBringForward = (id: string) => {
    const idx = project.layers.findIndex((l) => l.id === id);
    if (idx < 0 || idx >= project.layers.length - 1) return;
    handleReorderLayer(idx, idx + 1);
  };

  const handleSendBackward = (id: string) => {
    const idx = project.layers.findIndex((l) => l.id === id);
    if (idx <= 0) return;
    handleReorderLayer(idx, idx - 1);
  };

  // Align layer on canvas or nudge position
  const handleAlignLayer = (
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
  ) => {
    const layer = project.layers.find((l) => l.id === selectedLayerId);
    if (!layer) return;

    let newX = layer.x;
    let newY = layer.y;

    if (alignment === 'left') newX = 40;
    if (alignment === 'center-h') newX = Math.round((project.width - layer.width) / 2);
    if (alignment === 'right') newX = Math.round(project.width - layer.width - 40);

    if (alignment === 'top') newY = 40;
    if (alignment === 'center-v') newY = Math.round((project.height - layer.height) / 2);
    if (alignment === 'bottom') newY = Math.round(project.height - layer.height - 40);

    if (alignment === 'center-both') {
      newX = Math.round((project.width - layer.width) / 2);
      newY = Math.round((project.height - layer.height) / 2);
    }

    if (alignment === 'nudge-up') newY = Math.max(0, layer.y - 20);
    if (alignment === 'nudge-down') newY = Math.min(project.height - layer.height, layer.y + 20);
    if (alignment === 'nudge-left') newX = Math.max(0, layer.x - 20);
    if (alignment === 'nudge-right') newX = Math.min(project.width - layer.width, layer.x + 20);

    handleUpdateLayer(layer.id, { x: newX, y: newY });
  };

  // Auto-arrange and stack layers vertically to eliminate all overlaps
  const handleAutoStackLayers = () => {
    const visibleLayers = project.layers.filter((l) => !l.isHidden && !l.isLocked);
    const contentLayers = visibleLayers.filter(
      (l) => l.width < project.width * 0.95 || l.height < project.height * 0.95
    );
    if (contentLayers.length <= 1) return;

    // Sort by current Y coordinate
    const sorted = [...contentLayers].sort((a, b) => a.y - b.y);

    const gap = 24;
    const totalContentHeight =
      sorted.reduce((sum, l) => sum + l.height, 0) + gap * (sorted.length - 1);
    const startY = Math.max(60, Math.round((project.height - totalContentHeight) / 2));

    const updatedLayers = project.layers.map((layer) => {
      const idx = sorted.findIndex((cl) => cl.id === layer.id);
      if (idx === -1) return layer;

      let y = startY;
      for (let i = 0; i < idx; i++) {
        y += sorted[i].height + gap;
      }
      const x = Math.round((project.width - layer.width) / 2);
      return { ...layer, x, y };
    });

    const newProj: ProjectState = { ...project, layers: updatedLayers };
    setProject(newProj);
    pushHistory(newProj);
  };

  // Distribute layers vertically with equal spacing
  const handleDistributeLayers = () => {
    const visibleLayers = project.layers.filter((l) => !l.isHidden && !l.isLocked);
    const contentLayers = visibleLayers.filter(
      (l) => l.width < project.width * 0.95 || l.height < project.height * 0.95
    );
    if (contentLayers.length <= 2) {
      handleAutoStackLayers();
      return;
    }

    const sorted = [...contentLayers].sort((a, b) => a.y - b.y);
    const topY = sorted[0].y;
    const lastLayer = sorted[sorted.length - 1];
    const bottomY = lastLayer.y + lastLayer.height;

    const totalHeight = sorted.reduce((sum, l) => sum + l.height, 0);
    const availableSpace = Math.max(0, bottomY - topY - totalHeight);
    const gap = Math.round(availableSpace / (sorted.length - 1));

    const updatedLayers = project.layers.map((layer) => {
      const idx = sorted.findIndex((cl) => cl.id === layer.id);
      if (idx === -1 || idx === 0 || idx === sorted.length - 1) return layer;

      let y = topY;
      for (let i = 0; i < idx; i++) {
        y += sorted[i].height + gap;
      }
      return { ...layer, y };
    });

    const newProj: ProjectState = { ...project, layers: updatedLayers };
    setProject(newProj);
    pushHistory(newProj);
  };

  // Clear canvas modal trigger
  const handleClearCanvas = () => {
    setIsClearModalOpen(true);
  };

  // Create a completely clean blank canvas
  const handleNewBlankCanvas = (presetId?: CanvasPresetId) => {
    const targetPreset = presetId || project.preset;
    const presetConfig = CANVAS_PRESETS.find((p) => p.id === targetPreset) || CANVAS_PRESETS[0];
    const newProj: ProjectState = {
      version: 1,
      name: 'Foglio Bianco',
      preset: targetPreset,
      width: presetConfig.width,
      height: presetConfig.height,
      background: { type: 'solid', color: '#ffffff' },
      layers: [],
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(null);
    setIsClearModalOpen(false);
    setTimeout(handleFitScreen, 100);
  };

  // Add a standalone customizable box preset to the canvas
  const handleAddBoxPreset = (boxPreset: SingleBoxPreset) => {
    const newBox: ImageLayer = {
      id: `box_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: 'image',
      name: boxPreset.name,
      x: Math.round((project.width - boxPreset.width) / 2),
      y: Math.round((project.height - boxPreset.height) / 2),
      width: boxPreset.width,
      height: boxPreset.height,
      rotation: 0,
      opacity: 1,
      isLocked: false,
      isHidden: false,
      src: boxPreset.initialSrc || PHOTO_PLACEHOLDER_SVG,
      objectFit: boxPreset.objectFit,
      borderRadius: boxPreset.borderRadius,
      borderWidth: boxPreset.borderWidth,
      borderColor: boxPreset.borderColor,
      shadow: boxPreset.shadow,
      frameStyle: boxPreset.frameStyle,
      frameColor: boxPreset.frameColor,
      caption: boxPreset.caption,
      captionFontFamily: boxPreset.captionFontFamily,
      captionFontSize: boxPreset.captionFontSize,
      captionColor: boxPreset.captionColor,
      filters: { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, blur: 0 },
    };
    const newProj: ProjectState = {
      ...project,
      layers: [...project.layers, newBox],
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(newBox.id);
  };

  // Apply a collage grid layout to the canvas
  const handleApplyCollageGrid = (grid: CollageGridLayout) => {
    const generated = grid.generateLayers(project.width, project.height);
    const newProj: ProjectState = {
      ...project,
      layers: generated,
    };
    setProject(newProj);
    pushHistory(newProj);
    setSelectedLayerId(generated[0]?.id || null);
  };

  // Save project as JSON file
  const handleSaveJson = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Load project from JSON file
  const handleLoadJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loaded = JSON.parse(e.target?.result as string) as ProjectState;
        if (loaded && Array.isArray(loaded.layers)) {
          setProject(loaded);
          pushHistory(loaded);
          setSelectedLayerId(null);
          setTimeout(handleFitScreen, 100);
        } else {
          alert('Il file non contiene un formato di progetto valido.');
        }
      } catch (err) {
        alert('Errore nel caricamento del file JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Export to PNG or JPEG
  const handleExport = async (format: 'png' | 'jpeg', scale = 1) => {
    if (!exportRef.current || isExporting) return;

    // Deselect layer during export so bounding box handles don't appear in final image
    const prevSelected = selectedLayerId;
    setSelectedLayerId(null);
    setIsExporting(true);

    try {
      // Small tick to ensure DOM unselect is flushed
      await new Promise((resolve) => setTimeout(resolve, 60));

      const options = {
        pixelRatio: scale,
        cacheBust: true,
        quality: 0.96,
      };

      let dataUrl = '';
      try {
        if (format === 'jpeg') {
          dataUrl = await toJpeg(exportRef.current, options);
        } else {
          dataUrl = await toPng(exportRef.current, options);
        }
      } catch (primaryErr) {
        console.warn('Fallback esportazione con skipFonts:', primaryErr);
        if (format === 'jpeg') {
          dataUrl = await toJpeg(exportRef.current, { ...options, skipFonts: true });
        } else {
          dataUrl = await toPng(exportRef.current, { ...options, skipFonts: true });
        }
      }

      // Download file
      const link = document.createElement('a');
      link.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_${scale > 1 ? 'hd' : 'std'}.${format === 'jpeg' ? 'jpg' : 'png'}`;
      link.href = dataUrl;
      link.click();

      // Confetti feedback
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Errore durante esportazione:', err);
      alert('Impossibile esportare l\'immagine. Riprova.');
    } finally {
      setIsExporting(false);
      setSelectedLayerId(prevSelected);
    }
  };

  // Copy Image to Clipboard
  const handleCopyClipboard = async () => {
    if (!exportRef.current || isExporting) return;
    const prevSelected = selectedLayerId;
    setSelectedLayerId(null);
    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 60));
      let blob: Blob | null = null;
      try {
        blob = await toBlob(exportRef.current, {
          pixelRatio: 1,
          cacheBust: true,
        });
      } catch (primaryErr) {
        console.warn('Fallback copia negli appunti con skipFonts:', primaryErr);
        blob = await toBlob(exportRef.current, {
          pixelRatio: 1,
          cacheBust: true,
          skipFonts: true,
        });
      }
      if (blob && navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ 'image/png': blob }),
        ]);
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
        });
      } else {
        alert('Copia negli appunti non supportata direttamente su questo browser.');
      }
    } catch (err) {
      console.error('Copia negli appunti fallita:', err);
    } finally {
      setIsExporting(false);
      setSelectedLayerId(prevSelected);
    }
  };

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId) || null;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Main Toolbar */}
      <Toolbar
        project={project}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomChange={setZoom}
        onFitScreen={handleFitScreen}
        onChangePreset={handleChangePreset}
        onClearCanvas={handleClearCanvas}
        onNewBlankCanvas={handleNewBlankCanvas}
        onExport={handleExport}
        onCopyClipboard={handleCopyClipboard}
        onSaveJson={handleSaveJson}
        onLoadJson={handleLoadJson}
        isExporting={isExporting}
      />

      {/* Main Studio Workspace: Sidebar (Left) + Canvas (Center) + Inspector (Right) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Materials Library */}
        <Sidebar
          activeTab={activeSidebarTab}
          onTabChange={setActiveSidebarTab}
          onApplyTemplate={handleApplyTemplate}
          onNewBlankCanvas={handleNewBlankCanvas}
          onAddBoxPreset={handleAddBoxPreset}
          onApplyCollageGrid={handleApplyCollageGrid}
          onAddTextLayer={handleAddTextLayer}
          onAddCustomTextLayer={handleAddCustomTextLayer}
          customFonts={customFonts}
          onAddCustomFont={handleAddCustomFont}
          onRemoveCustomFont={handleRemoveCustomFont}
          onAddShapeLayer={handleAddShapeLayer}
          onAddIconLayer={handleAddIconLayer}
          onAddImageLayer={handleAddImageLayer}
          onUploadImage={handleUploadImage}
          background={project.background}
          onChangeBackground={handleChangeBackground}
          layers={project.layers}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onReorderLayer={handleReorderLayer}
          onToggleLayerVisibility={handleToggleLayerVisibility}
          onToggleLayerLock={handleToggleLayerLock}
          onDeleteLayer={handleDeleteLayer}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onAutoStackLayers={handleAutoStackLayers}
          onDistributeLayers={handleDistributeLayers}
        />

        {/* Center Interactive Canvas Stage */}
        <Canvas
          project={project}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={handleUpdateLayer}
          zoom={zoom}
          canvasContainerRef={canvasContainerRef}
          exportRef={exportRef}
        />

        {/* Right Inspector & Formatting Tools */}
        <Inspector
          project={project}
          selectedLayer={selectedLayer}
          onUpdateLayer={handleUpdateLayer}
          onDuplicateLayer={handleDuplicateLayer}
          onDeleteLayer={handleDeleteLayer}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onChangePreset={handleChangePreset}
          onAlignLayer={handleAlignLayer}
          onAutoStackLayers={handleAutoStackLayers}
          onDistributeLayers={handleDistributeLayers}
          customFonts={customFonts}
          onAddCustomFont={handleAddCustomFont}
          onRemoveCustomFont={handleRemoveCustomFont}
          zoom={zoom}
        />
      </div>

      {/* Clear Canvas Confirmation Modal (Replaces blocked window.confirm) */}
      {isClearModalOpen && (
        <div
          id="clear-canvas-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setIsClearModalOpen(false)}
        >
          <div
            id="clear-canvas-modal-dialog"
            className="bg-slate-900 border border-slate-700 p-5 rounded-2xl max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/25 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Svuotare la tela?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Scegli come procedere: puoi creare un foglio bianco pulito da zero oppure azzerare i livelli mantenendo lo sfondo.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                id="btn-confirm-white-sheet"
                onClick={() => handleNewBlankCanvas(project.preset)}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Crea Foglio Bianco pulito (sfondo bianco)</span>
              </button>

              <button
                id="btn-confirm-clear-layers"
                onClick={() => {
                  const newProj: ProjectState = {
                    ...project,
                    layers: [],
                  };
                  setProject(newProj);
                  pushHistory(newProj);
                  setSelectedLayerId(null);
                  setIsClearModalOpen(false);
                }}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Svuota livelli (mantieni sfondo attuale)</span>
              </button>

              <button
                id="btn-cancel-clear-modal"
                onClick={() => setIsClearModalOpen(false)}
                className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
