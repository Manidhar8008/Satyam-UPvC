import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Move, Maximize2, Eye, RefreshCw, AlertTriangle } from 'lucide-react';
import { ConfigState } from '../types';
import { WindowVisualizer } from './WindowVisualizer';

interface Props {
  config: ConfigState;
  onClose: () => void;
}

export function ARPortal({ config, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Position, calibration, and transparency modifier states
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scaleMultiplier, setScaleMultiplier] = useState(1.0);
  const [translucency, setTranslucency] = useState(100);

  // Touch drag state refs
  const dragRef = useRef(false);
  const lastTouchRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    async function launchEnvironmentalCamera() {
      try {
        setCameraError(null);
        
        const constraints: MediaStreamConstraints = {
          video: { facingMode: "environment" },
          audio: false
        };

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (initialError) {
          console.warn("Primary camera access failed, falling back to default.", initialError);
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        
        localStreamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err: any) {
        console.error("Satyam AR Camera Initializer Trace Failed: ", err);
        const errorMsg = err?.message || err?.name || "Unknown error";
        setCameraError(`Camera initialization failed: ${errorMsg}. Please verify permissions or hardware connection.`);
        setStreamActive(false);
      }
    }

    launchEnvironmentalCamera();

    // Critical Teardown Cleanup Loop: Releases the camera sensor immediately to prevent ghost resource locks
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Hardware track allocation [${track.label}] cleanly terminated.`);
        });
        localStreamRef.current = null;
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = true;
    lastTouchRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - lastTouchRef.current.x;
    const dy = e.clientY - lastTouchRef.current.y;
    setOffsetX(prev => prev + dx);
    setOffsetY(prev => prev + dy);
    lastTouchRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    dragRef.current = false;
  };

  const resetAlignment = () => {
    setOffsetX(0);
    setOffsetY(0);
    setScaleMultiplier(1.0);
    setTranslucency(100);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden font-sans"
    >
      {/* FULLSCREEN CAM FEED CONTAINER OVERLAY VIEWPORT */}
      <div className="absolute inset-0 w-full h-full bg-black z-0">
        {cameraError && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center p-6 z-30 max-w-sm w-full">
            <div className="bg-rose-950/80 border border-rose-500/50 p-6 rounded-2xl backdrop-blur-md shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-rose-400 mb-2 font-display">Camera Offline</p>
              <p className="text-sm text-rose-200/70 font-mono tracking-tight">{cameraError}</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover absolute inset-0 z-10"
        />

        {/* POINTER HANDLER OVERLAY & SPATIAL PLACEMENT MATRIX LAYER */}
        <div 
          className="absolute inset-0 z-20 touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {streamActive && (
            <div 
              className="absolute top-1/2 left-1/2 pointer-events-none transition-opacity duration-150"
              style={{
                width: '380px',
                height: '480px',
                opacity: translucency / 100,
                transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scaleMultiplier})`
              }}
            >
              <WindowVisualizer config={config} />
            </div>
          )}
        </div>
      </div>

      {/* FLOATING HUD INTERACTION PANEL HEADER */}
      <div className="relative z-30 p-4 sm:p-6 bg-gradient-to-b from-slate-950/80 to-transparent flex items-start justify-between backdrop-blur-[2px] pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-white font-semibold text-lg tracking-tight">On-Site Environmental Mask Portal</h2>
          <p className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mt-1">Satyam Spatial System v2</p>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all shadow-md backdrop-blur-md border border-white/10 pointer-events-auto"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* FLOATING HUD INTERACTION PANEL BOTTOM CALIBRATION TRAY */}
      <div className="relative z-30 p-6 bg-slate-900/90 border-t border-slate-800/80 backdrop-blur-xl max-w-4xl mx-auto w-full sm:rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        
        {/* DEBUG & RESET TRAY */}
        <div className="flex flex-wrap justify-end items-center gap-4 mb-6 border-b border-slate-700/50 pb-4">
           <button 
             onClick={resetAlignment}
             className="flex items-center gap-2 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
           >
             <RefreshCw className="w-4 h-4" />
             Reset Frame Alignment
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Axis Offset Control Deck */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <Move className="w-3.5 h-3.5 text-sky-400" /> Positional Alignment Vector
            </span>
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="range" min="-400" max="400" step="1" value={offsetX} 
                  onChange={(e) => setOffsetX(parseInt(e.target.value))} 
                  className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg appearance-none"
                />
                <div className="text-[10px] text-center font-mono text-slate-500 mt-2">X-AXIS: {offsetX}px</div>
              </div>
              <div className="flex-1">
                <input 
                  type="range" min="-400" max="400" step="1" value={offsetY} 
                  onChange={(e) => setOffsetY(parseInt(e.target.value))} 
                  className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg appearance-none"
                />
                <div className="text-[10px] text-center font-mono text-slate-500 mt-2">Y-AXIS: {offsetY}px</div>
              </div>
            </div>
          </div>

          {/* Scale Multiplier Slider */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" /> Vector Multiplier Scale
            </span>
            <input 
              type="range" min="0.4" max="2.0" step="0.05" value={scaleMultiplier} 
              onChange={(e) => setScaleMultiplier(parseFloat(e.target.value))} 
              className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg appearance-none"
            />
            <div className="text-[10px] text-right font-mono text-slate-500">DIMENSION FACTOR: {scaleMultiplier.toFixed(2)}x</div>
          </div>

          {/* Opacity/Material Translucency Slider */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-sky-400" /> Material Translucency
            </span>
            <input 
              type="range" min="10" max="100" step="5" value={translucency} 
              onChange={(e) => setTranslucency(parseInt(e.target.value))} 
              className="w-full accent-sky-400 bg-slate-800 h-1.5 rounded-lg appearance-none"
            />
            <div className="text-[10px] text-right font-mono text-slate-500">DENSITY VALUE: {translucency}%</div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
