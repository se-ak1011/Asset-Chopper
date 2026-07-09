import { CropBox } from '../types';
export const snakeCase = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'unnamed_asset';
export const filenameForCrop = (crop: CropBox) => `${snakeCase(crop.name || `asset_${crop.order}`)}.png`;
export const findDuplicatePaths = (crops: CropBox[]) => {
  const seen = new Set<string>(); const duplicates = new Set<string>();
  crops.forEach(c => { const path = `${c.category}/${filenameForCrop(c)}`; if (seen.has(path)) duplicates.add(path); seen.add(path); });
  return [...duplicates];
};
export const sortReadingOrder = (crops: CropBox[]) => [...crops].sort((a,b) => Math.abs(a.y-b.y) > 24 ? a.y-b.y : a.x-b.x).map((c,i) => ({ ...c, order: i + 1 }));
