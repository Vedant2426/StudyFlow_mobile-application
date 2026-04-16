import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { useAppTheme } from '@/context/ThemeContext';
import { BookOpen, Calendar, Clock, Moon, Settings, Sun } from 'lucide-react-native';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const { theme, setTheme, activeColorScheme } = useAppTheme();
  const colors = Colors[activeColorScheme];
  const { tasks, classes, studySessions } = useAppContext();

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  const todayClasses = classes.length; // In future, check real dates
  const studyMinutes = studySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Hello there,</Text>
            <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
          </View>
        </View>

        {/* Theme Settings Override */}
        <View style={[styles.themeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>App Theme</Text>
          <View style={styles.themeRow}>
            {(['light', 'dark', 'system'] as const).map(t => (
              <Pressable
                key={t}
                onPress={() => setTheme(t)}
                style={[
                  styles.themeBtn,
                  {
                    backgroundColor: theme === t ? colors.primaryTransparent : 'transparent',
                    borderColor: theme === t ? colors.primary : colors.border
                  }
                ]}
              >
                {t === 'light' ? <Sun color={theme === t ? colors.primary : colors.mutedForeground} size={18} /> :
                  t === 'dark' ? <Moon color={theme === t ? colors.primary : colors.mutedForeground} size={18} /> :
                    <Settings color={theme === t ? colors.primary : colors.mutedForeground} size={18} />}
                <Text style={{ marginLeft: 6, color: theme === t ? colors.primary : colors.mutedForeground, fontWeight: '600' }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Analytics Grid */}
        <View style={styles.grid}>
          {/* Tasks Summary */}
          <View style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#fbbf2420' }]}>
              <BookOpen color="#fbbf24" size={24} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{pendingTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Pending Tasks</Text>
          </View>

          {/* Completed Summary */}
          <View style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#34d39920' }]}>
              <BookOpen color="#34d399" size={24} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{completedTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Done Tasks</Text>
          </View>

          {/* Classes Summary */}
          <View style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#60a5fa20' }]}>
              <Calendar color="#60a5fa" size={24} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{todayClasses}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Classes Today</Text>
          </View>

          {/* Study Summary */}
          <View style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconWrapper, { backgroundColor: '#a78bfa20' }]}>
              <Clock color="#a78bfa" size={24} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{studyMinutes}m</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Focus Time</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 24,
  },
  greeting: { fontSize: 16, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },

  themeCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  themeRow: { flexDirection: 'row', gap: 8 },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 14, fontWeight: '500' },
});
