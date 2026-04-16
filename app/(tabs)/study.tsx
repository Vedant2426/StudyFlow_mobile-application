import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView, TextInput } from 'react-native';
import { Play, Square, Coffee, BookOpen } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppContext } from '@/context/AppContext';

type TimerMode = 'focus' | 'break';

export default function StudyScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { startStudySession, stopStudySession } = useAppContext();

  const [mode, setMode] = useState<TimerMode>('focus');
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleModeChange = (newMode: TimerMode) => {
    if (isActive) handleStop();
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const handleStart = () => {
    if (!isActive) {
      if (mode === 'focus') startStudySession(subject || 'General Focus');
      setIsActive(true);
    }
  };

  const handleStop = () => {
    setIsActive(false);
    if (mode === 'focus') {
      const minutesSpent = Math.floor((focusDuration * 60 - timeLeft) / 60);
      if (minutesSpent > 0) stopStudySession(minutesSpent);
    }
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const handleComplete = () => {
    setIsActive(false);
    if (mode === 'focus') {
      stopStudySession(focusDuration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pomodoro</Text>
      </View>

      <View style={styles.modeRow}>
        <Pressable 
          onPress={() => handleModeChange('focus')}
          style={[styles.modeBtn, { backgroundColor: mode === 'focus' ? colors.primaryTransparent : 'transparent' }]}
        >
          <BookOpen color={mode === 'focus' ? colors.primary : colors.mutedForeground} size={20} />
          <Text style={{ marginLeft: 8, color: mode === 'focus' ? colors.primary : colors.mutedForeground, fontWeight: 'bold' }}>Focus</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => handleModeChange('break')}
          style={[styles.modeBtn, { backgroundColor: mode === 'break' ? '#34d39920' : 'transparent' }]}
        >
          <Coffee color={mode === 'break' ? '#34d399' : colors.mutedForeground} size={20} />
          <Text style={{ marginLeft: 8, color: mode === 'break' ? '#34d399' : colors.mutedForeground, fontWeight: 'bold' }}>Break</Text>
        </Pressable>
      </View>

      <View style={styles.timerContainer}>
        {mode === 'focus' && !isActive && (
          <View style={styles.settingsRow}>
            <TextInput
              placeholder="What are you working on?"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.subjectInput, { color: colors.text, borderColor: colors.border }]}
              value={subject}
              onChangeText={setSubject}
              maxLength={40}
            />
            <View style={styles.durationInputContainer}>
              <Text style={[styles.durationLabel, { color: colors.text }]}>Focus (m)</Text>
              <TextInput
                style={[styles.durationInput, { color: colors.text, borderColor: colors.border }]}
                value={focusDuration.toString()}
                keyboardType="numeric"
                onChangeText={(v) => {
                  const val = parseInt(v) || 0;
                  setFocusDuration(val);
                  if (mode === 'focus') setTimeLeft(val * 60);
                }}
              />
            </View>
          </View>
        )}

        {mode === 'break' && !isActive && (
          <View style={[styles.durationInputContainer, { marginBottom: 32 }]}>
            <Text style={[styles.durationLabel, { color: colors.text }]}>Break (m)</Text>
            <TextInput
              style={[styles.durationInput, { color: colors.text, borderColor: colors.border }]}
              value={breakDuration.toString()}
              keyboardType="numeric"
              onChangeText={(v) => {
                const val = parseInt(v) || 0;
                setBreakDuration(val);
                if (mode === 'break') setTimeLeft(val * 60);
              }}
            />
          </View>
        )}
        
        <View style={[styles.circle, { borderColor: mode === 'focus' ? colors.primaryTransparent : '#34d39920' }]}>
          <Text style={[styles.timeText, { color: mode === 'break' ? '#34d399' : colors.text }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>

        <View style={styles.controls}>
          <Pressable 
            style={[styles.controlBtn, { backgroundColor: isActive ? colors.destructive : colors.primary }]}
            onPress={isActive ? handleStop : handleStart}
          >
            {isActive ? <Square color="#fff" fill="#fff" size={24} /> : <Play color="#fff" fill="#fff" size={24} />}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 48 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  
  modeRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  modeBtn: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  
  timerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 20, marginBottom: 32 },
  subjectInput: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
  durationInputContainer: { alignItems: 'center' },
  durationLabel: { fontSize: 12, marginBottom: 4, fontWeight: '600' },
  durationInput: { borderWidth: 1, borderRadius: 12, padding: 16, width: 70, textAlign: 'center', fontSize: 16 },
  
  circle: { width: 280, height: 280, borderRadius: 140, borderWidth: 8, borderColor: '#primary20', justifyContent: 'center', alignItems: 'center', marginBottom: 48 },
  timeText: { fontSize: 72, fontWeight: '800', fontVariant: ['tabular-nums'] },
  
  controls: { flexDirection: 'row', gap: 24 },
  controlBtn: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
});
