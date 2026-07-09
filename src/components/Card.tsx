import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
export default function Card({ children }: PropsWithChildren) { return <View style={styles.card}>{children}</View>; }
const styles = StyleSheet.create({ card: { backgroundColor: '#121922', borderColor: '#253244', borderWidth: 1, borderRadius: 18, padding: 16, marginVertical: 8 } });
