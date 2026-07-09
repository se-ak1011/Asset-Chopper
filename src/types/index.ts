export type AppScreen = 'home' | 'import' | 'editor' | 'assets' | 'export' | 'settings';
export type CropBox = { id: string; order: number; x: number; y: number; width: number; height: number; name?: string; category: string; selected?: boolean };
export type SourceSheet = { uri: string; name: string; width: number; height: number };
export type AppProject = { sourceSheet?: SourceSheet; crops: CropBox[] };
export type Settings = { blackThreshold: number; padding: number; feather: boolean; minAutoDetectArea: number };
export type ManifestAsset = { id: string; filename: string; path: string; category: string; sourceSheet: string; order: number; width: number; height: number };
