import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import { AppProject, Settings, ManifestAsset } from '../types';
import { cropToTransparentPng } from './imageProcessing';
import { filenameForCrop, snakeCase, sortReadingOrder } from './naming';

export async function exportProjectZip(project: AppProject, settings: Settings) {
  if (!project.sourceSheet) throw new Error('Import an asset sheet before exporting.');
  const zip = new JSZip(); const manifest: { assets: ManifestAsset[] } = { assets: [] };
  for (const crop of sortReadingOrder(project.crops).filter(c => c.name?.trim())) {
    const processed = await cropToTransparentPng(project.sourceSheet.uri, crop, settings);
    const base64 = await FileSystem.readAsStringAsync(processed.uri, { encoding: FileSystem.EncodingType.Base64 });
    const filename = filenameForCrop(crop); const path = `assets/${crop.category}/${filename}`;
    zip.file(path, base64, { base64: true });
    manifest.assets.push({ id: snakeCase(crop.name || ''), filename, path, category: crop.category, sourceSheet: project.sourceSheet.name, order: crop.order, width: processed.width, height: processed.height });
  }
  zip.file('asset_manifest.json', JSON.stringify(manifest, null, 2));
  const content = await zip.generateAsync({ type: 'base64' });
  const zipUri = `${FileSystem.cacheDirectory}assetchopper_export_${Date.now()}.zip`;
  await FileSystem.writeAsStringAsync(zipUri, content, { encoding: FileSystem.EncodingType.Base64 });
  return { zipUri, manifest };
}
