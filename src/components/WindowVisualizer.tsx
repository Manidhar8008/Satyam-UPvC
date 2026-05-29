import React from 'react';
import { motion } from 'motion/react';
import { TrackType, ColorLamination, GlazingType, ConfigState } from '../types';

interface Props {
  config: ConfigState;
}

export const colorLaminationMap: Record<ColorLamination, string> = {
  'Pristine White': '#FFFFFF',
  'Golden Oak': '#d49653',
  'Dark Oak': '#362211',
  'Mahogany': '#4A2511',
  'Walnut': '#5C4033',
  'Matte Charcoal Grey': '#36454F',
  'Midnight Black': '#1A1A1A',
  'Alux Silver': '#C0C0C0',
  'Pyrite Gold': '#D4AF37',
  'Inside White / Outside Quartz Printing': '#f1f5f9'
};

// High-Definition Multi-Stop Gradients for Authentic Extrusion Shading
const laminationGradientMap: Record<ColorLamination, string[]> = {
  'Pristine White': ['#FFFFFF', '#F8FAFC', '#E2E8F0', '#F1F5F9'],
  'Golden Oak': ['#EAA96E', '#d49653', '#A05A2C', '#783E16'],
  'Dark Oak': ['#523A28', '#362211', '#211308', '#150A03'],
  'Mahogany': ['#6E381D', '#4A2511', '#301609', '#1F0C04'],
  'Walnut': ['#7A5C4C', '#5C4033', '#3D2A21', '#241914'],
  'Matte Charcoal Grey': ['#52616B', '#36454F', '#243139', '#1C242B'],
  'Midnight Black': ['#2A2A2A', '#1A1A1A', '#111111', '#080808'],
  'Alux Silver': ['#E2E8F0', '#C0C0C0', '#94A3B8', '#788291'],
  'Pyrite Gold': ['#F4D068', '#D4AF37', '#A6821E', '#7D5F10'],
  'Inside White / Outside Quartz Printing': ['#FFFFFF', '#E2E8F0', '#475569', '#334155']
};

export function WindowVisualizer({ config }: Props) {
  const { width, height, trackType: type, glazing, color, addMesh } = config;
  const hexColor = colorLaminationMap[color] || '#ffffff';
  const profileGradients = laminationGradientMap[color] || ['#ffffff', '#cbd5e1', '#94a3b8', '#cbd5e1'];
  
  const maxWidth = 340;
  const maxHeight = 440;
  
  const scaleW = maxWidth / Math.max(width, 1);
  const scaleH = maxHeight / Math.max(height, 1);
  const scale = Math.min(scaleW, scaleH);
  
  const w = width * scale;
  const h = height * scale;
  
  // Real-world scale representation of profile depths (74mm framework)
  const outerFrameThick = Math.max(14, 24 * scale);
  const sashFrameThick = Math.max(10, 18 * scale);
  
  let numPanes = 2;
  if (type === '3-track-mesh' || type === 'slide_fold') numPanes = 3;
  if (type.includes('casement') || type === 'hinged_door' || type === 'tilt_turn' || type === 'louvers') numPanes = 1;
  
  const paneWidth = (w - (outerFrameThick * 2)) / numPanes;

  // Glass performance tints mapping
  const glassFill = glazing === 'single' ? 'url(#single-glass-grad)' : 'url(#double-glass-grad)';
  const glassBorder = color === 'Pristine White' ? '#94a3b8' : '#0f172a';

  return (
    <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center relative p-6 bg-slate-950/20 rounded-2xl border border-slate-200/50 backdrop-blur-sm shadow-inner">
      <span className="absolute top-4 font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shadow-sm tracking-widest">{width} MM</span>
      <span className="absolute left-4 top-1/2 -rotate-90 origin-left translate-x-4 -translate-y-4 font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shadow-sm tracking-widest">{height} MM</span>

      <motion.svg 
        layout
        width={w + 40} 
        height={h + 40} 
        className="overflow-visible"
        viewBox={`-20 -20 ${w + 40} ${h + 40}`}
      >
        <defs>
          {/* Advanced Dynamic 3D Profile Extrusion Shading Shader */}
          <linearGradient id="profile-3d-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={profileGradients[0]} />
            <stop offset="25%" stopColor={profileGradients[1]} />
            <stop offset="75%" stopColor={profileGradients[2]} />
            <stop offset="100%" stopColor={profileGradients[3]} />
          </linearGradient>

          {/* Premium Glass Glare & Specular Reflection Shader Maps */}
          <linearGradient id="single-glass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="double-glass-grad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
            <stop offset="30%" stopColor="#bae6fd" stopOpacity="0.15" />
            <stop offset="70%" stopColor="#f1f5f9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
          </linearGradient>

          <pattern id="premium-mesh" width="5" height="5" patternUnits="userSpaceOnUse">
            <rect width="5" height="5" fill="rgba(15, 23, 42, 0.05)" />
            <path d="M 5 0 L 0 5 M 0 0 L 5 5" fill="none" stroke="#475569" strokeWidth="0.4" opacity="0.4"/>
          </pattern>

          {/* Realistic Architectural Shading Filter */}
          <filter id="profile-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. MASTER OUTER FRAME PROFILE LAYER */}
        <g filter="url(#profile-shadow)">
          {/* Main Frame Outer Box */}
          <rect x={0} y={0} width={w} height={h} fill="none" stroke="url(#profile-3d-grad)" strokeWidth={outerFrameThick} strokeLinejoin="miter" />
          
          {/* Clean Engineering Inner EPDM Rubber Gasket Profile Accent */}
          <rect x={outerFrameThick/2} y={outerFrameThick/2} width={w - outerFrameThick} height={h - outerFrameThick} fill="none" stroke="#334155" strokeWidth="1" opacity="0.7" />

          {/* 45-Degree Miter Joint Weld Lines */}
          <line x1={0} y1={0} x2={outerFrameThick} y2={outerFrameThick} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
          <line x1={w} y1={0} x2={w - outerFrameThick} y2={outerFrameThick} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
          <line x1={0} y1={h} x2={outerFrameThick} y2={h - outerFrameThick} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
          <line x1={w} y1={h} x2={w - outerFrameThick} y2={h - outerFrameThick} stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        </g>

        {/* 2. DYNAMIC SHUTTER SASH AND INFILL PANELS GRAPHING */}
        <g transform={`translate(${outerFrameThick}, ${outerFrameThick})`}>
          {Array.from({ length: numPanes }).map((_, i) => {
            const paneX = i * paneWidth;
            const paneH = h - (outerFrameThick * 2);
            
            return (
              <g key={`pane-group-${i}`}>
                {/* Individual Extruded Moving Shutter Sash Outlines */}
                <motion.rect
                  layout
                  x={paneX + 2}
                  y={2}
                  width={paneWidth - 4}
                  height={paneH - 4}
                  fill={type === '3-track-mesh' && i === 2 ? 'url(#premium-mesh)' : glassFill}
                  stroke="url(#profile-3d-grad)"
                  strokeWidth={sashFrameThick}
                  strokeLinejoin="miter"
                />

                {/* Inner Glazing Bead Definition Trace Line */}
                <rect 
                  x={paneX + 2 + sashFrameThick/2} 
                  y={2 + sashFrameThick/2} 
                  width={paneWidth - 4 - sashFrameThick} 
                  height={paneH - 4 - sashFrameThick} 
                  fill="none" 
                  stroke={glassBorder} 
                  strokeWidth="1" 
                  opacity="0.5" 
                />

                {/* Insulated Glazing Flare Accent Marks for Double Glazing */}
                {glazing === 'double' && !(type === '3-track-mesh' && i === 2) && (
                  <>
                    <line
                      x1={paneX + paneWidth * 0.75}
                      y1={paneH * 0.2}
                      x2={paneX + paneWidth * 0.45}
                      y2={paneH * 0.8}
                      stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1={paneX + paneWidth * 0.82}
                      y1={paneH * 0.25}
                      x2={paneX + paneWidth * 0.65}
                      y2={paneH * 0.65}
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Precision Hardware: Premium Metallic Lock/Touch Handle Assembly */}
                {!(type === '3-track-mesh' && i === 2) && type !== 'louvers' && (
                  <g transform={`translate(${paneX + (i === 0 ? paneWidth - sashFrameThick - 8 : sashFrameThick + 4)}, ${paneH / 2 - 15})`}>
                    {/* Handle Escutcheon Plate */}
                    <rect x="0" y="0" width="4" height="30" rx="1" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />
                    {/* Ergonomic Lever Pull */}
                    <path d="M 2 8 L 8 8 L 8 22 L 2 22" fill="none" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Optional Intermittent Screen Mesh Overlay For Custom Flags */}
          {addMesh && type !== '3-track-mesh' && (
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              x={2}
              y={2}
              width={paneWidth - 4}
              height={h - (outerFrameThick * 2) - 4}
              fill="url(#premium-mesh)"
              stroke="url(#profile-3d-grad)"
              strokeWidth={sashFrameThick}
            />
          )}

          {/* 3. DYNAMIC TRANSOM SEPARATOR RAIL (Calculated Integrity Intervention) */}
          {height > 2200 && (
            <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }}>
              {/* Transom Profile Block (DP-757 Split) */}
              <rect 
                x={0} 
                y={60 * scale} 
                width={w - (outerFrameThick * 2)} 
                height={outerFrameThick} 
                fill="url(#profile-3d-grad)" 
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="1"
              />
              {/* Inner Transom Steel Reinforcement Alignment Guideline */}
              <line 
                x1={0} 
                y1={(60 * scale) + (outerFrameThick / 2)} 
                x2={w - (outerFrameThick * 2)} 
                y2={(60 * scale) + (outerFrameThick / 2)} 
                stroke="rgba(255,255,255,0.2)" 
                strokeWidth="1" 
                strokeDasharray="2,4" 
              />
            </motion.g>
          )}
        </g>
      </motion.svg>
    </div>
  );
}
