import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; import * as DocumentPicker from 'expo-document-picker'; import * as FileSystem from 'expo-file-system';
import Button from '../components/Button'; import { AppProject, AppScreen } from '../types';
const copyLocal = async (uri:string, name:string) => { const dest = `${FileSystem.documentDirectory}${Date.now()}_${name.replace(/[^a-zA-Z0-9_.-]/g,'_')}`; await FileSystem.copyAsync({ from: uri, to: dest }); return dest; };
export default function ImportScreen({ project, setProject, go }: { project: AppProject; setProject: React.Dispatch<React.SetStateAction<AppProject>>; go: (s: AppScreen) => void }) {
 const save = async (uri:string, name='asset_sheet.png') => Image.getSize(uri, async (width,height) => { const local = await copyLocal(uri, name); setProject({ sourceSheet: { uri: local, name, width, height }, crops: [] }); go('editor'); });
 const pickPhoto = async () => { const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 }); if (!r.canceled) save(r.assets[0].uri, r.assets[0].fileName || 'asset_sheet.png'); };
 const pickDoc = async () => { const r = await DocumentPicker.getDocumentAsync({ type: ['image/png','image/jpeg'], copyToCacheDirectory: true }); if (!r.canceled) save(r.assets[0].uri, r.assets[0].name); };
 return <View style={styles.wrap}><Text style={styles.title}>Import Sheet</Text><Button title="Choose from Photos" onPress={pickPhoto} /><Button title="Choose PNG/JPG file" onPress={pickDoc} secondary /><Button title="Back" onPress={() => go('home')} secondary />{project.sourceSheet && <Image source={{uri: project.sourceSheet.uri}} style={styles.preview} resizeMode="contain" />}</View>;
}
const styles = StyleSheet.create({ wrap:{flex:1,padding:20}, title:{color:'#fff',fontSize:28,fontWeight:'800',marginBottom:16}, preview:{flex:1,marginTop:20,backgroundColor:'#05070a',borderRadius:16} });
