import { TrackType, ProductFamily, ConfigState, GlazingType } from '../types';

export const calculateSFT = (width: number, height: number): number => {
  return (width * height) / 92903.04;
};

export const calculatePricing = (sft: number, type: TrackType, glazing: GlazingType) => {
  let baseRate = 0;
  
  if (type === '2-track') baseRate = 350;
  else if (type === '3-track-mesh') baseRate = 450;
  else if (type === 'casement_out' || type === 'casement_in') baseRate = 500;
  else if (type === 'hinged_door') baseRate = 570;
  else baseRate = 650; // Fallback for specialized Tilt/Fold/Aluminium

  // Apply +₹20/SFT premium robust constraint
  const glazingPremium = glazing === 'double' ? 45 : 0;
  const ratePerSft = baseRate + 20 + glazingPremium;

  return {
    baseRate,
    ratePerSft,
    totalEstimatedCost: Math.round(sft * ratePerSft),
  };
};

export const validateEngineering = (width: number, height: number, type: TrackType) => {
  const warnings: string[] = [];
  
  let numPanes = 2;
  const clearance = 74;

  if (type === '3-track-mesh' || type === 'slide_fold') numPanes = 3;
  if (type.includes('casement') || type === 'hinged_door' || type === 'tilt_turn' || type === 'louvers') numPanes = 1;

  const paneWidth = (width - clearance) / numPanes;

  if (paneWidth > 900 && (type === '2-track' || type === '3-track-mesh')) {
    warnings.push(`Sliding sash width (${Math.round(paneWidth)}mm) exceeds 900mm safe limit. Recommend structural Mullion split.`);
  }

  if (paneWidth > 750 && type.includes('casement')) {
    warnings.push(`Casement sash width (${Math.round(paneWidth)}mm) exceeds 750mm safe limit. Recommend structural Mullion split.`);
  }

  if (height > 2200) {
    warnings.push(`Frame height (${height}mm) surpasses load limit. Standard requires horizontal structural transom divide (DP-757/CWL-37) or inner galvanized iron reinforcement (1.2mm-2.5mm ST-701 steel bars) to prevent wind deflection and warp.`);
  }

  return {
    isStructurallySafe: warnings.length === 0,
    warnings,
    paneWidth: Math.round(paneWidth),
  };
};

export const getBomTokens = (config: ConfigState) => {
  const t: Record<string, string> = { 
    family: config.family, 
    track: config.trackType 
  };
  
  if (config.family === 'premium_upvc') {
    if (config.trackType.includes('track')) { t.frame = 'DP-701/DP-702'; t.sash = 'DP-703/DP-704'; t.interlock = 'DP-705/DP-706'; }
    else if (config.trackType.includes('casement')) { t.frame = 'DP-751'; t.mullion = 'DP-752'; t.sash = 'DP-756'; }
    else { t.frame = 'DP-Standard'; }
  } else if (config.family === 'luxury_doors') {
    t.frame = 'OPDF-7758'; t.mullion = 'DPDS-11037'; t.sash = 'DPDS-11537'; t.style = 'DP-601'; 
  } else if (config.family === 'wide_span_aluminum') {
    t.base = 'Aluminum High-Altitude Profile';
  }
  
  if (config.glazing === 'double') {
    t.beading = 'Double Bead (DP-507 / DP-755)';
  } else {
    t.beading = 'Single Bead (DP-707 / DP-754)';
  }
  
  if (config.addMesh) {
    t.mesh = 'Mosquito Screen Sash (DP-509/510 / SWL-10)';
  }

  return t;
};
