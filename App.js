import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions, Image, PanResponder, Pressable, SafeAreaView,
  StatusBar, StyleSheet, Switch, Text, View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ART = require('./hyena.jpg');
const EXPRESSIONS = ['通常', 'にこっ', 'クール'];

export default function App() {
  const [expression, setExpression] = useState(0);
  const [autoMotion, setAutoMotion] = useState(true);
  const [zoom, setZoom] = useState(1);
  const drift = useRef(new Animated.Value(0)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { position.extractOffset(); },
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => { position.flattenOffset(); },
  })).current;

  useEffect(() => {
    if (!autoMotion) { drift.stopAnimation(); drift.setValue(0); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(drift, { toValue: 1, duration: 1700, useNativeDriver: true }),
      Animated.timing(drift, { toValue: 0, duration: 1700, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [autoMotion, drift]);

  const bob = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -9] });
  const breathe = drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.012] });
  const lean = expression === 1 ? '1deg' : expression === 2 ? '-1deg' : '0deg';

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.heading}>HYENA MOTION</Text>
        <Text style={styles.sub}>22歳のハイエナ獣人 · 試作版 0.1</Text>
      </View>
      <View style={styles.stage}>
        <View style={styles.halo} />
        <Animated.View {...pan.panHandlers} style={{ transform: [
          { translateX: position.x }, { translateY: position.y },
          { translateY: bob }, { rotate: lean }, { scale: Animated.multiply(breathe, zoom) }
        ] }}>
          <Image source={ART} style={styles.avatar} resizeMode="contain" />
        </Animated.View>
        <Text style={styles.hint}>ドラッグで移動できます</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.label}>モード（試作用の見た目切り替え）</Text>
        <View style={styles.buttons}>
          {EXPRESSIONS.map((name, index) => (
            <Pressable key={name} onPress={() => setExpression(index)}
              style={[styles.chip, expression === index && styles.selected]}>
              <Text style={styles.chipText}>{name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.controlRow}>
          <Text style={styles.label}>ゆっくり揺れる</Text>
          <Switch value={autoMotion} onValueChange={setAutoMotion} trackColor={{ true: '#bd9585' }} />
        </View>
        <View style={styles.controlRow}>
          <Text style={styles.label}>拡大率</Text>
          <View style={styles.buttons}>
            <Pressable style={styles.small} onPress={() => setZoom(Math.max(.65, +(zoom - .1).toFixed(2)))}><Text style={styles.chipText}>−</Text></Pressable>
            <Text style={styles.zoom}>{Math.round(zoom * 100)}%</Text>
            <Pressable style={styles.small} onPress={() => setZoom(Math.min(1.45, +(zoom + .1).toFixed(2)))}><Text style={styles.chipText}>＋</Text></Pressable>
          </View>
        </View>
        <Pressable onPress={() => { position.setValue({x:0,y:0}); setZoom(1); setExpression(0); }} style={styles.reset}>
          <Text style={styles.resetText}>位置と拡大率をリセット</Text>
        </Pressable>
        <Text style={styles.notice}>現在は１枚絵を動かすプロトタイプです。口パク・まばたき・顔追跡は未実装。これらには分割済みLive2Dモデルと追加実装が必要です。</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#18171d' },
  header: { paddingHorizontal: 24, paddingVertical: 10 },
  heading: { color: '#f6e5d5', fontSize: 23, fontWeight: '800', letterSpacing: 3 },
  sub: { color: '#b9a9ab', fontSize: 12, marginTop: 4 },
  stage: { flex: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginHorizontal: 14, borderRadius: 24, backgroundColor: '#77717d' },
  halo: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#a49e9f', opacity: .35 },
  avatar: { width: Math.min(SCREEN_WIDTH - 38, 460), height: 500 },
  hint: { position: 'absolute', bottom: 12, color: '#f9f2ed', fontSize: 12, backgroundColor: '#33313b99', padding: 7, borderRadius: 9 },
  panel: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#23212a' },
  label: { color: '#f1e5df', fontSize: 13, fontWeight: '600' },
  buttons: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#45404a', borderRadius: 14 },
  selected: { backgroundColor: '#88685e', borderWidth: 1, borderColor: '#e7bfae' },
  chipText: { color: '#fff7f2', fontWeight: '600' },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  small: { backgroundColor: '#45404a', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 8 },
  zoom: { color: '#f2e8e0', minWidth: 42, textAlign: 'center' },
  reset: { marginTop: 12, padding: 9, alignItems: 'center', borderWidth: 1, borderColor: '#67616b', borderRadius: 12 },
  resetText: { color: '#e7d7cd', fontSize: 12 },
  notice: { color: '#aba0a7', fontSize: 11, lineHeight: 16, marginTop: 12 }
});
