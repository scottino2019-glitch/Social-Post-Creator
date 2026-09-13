import React from 'react';
import { ShapeLayer } from '../types';

interface ShapeRendererProps {
  layer: ShapeLayer;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({ layer }) => {
  const { shapeType, fillColor, strokeColor, strokeWidth, strokeStyle, borderRadius, width, height } = layer;

  const strokeDash =
    strokeStyle === 'dashed' ? '8,6' : strokeStyle === 'dotted' ? '3,4' : undefined;

  switch (shapeType) {
    case 'rect':
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={Math.max(0, width - strokeWidth)}
            height={Math.max(0, height - strokeWidth)}
            rx={borderRadius}
            ry={borderRadius}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'circle':
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={Math.max(0, (width - strokeWidth) / 2)}
            ry={Math.max(0, (height - strokeWidth) / 2)}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'triangle':
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <polygon
            points={`${width / 2},${strokeWidth} ${width - strokeWidth},${height - strokeWidth} ${strokeWidth},${height - strokeWidth}`}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'diamond':
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <polygon
            points={`${width / 2},${strokeWidth} ${width - strokeWidth},${height / 2} ${width / 2},${height - strokeWidth} ${strokeWidth},${height / 2}`}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'hexagon': {
      const w = width;
      const h = height;
      const pts = [
        `${w * 0.25},${strokeWidth}`,
        `${w * 0.75},${strokeWidth}`,
        `${w - strokeWidth},${h * 0.5}`,
        `${w * 0.75},${h - strokeWidth}`,
        `${w * 0.25},${h - strokeWidth}`,
        `${strokeWidth},${h * 0.5}`,
      ].join(' ');
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`}>
          <polygon
            points={pts}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'star5': {
      const cx = width / 2;
      const cy = height / 2;
      const outerR = Math.min(width, height) / 2 - strokeWidth;
      const innerR = outerR * 0.42;
      const points: string[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <polygon
            points={points.join(' ')}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'star8': {
      const cx = width / 2;
      const cy = height / 2;
      const outerR = Math.min(width, height) / 2 - strokeWidth;
      const innerR = outerR * 0.5;
      const points: string[] = [];
      for (let i = 0; i < 16; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 8 - Math.PI / 2;
        points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <polygon
            points={points.join(' ')}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'badge12': {
      const cx = width / 2;
      const cy = height / 2;
      const outerR = Math.min(width, height) / 2 - strokeWidth;
      const innerR = outerR * 0.82;
      const points: string[] = [];
      for (let i = 0; i < 24; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 12;
        points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <polygon
            points={points.join(' ')}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'speech_bubble':
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <path
            d={`
              M ${borderRadius} 0
              H ${width - borderRadius}
              A ${borderRadius} ${borderRadius} 0 0 1 ${width} ${borderRadius}
              V ${height - 40 - borderRadius}
              A ${borderRadius} ${borderRadius} 0 0 1 ${width - borderRadius} ${height - 40}
              H 60
              L 30 ${height - strokeWidth}
              L 40 ${height - 40}
              H ${borderRadius}
              A ${borderRadius} ${borderRadius} 0 0 1 0 ${height - 40 - borderRadius}
              V ${borderRadius}
              A ${borderRadius} ${borderRadius} 0 0 1 ${borderRadius} 0
              Z
            `}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'polaroid_card': {
      const pad = Math.max(16, width * 0.08);
      const photoH = width - pad * 2;
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <rect
            x={strokeWidth / 2}
            y={strokeWidth / 2}
            width={width - strokeWidth}
            height={height - strokeWidth}
            rx={borderRadius || 6}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
          />
          {/* Inner cutout guideline or subtle inset */}
          <rect
            x={pad}
            y={pad}
            width={width - pad * 2}
            height={photoH}
            fill="#f1f5f9"
            opacity={0.35}
            stroke="#cbd5e1"
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        </svg>
      );
    }

    case 'ribbon': {
      const cut = 24;
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <polygon
            points={`0,0 ${width},0 ${width - cut},${height / 2} ${width},${height} 0,${height} ${cut},${height / 2}`}
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'quote_mark':
      return (
        <svg width="100%" height="100%" viewBox="0 0 100 80">
          <path
            d="M 28 0 C 12.5 0 0 12.5 0 28 C 0 35 3 41 8 45 C 5 52 2 62 0 80 L 16 80 C 22 55 28 42 34 38 C 38 35 40 31 40 28 C 40 12.5 28 0 28 0 Z
               M 78 0 C 62.5 0 50 12.5 50 28 C 50 35 53 41 58 45 C 55 52 52 62 50 80 L 66 80 C 72 55 78 42 84 38 C 88 35 90 31 90 28 C 90 12.5 78 0 78 0 Z"
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
          />
        </svg>
      );

    case 'blob':
      return (
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <path
            d="M 40 100 C 30 50 70 20 120 30 C 170 40 190 80 180 130 C 170 180 120 190 70 180 C 20 170 50 150 40 100 Z"
            fill={fillColor}
            stroke={strokeWidth > 0 ? strokeColor : 'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'divider_solid':
      return (
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: fillColor, opacity: layer.opacity }}
        />
      );

    case 'divider_dashed':
      return (
        <div
          className="w-full h-full flex items-center"
        >
          <div
            className="w-full border-t"
            style={{
              borderColor: strokeColor || fillColor,
              borderTopWidth: strokeWidth || 2,
              borderTopStyle: strokeStyle === 'dotted' ? 'dotted' : 'dashed',
            }}
          />
        </div>
      );

    case 'divider_wave':
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <path
            d={`M 0 ${height / 2} Q ${width * 0.25} 0 ${width * 0.5} ${height / 2} T ${width} ${height / 2}`}
            fill="none"
            stroke={strokeColor || fillColor}
            strokeWidth={strokeWidth || 3}
            strokeLinecap="round"
          />
        </svg>
      );

    case 'corner_frame': {
      const arm = Math.min(width, height) * 0.2;
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          {/* Top-Left */}
          <path d={`M 0 ${arm} V 0 H ${arm}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Top-Right */}
          <path d={`M ${width - arm} 0 H ${width} V ${arm}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Bottom-Right */}
          <path d={`M ${width} ${height - arm} V ${height} H ${width - arm}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Bottom-Left */}
          <path d={`M ${arm} ${height} H 0 V ${height - arm}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    }

    default:
      return <div className="w-full h-full" style={{ backgroundColor: fillColor }} />;
  }
};
