import React, { useState } from 'react';
import { ShoppingCart, LayoutTemplate, ScanFace, FileText, Download, CheckCircle2, ChevronRight, Fingerprint, Activity, DoorClosed, Factory, PlusCircle, Maximize, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ARPortal } from './components/ARPortal';
import { ProductFamily, TrackType, ConfigState, CartItem, GlazingType, ColorLamination } from './types';
import { calculateSFT, calculatePricing, getBomTokens, validateEngineering } from './lib/calculations';
import { WindowVisualizer, colorLaminationMap } from './components/WindowVisualizer';

export default function App() {
  const [showAR, setShowAR] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [currentConfig, setCurrentConfig] = useState<ConfigState>({
    family: 'premium_upvc',
    width: 1500,
    height: 2100,
    trackType: '2-track',
    glazing: 'single',
    color: 'Pristine White',
    addMesh: false
  });

  const handleAddToCart = () => {
    const sft = calculateSFT(currentConfig.width, currentConfig.height);
    const pricing = calculatePricing(sft, currentConfig.trackType, currentConfig.glazing);
    const bomTokens = getBomTokens(currentConfig);

    const newItem: CartItem = {
      id: Math.random().toString(36).substring(7),
      config: { ...currentConfig },
      sft,
      pricePerSft: pricing.ratePerSft,
      totalCost: pricing.totalEstimatedCost,
      bomTokens
    };
    setCart([...cart, newItem]);
  };

  const engineering = validateEngineering(currentConfig.width, currentConfig.height, currentConfig.trackType);
  const pricing = calculatePricing(calculateSFT(currentConfig.width, currentConfig.height), currentConfig.trackType, currentConfig.glazing);
  const totalSft = cart.reduce((acc, item) => acc + item.sft, 0);
  const grandTotal = cart.reduce((acc, item) => acc + item.totalCost, 0);

  const payload = {
    sys_verification: {
      timestamp: new Date().toISOString(),
      fabricatorIdentifier: "SATYAM_UPVC_BLR",
      qualityStandard: "BS EN 12608 Compliant uPVC Mix Blend"
    },
    quotationSummary: { itemCount: cart.length, totalAreaSft: Number(totalSft.toFixed(3)), currency: "INR", grandTotal },
    lineItemsData: cart.map((item, idx) => ({
      itemIndex: idx + 1,
      architectureCore: item.config.family,
      structuralLayout: item.config.trackType,
      measurements: { widthMm: item.config.width, heightMm: item.config.height, totalSft: item.sft },
      profileSpecificationTokens: { foilTexture: item.config.color, glazing: item.config.glazing, mesh: item.config.addMesh },
      commercials: { rateAppliedPerSft: item.pricePerSft, lineTotalINR: item.totalCost },
      bomDependencyTokens: item.bomTokens
    }))
  };

  return (
    <div className="h-screen bg-slate-50 font-sans selection:bg-slate-300 selection:text-slate-900 flex flex-col overflow-hidden">
      
      {/* 1. MASTER SELECTION CONTROL PANEL AND DASHBOARD WRAPPER */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden print:hidden">
        
        {/* Left Panel: Master Selection Controls */}
        <div className="xl:w-[420px] flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto flex flex-col custom-scrollbar">
          <div className="p-6 border-b border-slate-100 bg-slate-900 text-white sticky top-0 z-10">
             <div className="flex items-center gap-3 mb-2">
               <LayoutTemplate className="w-6 h-6 text-emerald-400" />
               <h1 className="font-display font-semibold tracking-tight text-xl">Satyam UPvC</h1>
             </div>
             <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Fabrication Workspace Matrix</p>
          </div>

          <div className="p-6 space-y-8">
            {/* Topic 1: Family Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">Architecture Core</h3>
              <div 
                onClick={() => setCurrentConfig({ ...currentConfig, family: 'premium_upvc', trackType: '2-track' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${currentConfig.family === 'premium_upvc' ? 'border-slate-900 bg-slate-50 shadow-md ring-1 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-3 mb-1"><LayoutTemplate className={`w-5 h-5 ${currentConfig.family === 'premium_upvc' ? 'text-slate-900' : 'text-slate-400'}`} /><h4 className="font-medium text-slate-900 text-sm">Premium uPVC Systems</h4></div>
                <p className="text-xs text-slate-500 pl-8">Duroplast Elite 67, Elegant 50, Astrix extrusions.</p>
              </div>

              <div 
                onClick={() => setCurrentConfig({ ...currentConfig, family: 'luxury_doors', trackType: 'indiana_panel' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${currentConfig.family === 'luxury_doors' ? 'border-slate-900 bg-slate-50 shadow-md ring-1 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-3 mb-1"><DoorClosed className={`w-5 h-5 ${currentConfig.family === 'luxury_doors' ? 'text-slate-900' : 'text-slate-400'}`} /><h4 className="font-medium text-slate-900 text-sm">Luxury Entrance Doors</h4></div>
                <p className="text-xs text-slate-500 pl-8">Indiana styles, ABS waterproof, Steel security.</p>
              </div>

              <div 
                onClick={() => setCurrentConfig({ ...currentConfig, family: 'wide_span_aluminum', trackType: 'aluminum_slider' })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${currentConfig.family === 'wide_span_aluminum' ? 'border-slate-900 bg-slate-50 shadow-md ring-1 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex items-center gap-3 mb-1"><Factory className={`w-5 h-5 ${currentConfig.family === 'wide_span_aluminum' ? 'text-slate-900' : 'text-slate-400'}`} /><h4 className="font-medium text-slate-900 text-sm">Wide-Span Aluminum</h4></div>
                <p className="text-xs text-slate-500 pl-8">PVDF Architectural spans and slim lines.</p>
              </div>
            </div>

            {/* Topic 2: Context Dropdowns */}
            <div className="space-y-4">
              <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Operation Topology</label>
              <select 
                value={currentConfig.trackType}
                onChange={(e) => setCurrentConfig({...currentConfig, trackType: e.target.value as TrackType})}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 text-sm outline-none focus:ring-2 focus:ring-slate-900"
              >
                {currentConfig.family === 'premium_upvc' && (
                  <>
                    <option value="2-track">2-Track Sliding System</option>
                    <option value="3-track-mesh">3-Track System (w/ Integrated Mesh)</option>
                    <option value="casement_out">Casement Out-Open</option>
                    <option value="casement_in">Casement Inside-Open</option>
                    <option value="tilt_turn">Premium Tilt & Turn</option>
                    <option value="slide_fold">Slide & Fold System</option>
                  </>
                )}
                {currentConfig.family === 'luxury_doors' && (
                  <>
                    <option value="indiana_panel">Indiana Panel Entry (DP-601/602)</option>
                    <option value="abs_honeycomb">ABS Honeycomb Partition</option>
                    <option value="gi_fire_safety">Galvanized Iron Fire Safety</option>
                  </>
                )}
                {currentConfig.family === 'wide_span_aluminum' && (
                  <>
                    <option value="aluminum_slider">Sleek Slim Frame Sliding</option>
                    <option value="aluminum_casement">PVDF/Anodized Casement</option>
                  </>
                )}
              </select>

              {currentConfig.family === 'premium_upvc' && ['2-track', 'casement_out', 'casement_in'].includes(currentConfig.trackType) && (
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox" checked={currentConfig.addMesh} onChange={(e) => setCurrentConfig({...currentConfig, addMesh: e.target.checked})} className="w-4 h-4 accent-slate-900" />
                  <span className="text-xs font-medium text-slate-700">Attach Mosquito Screen provision</span>
                </label>
              )}
            </div>

            {/* Glazing */}
            <div className="space-y-3">
              <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Glazing Insulation</label>
              <div className="grid grid-cols-2 gap-2">
                {(['single', 'double'] as GlazingType[]).map(g => (
                  <button key={g} onClick={() => setCurrentConfig({ ...currentConfig, glazing: g })} className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${currentConfig.glazing === g ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    {g === 'single' ? 'Single (4-6mm)' : 'Double (24mm)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-5 border-y border-slate-100 py-6">
              <div>
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="font-semibold tracking-wide uppercase text-slate-500">Width (mm)</span>
                  <span className="font-mono text-slate-900 font-bold">{currentConfig.width}</span>
                </div>
                <input type="range" min="400" max="4000" step="10" value={currentConfig.width} onChange={(e) => setCurrentConfig({...currentConfig, width: Number(e.target.value)})} className="w-full accent-slate-900" />
              </div>
              <div>
                <div className="flex justify-between items-center text-xs mb-3">
                  <span className="font-semibold tracking-wide uppercase text-slate-500">Height (mm)</span>
                  <span className="font-mono text-slate-900 font-bold">{currentConfig.height}</span>
                </div>
                <input type="range" min="400" max="3500" step="10" value={currentConfig.height} onChange={(e) => setCurrentConfig({...currentConfig, height: Number(e.target.value)})} className="w-full accent-slate-900" />
              </div>
            </div>

            {/* Lamination Foils */}
            <div className="space-y-4">
              <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">European Lamination Foil</label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.entries(colorLaminationMap) as [ColorLamination, string][]).map(([name, hex]) => (
                  <button key={name} title={name} onClick={() => setCurrentConfig({ ...currentConfig, color: name })} className={`w-full aspect-square rounded-full border-2 transition-all p-1 ${currentConfig.color === name ? 'border-slate-900 scale-110 shadow-sm' : 'border-slate-200'}`}>
                    <span className="w-full h-full rounded-full shadow-inner block" style={{ background: name === 'Inside White / Outside Quartz Printing' ? 'linear-gradient(135deg, #eee 50%, #888 50%)' : hex }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Geometric Truth Experience Canvas */}
        <div className="flex-1 bg-slate-50 p-4 sm:p-8 flex flex-col relative">
          <div className="bg-white border text-center font-display text-slate-900 py-3 uppercase tracking-widest text-xs font-bold w-full rounded-2xl shadow-sm border-slate-200 flex justify-between px-6 items-center flex-shrink-0 z-10 backdrop-blur-md">
            <span>Live Vector SVG Canvas</span>
            <span className="text-emerald-500 font-mono tracking-widest">REAL-TIME ACTIVE</span>
          </div>

          <div className="flex-1 flex items-center justify-center relative min-h-0 w-full overflow-hidden mt-4 bg-transparent">
             <WindowVisualizer config={currentConfig} />
          </div>

          <div className="w-full mt-auto flex flex-col items-center gap-4 pt-4 shrink-0">
             <AnimatePresence>
              {currentConfig.height > 2200 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="p-4 bg-slate-800 text-slate-300 rounded-2xl text-xs max-w-xl mx-auto shadow-md border border-slate-700 w-full">
                  <span className="text-emerald-400 font-bold block mb-1">Design Optimization</span>
                  Satyam UPvC incorporates heavy-duty interior steel bar reinforcements (ST-701) and specialized transom profile splits to ensure maximum structural stability against high wind loads.
                </motion.div>
              )}
             </AnimatePresence>
             <button onClick={() => setShowAR(true)} className="flex items-center justify-center gap-3 w-full max-w-xl bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 rounded-2xl shadow-xl transition-all">
               <ScanFace className="w-5 h-5" /> Launch Environmental Camera AR Portal
             </button>
          </div>
        </div>

        {/* Right Panel: Commercial Ledger */}
        <div className="xl:w-[450px] flex-shrink-0 bg-white border-l border-slate-200 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
             <h2 className="font-display font-medium flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Quotation Ledger</h2>
             <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">{cart.length} Items</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {cart.map((item, i) => (
                <motion.div key={item.id} layout initial={{opacity:0, y: 15}} animate={{opacity:1, y:0}} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-slate-900 text-sm tracking-tight">{item.config.family.replace('_',' ').toUpperCase()}</h4>
                    <span className="font-mono text-xs text-slate-400">#{(i+1).toString().padStart(2,'0')}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-3 space-y-1">
                    <p className="font-mono bg-slate-50 border border-slate-100 inline-block px-1.5 py-0.5 rounded text-[10px]">{item.config.width}W × {item.config.height}H mm</p>
                    <p>{item.config.trackType.replace('_',' ')} • {item.config.glazing} • {item.config.color}</p>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-slate-100">
                     <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{item.sft.toFixed(2)} SFT</div>
                     <div className="text-slate-900 font-mono font-medium">₹{item.totalCost.toLocaleString('en-IN')}</div>
                  </div>
                </motion.div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                  <Activity className="w-10 h-10 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-medium">No items formulated.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 bg-white border-t border-slate-200 shrink-0 space-y-4">
             <div className="flex justify-between text-sm mb-2 font-medium">
               <span className="text-slate-500">Active Valuation</span>
               <span className="font-mono text-slate-900">₹{pricing.totalEstimatedCost.toLocaleString('en-IN')}</span>
             </div>
             <button onClick={handleAddToCart} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2">
               <PlusCircle className="w-4 h-4"/> Add Custom Configuration to Quote
             </button>

             <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex justify-between items-end mt-4">
               <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Total Project Cost</span>
                  <div className="text-3xl font-display font-semibold text-emerald-900 tracking-tight mt-1">₹{grandTotal.toLocaleString('en-IN')}</div>
               </div>
               <span className="text-xs font-mono text-emerald-700/70">{totalSft.toFixed(2)} SFT</span>
             </div>

             <div className="flex gap-2 pt-2">
                <button onClick={() => window.print()} disabled={cart.length===0} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 text-xs font-bold tracking-wide uppercase py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2">
                  <FileText className="w-4 h-4"/> Print PDF
                </button>
                <button onClick={() => setShowExport(true)} disabled={cart.length===0} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-50 text-xs font-bold tracking-wide uppercase py-3.5 rounded-xl transition-all flex justify-center items-center gap-2">
                  <Download className="w-4 h-4"/> JSON Map
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* 2. PRINT-ONLY PROPOSAL PAGE (Corporate Headers) */}
      <div className="hidden print:block font-sans text-slate-900 p-8 max-w-4xl mx-auto w-full">
         <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
           <div>
             <h1 className="text-4xl font-display font-bold tracking-tight">Satyam UPvC</h1>
             <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase mt-2">Fabrication Workspace Matrix Proposal</p>
           </div>
           <div className="text-right text-sm">
             <p className="font-mono">DATE: {new Date().toLocaleDateString()}</p>
             <p className="text-slate-500 uppercase tracking-widest font-bold mt-1">Quotation ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
           </div>
         </div>
         
         <div className="space-y-6">
           <table className="w-full text-left text-sm border-collapse">
             <thead>
               <tr className="border-b border-slate-300">
                 <th className="py-3 font-semibold uppercase tracking-widest text-[10px]">Item</th>
                 <th className="py-3 font-semibold uppercase tracking-widest text-[10px]">Dimensions & Topology</th>
                 <th className="py-3 font-semibold uppercase tracking-widest text-[10px] text-right">Area</th>
                 <th className="py-3 font-semibold uppercase tracking-widest text-[10px] text-right">Value</th>
               </tr>
             </thead>
             <tbody>
                {cart.map((item, i) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-4 align-top font-mono text-xs">{(i+1).toString().padStart(2,'0')}</td>
                    <td className="py-4">
                      <div className="font-bold text-sm">{item.config.family.replace('_',' ').toUpperCase()}</div>
                      <div className="text-xs text-slate-600 mt-1">{item.config.width} W × {item.config.height} H (mm)</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.config.trackType.replace('_',' ')} | {item.config.color} | {item.config.glazing}</div>
                    </td>
                    <td className="py-4 align-top text-right font-mono text-xs">{item.sft.toFixed(2)} SFT</td>
                    <td className="py-4 align-top text-right font-bold text-sm">₹{item.totalCost.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
             </tbody>
           </table>

           <div className="flex justify-end pt-4">
             <div className="w-64">
               <div className="flex justify-between items-center mb-2 font-bold text-xl">
                 <span>Grand Total:</span>
                 <span>₹{grandTotal.toLocaleString('en-IN')}</span>
               </div>
               <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                 <span>Total Net Area:</span>
                 <span>{totalSft.toFixed(2)} SFT</span>
               </div>
             </div>
           </div>

           <div className="mt-16 pt-8 border-t border-slate-200">
              <h4 className="font-bold text-sm uppercase tracking-widest mb-3">Certified Quality Disclosures</h4>
              <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                <li>Profiles extruded conforming to BS EN 12608 standard architectural mix.</li>
                <li>1600-hour tropical weathering test completed with zero discoloration.</li>
                <li>Strategic pricing rules applied: +₹20/SFT base buffer, +₹45/SFT double acoustic glazing block.</li>
              </ul>
           </div>
         </div>
      </div>

      {/* JSON Payload Export Modal */}
      <AnimatePresence>
        {showExport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowExport(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-[#0a0d14] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 max-h-[90vh] flex flex-col">
              <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Download className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-display text-base">Schema Export: Quotation Ledger</h3>
                    <p className="text-emerald-400 text-[10px] font-mono mt-1 uppercase tracking-widest">Validated JSON Payload</p>
                  </div>
                </div>
                <button onClick={() => setShowExport(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                <pre className="text-emerald-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{JSON.stringify(payload, null, 2)}</pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AR Portal Modal */}
      <AnimatePresence>
        {showAR && <ARPortal config={currentConfig} onClose={() => setShowAR(false)} />}
      </AnimatePresence>
      
    </div>
  );
}

