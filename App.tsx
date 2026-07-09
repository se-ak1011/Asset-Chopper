import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import ImportScreen from './src/screens/ImportScreen';
import SheetEditorScreen from './src/screens/SheetEditorScreen';
import AssetListScreen from './src/screens/AssetListScreen';
import ExportScreen from './src/screens/ExportScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { AppProject, AppScreen, CropBox, Settings } from './src/types';
import { defaultSettings } from './src/utils/settings';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [project, setProject] = useState<AppProject>({ crops: [] });
  const upsertCrop = (crop: CropBox) => setProject(p => ({ ...p, crops: p.crops.some(c => c.id === crop.id) ? p.crops.map(c => c.id === crop.id ? crop : c) : [...p.crops, crop] }));
  const removeCrop = (id: string) => setProject(p => ({ ...p, crops: p.crops.filter(c => c.id !== id) }));
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" />
    {screen === 'home' && <HomeScreen project={project} go={setScreen} />}
    {screen === 'import' && <ImportScreen project={project} setProject={setProject} go={setScreen} />}
    {screen === 'editor' && <SheetEditorScreen project={project} setProject={setProject} upsertCrop={upsertCrop} removeCrop={removeCrop} go={setScreen} />}
    {screen === 'assets' && <AssetListScreen project={project} setProject={setProject} go={setScreen} />}
    {screen === 'export' && <ExportScreen project={project} settings={settings} go={setScreen} />}
    {screen === 'settings' && <SettingsScreen settings={settings} setSettings={setSettings} go={setScreen} />}
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#0b0f14' } });
