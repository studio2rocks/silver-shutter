export interface PhotoEntry {
  id: string;
  rollId: string;
  frameNumber: number;
  timestamp: string; // ISO string
  camera: string;
  lens: string;
  focalLength?: string;
  mediaType: 'film' | 'digital' | 'instant';
  filmStock: string;
  boxIso: number;
  ratedIso: number;
  shutterSpeed: string;
  aperture: string;
  exposureCompensation?: string;
  meteringMode?: 'center-weighted' | 'spot' | 'evaluative' | 'incident' | 'sunny-16' | 'manual-guess';
  filterUsed?: string;
  location?: string;
  notes: string;
  imageUrl?: string;
  rating?: number;
  isFavorite?: boolean;
}

export interface RollSession {
  id: string;
  name: string;
  camera: string;
  filmStock: string;
  boxIso: number;
  ratedIso: number;
  format: '35mm-36' | '35mm-24' | '120-6x6' | '120-6x7' | '120-645' | '4x5-sheet' | 'digital';
  totalFrames: number;
  status: 'in_camera' | 'completed' | 'sent_to_lab' | 'developed';
  startDate: string;
  completedDate?: string;
  notes?: string;
}

export interface CameraGear {
  id: string;
  name: string;
  type: '35mm Rangefinder' | '35mm SLR' | '120 Medium Format' | '4x5 Large Format' | 'Digital Mirrorless' | 'Point & Shoot' | 'Other';
  mount: string;
  defaultLens?: string;
  serialNumber?: string;
  year?: string;
  notes?: string;
  isFavorite?: boolean;
}

export interface LensGear {
  id: string;
  name: string;
  mount: string;
  focalLength: string;
  maxAperture: string;
  filterSize?: string;
  notes?: string;
  isFavorite?: boolean;
}

export const COMMON_CAMERA_TYPES = [
  '35mm Rangefinder',
  '35mm SLR',
  '120 Medium Format',
  '4x5 Large Format',
  'Digital Mirrorless',
  'Point & Shoot',
  'Other'
] as const;

export const COMMON_MOUNTS = [
  'Leica M',
  'Leica Thread Mount (L39/M39)',
  'Hasselblad V',
  'Canon FD / FL',
  'Canon EF',
  'Nikon F',
  'Nikon Z',
  'Pentax K',
  'Pentax 67',
  'Mamiya RB/RZ',
  'Olympus OM',
  'M42 Screw Mount',
  'Sony E',
  'Fujifilm X',
  'Fixed Lens'
];

export const COMMON_CAMERAS = [
  'Leica M3',
  'Leica M6',
  'Hasselblad 500 C/M',
  'Canon AE-1',
  'Canon AE-1 Program',
  'Nikon FM2',
  'Nikon F3',
  'Pentax K1000',
  'Pentax 67',
  'Olympus OM-1',
  'Mamiya RB67',
  'Contax T2',
  'Ricoh GR IIIx',
  'Fujifilm X100V',
  'Sony A7 IV',
  'Custom Camera...'
];

export const COMMON_LENSES = [
  'Leica Summicron 50mm f/2',
  'Leica Summicron 35mm f/2 ASPH',
  'Zeiss Planar 80mm f/2.8 C T*',
  'Canon FD 50mm f/1.8 S.C.',
  'Canon FD 35mm f/2.0',
  'Nikkor 50mm f/1.4 AI-s',
  'Nikkor 28mm f/2.8 AI-s',
  'SMC Pentax-M 50mm f/1.7',
  'Mamiya Sekor C 90mm f/3.8',
  'Olympus Zuiko 50mm f/1.4',
  'Ricoh GR 40mm equiv f/2.8',
  'Fujinon 23mm f/2',
  'Sony FE 35mm f/1.4 GM',
  'Custom Lens...'
];

export const COMMON_FILM_STOCKS = [
  { name: 'Kodak Portra 400', defaultIso: 400, type: 'Color Negative' },
  { name: 'Kodak Portra 160', defaultIso: 160, type: 'Color Negative' },
  { name: 'Kodak Portra 800', defaultIso: 800, type: 'Color Negative' },
  { name: 'Kodak Tri-X 400', defaultIso: 400, type: 'Black & White' },
  { name: 'Kodak Gold 200', defaultIso: 200, type: 'Color Negative' },
  { name: 'Kodak Ektar 100', defaultIso: 100, type: 'Color Negative' },
  { name: 'Kodak ColorPlus 200', defaultIso: 200, type: 'Color Negative' },
  { name: 'Ilford HP5 Plus 400', defaultIso: 400, type: 'Black & White' },
  { name: 'Ilford FP4 Plus 125', defaultIso: 125, type: 'Black & White' },
  { name: 'Ilford Delta 3200', defaultIso: 3200, type: 'Black & White' },
  { name: 'CineStill 800T', defaultIso: 800, type: 'Color Negative (Tungsten)' },
  { name: 'CineStill 400D', defaultIso: 400, type: 'Color Negative (Daylight)' },
  { name: 'Fujifilm Superia 400', defaultIso: 400, type: 'Color Negative' },
  { name: 'Fujifilm Velvia 50', defaultIso: 50, type: 'Slide / Positive' },
  { name: 'Fomapan 400 Action', defaultIso: 400, type: 'Black & White' },
  { name: 'Fomapan 100 Classic', defaultIso: 100, type: 'Black & White' },
  { name: 'Kentmere Pan 400', defaultIso: 400, type: 'Black & White' },
  { name: 'Digital (RAW Sensor)', defaultIso: 100, type: 'Digital' }
];

export const SHUTTER_SPEEDS = [
  'Bulb',
  '10s',
  '4s',
  '2s',
  '1s',
  '1/2s',
  '1/4s',
  '1/8s',
  '1/15s',
  '1/30s',
  '1/60s',
  '1/125s',
  '1/250s',
  '1/500s',
  '1/1000s',
  '1/2000s',
  '1/4000s',
  '1/8000s'
];

export const APERTURES = [
  'f/1.0',
  'f/1.2',
  'f/1.4',
  'f/1.8',
  'f/2.0',
  'f/2.8',
  'f/3.5',
  'f/4.0',
  'f/5.6',
  'f/8.0',
  'f/11',
  'f/16',
  'f/22',
  'f/32'
];

export const ISO_VALUES = [
  25, 50, 64, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 3200, 6400, 12800
];

export const FORMAT_DETAILS: Record<RollSession['format'], { label: string; frames: number }> = {
  '35mm-36': { label: '35mm (36 exp)', frames: 36 },
  '35mm-24': { label: '35mm (24 exp)', frames: 24 },
  '120-6x6': { label: '120 Medium (6x6 - 12 exp)', frames: 12 },
  '120-6x7': { label: '120 Medium (6x7 - 10 exp)', frames: 10 },
  '120-645': { label: '120 Medium (645 - 16 exp)', frames: 16 },
  '4x5-sheet': { label: '4x5 Large Format Sheet', frames: 1 },
  'digital': { label: 'Digital Session', frames: 999 }
};
