import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import UPNG from 'upng-js';
import { CropBox, Settings } from '../types';

export async function cropToTransparentPng(sourceUri: string, crop: CropBox, settings: Settings) {
  const pad = settings.padding;
  const originX = Math.max(0, Math.round(crop.x - pad));
  const originY = Math.max(0, Math.round(crop.y - pad));
  const width = Math.max(1, Math.round(crop.width + pad * 2));
  const height = Math.max(1, Math.round(crop.height + pad * 2));
  const result = await ImageManipulator.manipulateAsync(sourceUri, [{ crop: { originX, originY, width, height } }], { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true });
  if (!result.base64) return { uri: result.uri, width: result.width, height: result.height };
  try {
    const decoded = UPNG.decode(Buffer.from(result.base64, 'base64'));
    const rgba = new Uint8Array(UPNG.toRGBA8(decoded)[0]);
    for (let i = 0; i < rgba.length; i += 4) {
      if (rgba[i] <= settings.blackThreshold && rgba[i+1] <= settings.blackThreshold && rgba[i+2] <= settings.blackThreshold) rgba[i+3] = 0;
      else if (settings.feather && rgba[i] < settings.blackThreshold + 12 && rgba[i+1] < settings.blackThreshold + 12 && rgba[i+2] < settings.blackThreshold + 12) rgba[i+3] = Math.min(rgba[i+3], 180);
    }
    const png = Buffer.from(UPNG.encode([rgba.buffer], result.width, result.height, 0)).toString('base64');
    await FileSystem.writeAsStringAsync(result.uri, png, { encoding: FileSystem.EncodingType.Base64 });
  } catch {
    // Fallback: keep the cropped PNG if JS PNG decoding fails on a device/runtime.
  }
  return { uri: result.uri, width: result.width, height: result.height };
}
