export type ProductFamily = 
  | 'premium_upvc' 
  | 'luxury_doors' 
  | 'wide_span_aluminum';

export type TrackType = 
  | '2-track' 
  | '3-track-mesh' 
  | 'casement_out' 
  | 'casement_in'
  | 'tilt_turn' 
  | 'slide_fold'
  | 'indiana_panel'
  | 'abs_honeycomb'
  | 'gi_fire_safety'
  | 'aluminum_slider'
  | 'aluminum_casement'
  | 'hinged_door' 
  | 'louvers';

export type GlazingType = 'single' | 'double';

export type ColorLamination = 
  | 'Pristine White' 
  | 'Golden Oak' 
  | 'Dark Oak' 
  | 'Mahogany' 
  | 'Walnut' 
  | 'Matte Charcoal Grey' 
  | 'Midnight Black' 
  | 'Alux Silver' 
  | 'Pyrite Gold' 
  | 'Inside White / Outside Quartz Printing';

export interface ConfigState {
  family: ProductFamily;
  width: number;
  height: number;
  trackType: TrackType;
  glazing: GlazingType;
  color: ColorLamination;
  addMesh: boolean;
}

export interface CartItem {
  id: string;
  config: ConfigState;
  sft: number;
  pricePerSft: number;
  totalCost: number;
  bomTokens: Record<string, string>;
}
