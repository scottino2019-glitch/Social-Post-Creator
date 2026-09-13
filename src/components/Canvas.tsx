import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ProjectState, Layer, TextLayer, ShapeLayer, IconLayer, ImageLayer } from '../types';
import { ShapeRenderer } from './ShapeRenderer';
import { ICON_MAP } from '../data/icons';
import { PATTERN_PRESETS } from '../data/backgrounds';
import { RotateCw, Lock } from 'lucide-react';

interface CanvasProps {
  project: ProjectState;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<Layer>) => void;
  zoom: number; // 1 = 100%, 0.5 = 50%, etc.
  canvasContainerRef: React.RefObject<HTMLDivElement | null>;
  exportRef: React.RefObject<HTMLDivElement | null>;
}

export const Canvas: React.FC<CanvasProps> = ({
  project,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  zoom,
  canvasContainerRef,
  exportRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{
    mouseX: number;
    mouseY: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  } | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId);

  // Background style computation
  const getBackgroundStyle = (): React.CSSProperties => {
    const { background } = project;
    if (background.type === 'gradient' && background.gradient) {
      const { type, angle, stops } = background.gradient;
      const stopStr = stops.map((s) => `${s.color} ${s.offset}%`).join(', ');
      return {
        background:
          type === 'linear'
            ? `linear-gradient(${angle}deg, ${stopStr})`
            : `radial-gradient(circle, ${stopStr})`,
      };
    }
    if (background.type === 'pattern' && background.patternId) {
      const pat = PATTERN_PRESETS.find((p) => p.id === background.patternId);
      if (pat) {
        const svg = pat.generateSvg(background.patternColor || '#94a3b8', background.patternScale || 28);
        const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
        return {
          backgroundColor: background.color || '#ffffff',
          backgroundImage: `url("${encoded}")`,
          backgroundRepeat: 'repeat',
        };
      }
    }
    if (background.type === 'image' && background.imageUrl) {
      return {
        backgroundColor: background.color || '#000000',
        backgroundImage: `url("${background.imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { backgroundColor: background.color || '#ffffff' };
  };

  // Dragging / Resizing / Rotating Handler
  const handlePointerDown = (
    e: React.PointerEvent,
    layerId: string,
    handle: string | null = null
  ) => {
    e.stopPropagation();

    let targetId = layerId;

    // If handle is provided (corner, edge, rotate), user is interacting with handles of layerId
    if (!handle) {
      // If user clicks on the currently selected layer, keep dragging this layer
      if (selectedLayerId === layerId) {
        targetId = selectedLayerId;
      } else {
        targetId = layerId;
      }
    }

    const layer = project.layers.find((l) => l.id === targetId);
    if (!layer || layer.isLocked) {
      onSelectLayer(targetId);
      return;
    }

    onSelectLayer(targetId);
    setIsDragging(true);
    setDragHandle(handle);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: layer.x,
      y: layer.y,
      width: layer.width,
      height: layer.height,
      rotation: layer.rotation,
    });
  };

  // Robust window-level pointermove & pointerup while dragging
  useEffect(() => {
    if (!isDragging || !dragStart || !selectedLayer || selectedLayer.isLocked) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const deltaX = (e.clientX - dragStart.mouseX) / zoom;
      const deltaY = (e.clientY - dragStart.mouseY) / zoom;

      if (!dragHandle) {
        // Simple move
        const newX = Math.round(dragStart.x + deltaX);
        const newY = Math.round(dragStart.y + deltaY);
        onUpdateLayer(selectedLayer.id, { x: newX, y: newY });
      } else if (dragHandle === 'rot') {
        // Rotate
        const rect = exportRef.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.left + (dragStart.x + dragStart.width / 2) * zoom;
        const centerY = rect.top + (dragStart.y + dragStart.height / 2) * zoom;
        const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        let deg = Math.round((radians * 180) / Math.PI) - 90;
        deg = (deg % 360 + 360) % 360;
        // Snap to cardinal angles
        if (Math.abs(deg) < 4 || Math.abs(deg - 360) < 4) deg = 0;
        if (Math.abs(deg - 90) < 4) deg = 90;
        if (Math.abs(deg - 180) < 4) deg = 180;
        if (Math.abs(deg - 270) < 4) deg = 270;
        onUpdateLayer(selectedLayer.id, { rotation: deg });
      } else {
        // Resize handles
        let newX = dragStart.x;
        let newY = dragStart.y;
        let newW = dragStart.width;
        let newH = dragStart.height;
        const minSize = 20;

        if (dragHandle.includes('e')) {
          newW = Math.max(minSize, Math.round(dragStart.width + deltaX));
        }
        if (dragHandle.includes('s')) {
          newH = Math.max(minSize, Math.round(dragStart.height + deltaY));
        }
        if (dragHandle.includes('w')) {
          const potW = Math.max(minSize, Math.round(dragStart.width - deltaX));
          newX = Math.round(dragStart.x + (dragStart.width - potW));
          newW = potW;
        }
        if (dragHandle.includes('n')) {
          const potH = Math.max(minSize, Math.round(dragStart.height - deltaY));
          newY = Math.round(dragStart.y + (dragStart.height - potH));
          newH = potH;
        }

        onUpdateLayer(selectedLayer.id, {
          x: newX,
          y: newY,
          width: newW,
          height: newH,
        });
      }
    };

    const handleWindowPointerUp = () => {
      setIsDragging(false);
      setDragHandle(null);
      setDragStart(null);
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [isDragging, dragStart, selectedLayer, dragHandle, zoom, onUpdateLayer, exportRef]);

  // Keyboard nudge with arrow keys & Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focused in an input or textarea
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }
      if (!selectedLayer || selectedLayer.isLocked) return;

      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateLayer(selectedLayer.id, { y: selectedLayer.y - step });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateLayer(selectedLayer.id, { y: selectedLayer.y + step });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onUpdateLayer(selectedLayer.id, { x: selectedLayer.x - step });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateLayer(selectedLayer.id, { x: selectedLayer.x + step });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayer, onUpdateLayer]);

  const renderLayerContent = (layer: Layer) => {
    switch (layer.type) {
      case 'text': {
        const textLayer = layer as TextLayer;
        const isEditing = editingTextId === textLayer.id;

        if (isEditing) {
          return (
            <textarea
              autoFocus
              defaultValue={textLayer.text}
              onBlur={(e) => {
                onUpdateLayer(textLayer.id, { text: e.target.value });
                setEditingTextId(null);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Escape') {
                  setEditingTextId(null);
                }
              }}
              className="w-full h-full bg-slate-900/60 backdrop-blur-xs border-2 border-indigo-400 rounded-lg p-1.5 resize-none focus:outline-hidden"
              style={{
                fontFamily: textLayer.fontFamily,
                fontSize: `${textLayer.fontSize}px`,
                fontWeight: textLayer.fontWeight,
                fontStyle: textLayer.fontStyle,
                textAlign: textLayer.textAlign,
                color: textLayer.color,
                letterSpacing: `${textLayer.letterSpacing}px`,
                lineHeight: textLayer.lineHeight,
                textTransform: textLayer.textTransform,
                backgroundColor: textLayer.backgroundColor || 'transparent',
              }}
            />
          );
        }

        return (
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (!textLayer.isLocked) {
                setEditingTextId(textLayer.id);
              }
            }}
            title="Fai doppio clic per modificare il testo direttamente sulla tela"
            className="w-full h-full flex flex-col justify-center select-none cursor-text"
            style={{
              fontFamily: textLayer.fontFamily,
              fontSize: `${textLayer.fontSize}px`,
              fontWeight: textLayer.fontWeight,
              fontStyle: textLayer.fontStyle,
              textAlign: textLayer.textAlign,
              color: textLayer.color,
              letterSpacing: `${textLayer.letterSpacing}px`,
              lineHeight: textLayer.lineHeight,
              textTransform: textLayer.textTransform,
              backgroundColor: textLayer.backgroundColor || 'transparent',
              padding: textLayer.backgroundPadding ? `${textLayer.backgroundPadding}px` : undefined,
              borderRadius: textLayer.backgroundBorderRadius
                ? `${textLayer.backgroundBorderRadius}px`
                : undefined,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {textLayer.text}
          </div>
        );
      }

      case 'shape': {
        return <ShapeRenderer layer={layer as ShapeLayer} />;
      }

      case 'icon': {
        const iconLayer = layer as IconLayer;
        const IconComp = ICON_MAP[iconLayer.iconName];
        if (!IconComp) return null;
        return (
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <IconComp
              style={{
                width: '100%',
                height: '100%',
                color: iconLayer.color,
                strokeWidth: iconLayer.strokeWidth,
              }}
            />
          </div>
        );
      }

      case 'image': {
        const imgLayer = layer as ImageLayer;
        const { filters, frameStyle = 'none' } = imgLayer;
        const filterStr = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur}px)`;

        if (frameStyle === 'polaroid') {
          const frameBg = imgLayer.frameColor || '#ffffff';
          const captionText = imgLayer.caption;
          const captionFont = imgLayer.captionFontFamily || 'Caveat';
          const captionSize = imgLayer.captionFontSize || 28;
          const captionCol = imgLayer.captionColor || '#334155';
          const captionAlign = imgLayer.captionAlign || 'center';

          return (
            <div
              className="w-full h-full flex flex-col select-none overflow-hidden"
              style={{
                backgroundColor: frameBg,
                borderRadius: `${imgLayer.borderRadius || 6}px`,
                border:
                  imgLayer.borderWidth > 0
                    ? `${imgLayer.borderWidth}px solid ${imgLayer.borderColor}`
                    : '1px solid rgba(0,0,0,0.06)',
                padding: '5.5% 5.5% 3% 5.5%',
              }}
            >
              {/* Inner Photo Area */}
              <div
                className="w-full flex-1 overflow-hidden relative"
                style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: '2px',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <img
                  src={imgLayer.src}
                  alt={imgLayer.name}
                  className="w-full h-full select-none pointer-events-none"
                  style={{
                    objectFit: imgLayer.objectFit,
                    filter: filterStr,
                  }}
                  draggable={false}
                />
              </div>

              {/* Bottom Chin (Classic Polaroid signature area) */}
              <div
                className="w-full shrink-0 flex items-center justify-center px-1"
                style={{
                  height: '22%',
                  minHeight: '28px',
                }}
              >
                {captionText ? (
                  <span
                    className="w-full truncate block"
                    style={{
                      fontFamily: captionFont,
                      fontSize: `${captionSize}px`,
                      color: captionCol,
                      textAlign: captionAlign,
                      lineHeight: 1.2,
                    }}
                  >
                    {captionText}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400/40 italic font-sans truncate">
                    Polaroid
                  </span>
                )}
              </div>
            </div>
          );
        }

        if (frameStyle === 'film') {
          const frameBg = imgLayer.frameColor || '#18181b';
          return (
            <div
              className="w-full h-full flex flex-col select-none overflow-hidden"
              style={{
                backgroundColor: frameBg,
                borderRadius: `${imgLayer.borderRadius || 4}px`,
                padding: '6% 4%',
              }}
            >
              {/* Sprocket Holes Top */}
              <div className="h-3 w-full flex justify-between items-center px-1 mb-1.5 opacity-70">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-3 h-2 bg-white/80 rounded-xs" />
                ))}
              </div>
              <div className="w-full flex-1 overflow-hidden relative rounded-xs border border-white/15">
                <img
                  src={imgLayer.src}
                  alt={imgLayer.name}
                  className="w-full h-full select-none pointer-events-none"
                  style={{ objectFit: imgLayer.objectFit, filter: filterStr }}
                  draggable={false}
                />
              </div>
              {/* Sprocket Holes Bottom */}
              <div className="h-3 w-full flex justify-between items-center px-1 mt-1.5 opacity-70">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-3 h-2 bg-white/80 rounded-xs" />
                ))}
              </div>
            </div>
          );
        }

        if (frameStyle === 'passepartout') {
          const frameBg = imgLayer.frameColor || '#ffffff';
          return (
            <div
              className="w-full h-full select-none overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: frameBg,
                borderRadius: `${imgLayer.borderRadius || 4}px`,
                border: '4px solid #0f172a',
                padding: '8%',
              }}
            >
              <div className="w-full h-full overflow-hidden border border-slate-300 shadow-inner">
                <img
                  src={imgLayer.src}
                  alt={imgLayer.name}
                  className="w-full h-full select-none pointer-events-none"
                  style={{ objectFit: imgLayer.objectFit, filter: filterStr }}
                  draggable={false}
                />
              </div>
            </div>
          );
        }

        if (frameStyle === 'classic') {
          const frameBg = imgLayer.frameColor || '#451a03';
          return (
            <div
              className="w-full h-full select-none overflow-hidden"
              style={{
                backgroundColor: frameBg,
                borderRadius: `${imgLayer.borderRadius || 4}px`,
                border: '6px solid #b45309',
                padding: '6%',
              }}
            >
              <div className="w-full h-full overflow-hidden border-2 border-amber-200/60 shadow-inner">
                <img
                  src={imgLayer.src}
                  alt={imgLayer.name}
                  className="w-full h-full select-none pointer-events-none"
                  style={{ objectFit: imgLayer.objectFit, filter: filterStr }}
                  draggable={false}
                />
              </div>
            </div>
          );
        }

        return (
          <div
            className="w-full h-full overflow-hidden"
            style={{
              borderRadius: `${imgLayer.borderRadius}px`,
              border:
                imgLayer.borderWidth > 0
                  ? `${imgLayer.borderWidth}px solid ${imgLayer.borderColor}`
                  : 'none',
            }}
          >
            <img
              src={imgLayer.src}
              alt={imgLayer.name}
              className="w-full h-full select-none pointer-events-none"
              style={{
                objectFit: imgLayer.objectFit,
                filter: filterStr,
              }}
              draggable={false}
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      ref={canvasContainerRef}
      id="canvas-viewport"
      className="flex-1 h-full overflow-auto bg-slate-950 flex items-center justify-center p-8 relative"
      onPointerDown={() => onSelectLayer(null)}
    >
      {/* Centered Scaled Stage */}
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          width: `${project.width}px`,
          height: `${project.height}px`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
        className="relative shrink-0 shadow-2xl rounded-sm"
      >
        {/* Actual Exportable Canvas */}
        <div
          ref={exportRef}
          id="social-export-canvas"
          className="w-full h-full relative overflow-hidden select-none"
          style={getBackgroundStyle()}
        >
          {/* Subtle noise/texture overlay if requested */}
          {project.background.imageOpacity && project.background.imageUrl && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("${project.background.imageUrl}")`,
                backgroundSize: 'cover',
                opacity: project.background.imageOpacity,
                filter: project.background.imageBlur ? `blur(${project.background.imageBlur}px)` : undefined,
              }}
            />
          )}

          {/* Render all visible layers in stack order */}
          {project.layers.map((layer, index) => {
            if (layer.isHidden) return null;

            const shadowStyle = layer.shadow
              ? `${layer.shadow.offsetX}px ${layer.shadow.offsetY}px ${layer.shadow.blur}px ${layer.shadow.color}`
              : undefined;

            return (
              <div
                key={layer.id}
                id={`layer-${layer.id}`}
                className="absolute cursor-move select-none"
                style={{
                  left: `${layer.x}px`,
                  top: `${layer.y}px`,
                  width: `${layer.width}px`,
                  height: `${layer.height}px`,
                  transform: `rotate(${layer.rotation}deg)`,
                  opacity: layer.opacity,
                  boxShadow: shadowStyle,
                  zIndex: 10 + index,
                }}
                onPointerDown={(e) => handlePointerDown(e, layer.id, null)}
              >
                {renderLayerContent(layer)}
              </div>
            );
          })}

          {/* Active Selection Bounding Box & Handles Overlay (zIndex 9000: always stays on top of all canvas layers) */}
          {selectedLayer && !selectedLayer.isHidden && (
            <div
              key={`selection-overlay-${selectedLayer.id}`}
              id="selected-layer-overlay"
              className="absolute pointer-events-none"
              style={{
                left: `${selectedLayer.x}px`,
                top: `${selectedLayer.y}px`,
                width: `${selectedLayer.width}px`,
                height: `${selectedLayer.height}px`,
                transform: `rotate(${selectedLayer.rotation}deg)`,
                zIndex: 9000,
              }}
            >
              {/* Inner draggable grab-area: allows smooth movement of the selected layer even if other layers overlap it */}
              {!selectedLayer.isLocked && (
                <div
                  className="absolute inset-0 pointer-events-auto cursor-move"
                  title="Trascina per spostare sulla scena"
                  onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, null)}
                  onDoubleClick={() => {
                    if (selectedLayer.type === 'text') {
                      setEditingTextId(selectedLayer.id);
                    }
                  }}
                />
              )}

              {/* Visual position pill indicator while dragging or selected */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-indigo-200 border border-indigo-500/40 text-[9px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                X: {selectedLayer.x}px • Y: {selectedLayer.y}px
              </div>

              <div
                className="absolute -inset-1 border-2 border-indigo-500 pointer-events-none rounded-xs"
                style={{
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.4)',
                }}
              >
                {/* Locked Indicator */}
                {selectedLayer.isLocked && (
                  <div className="absolute top-1 right-1 bg-amber-500 text-white p-1 rounded shadow pointer-events-auto">
                    <Lock className="w-3 h-3" />
                  </div>
                )}

                {/* Resize and Rotate Handles if not locked */}
                {!selectedLayer.isLocked && (
                  <>
                    {/* Rotation Handle */}
                    <div
                      className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-indigo-600 rounded-full shadow flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-115 transition-transform"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 'rot')}
                      title="Ruota livello"
                    >
                      <RotateCw className="w-3 h-3 text-indigo-600" />
                    </div>
                    {/* Connecting Line to Rotation Handle */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-indigo-500" />

                    {/* Corner Handles */}
                    <div
                      className="absolute -top-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full pointer-events-auto cursor-nwse-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 'nw')}
                    />
                    <div
                      className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full pointer-events-auto cursor-nesw-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 'ne')}
                    />
                    <div
                      className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full pointer-events-auto cursor-nesw-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 'sw')}
                    />
                    <div
                      className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-indigo-600 rounded-full pointer-events-auto cursor-nwse-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 'se')}
                    />

                    {/* Edge Handles */}
                    <div
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs pointer-events-auto cursor-ns-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 'n')}
                    />
                    <div
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs pointer-events-auto cursor-ns-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 's')}
                    />
                    <div
                      className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs pointer-events-auto cursor-ew-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 'w')}
                    />
                    <div
                      className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-600 rounded-xs pointer-events-auto cursor-ew-resize shadow"
                      onPointerDown={(e) => handlePointerDown(e, selectedLayer.id, 'e')}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
