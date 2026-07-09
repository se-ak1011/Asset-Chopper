import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
export default function Button({ title, onPress, secondary }: { title: string; onPress: () => void; secondary?: boolean }) { return <Pressable onPress={onPress} style={[styles.button, secondary && styles.secondary]}><Text style={styles.text}>{title}</Text></Pressable>; }
const styles = StyleSheet.create({ button: { backgroundColor: '#2f80ed', padding: 16, borderRadius: 14, marginVertical: 6 }, secondary: { backgroundColor: '#243140' }, text: { color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 16 } });
