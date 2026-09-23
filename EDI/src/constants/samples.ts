import { BoundingBox, DetectionClass } from '../models/detection';

export interface SamplePlantImage {
  id: string;
  name: string;
  category: 'weed_clear' | 'healthy_crop' | 'ambiguous_weed';
  description: string;
  imageUri: string;
  expectedClass: DetectionClass;
  expectedConfidence: number;
  expectedBoundingBox?: BoundingBox;
  notes: string;
}

export const SAMPLE_IMAGES: SamplePlantImage[] = [
  {
    id: 'sample-1',
    name: 'Tomato Field with Broadleaf Weed',
    category: 'weed_clear',
    description: 'Field crop with an invasive broadleaf weed nestled between rows.',
    imageUri: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?auto=format&fit=crop&w=800&q=80',
    expectedClass: 'weed',
    expectedConfidence: 0.91,
    expectedBoundingBox: {
      x: 0.32,
      y: 0.28,
      width: 0.28,
      height: 0.34,
      label: 'Weed (91%)',
      confidence: 0.91,
    },
    notes: 'Invasive broadleaf weed localized. Micro-spray required.',
  },
  {
    id: 'sample-2',
    name: 'Healthy Organic Lettuce Crop',
    category: 'healthy_crop',
    description: 'Vibrant clean furrow with uniform crop leaves and zero weed intrusion.',
    imageUri: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    expectedClass: 'healthy_crop',
    expectedConfidence: 0.95,
    notes: 'Healthy crop canopy identified. No herbicide application necessary.',
  },
  {
    id: 'sample-3',
    name: 'Young Seedling / Ambiguous Sprout',
    category: 'ambiguous_weed',
    description: 'Shaded early seedling with partial leaf overlap requiring verification.',
    imageUri: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    expectedClass: 'weed',
    expectedConfidence: 0.55,
    expectedBoundingBox: {
      x: 0.45,
      y: 0.38,
      width: 0.22,
      height: 0.25,
      label: 'Uncertain Weed (55%)',
      confidence: 0.55,
    },
    notes: 'Confidence below safety threshold. Farmer review recommended to preserve crop.',
  },
];
