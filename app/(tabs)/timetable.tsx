import { ClassCard } from '@/components/cards/ClassCard';
import { AddClassSheet } from '@/components/forms/AddClassSheet';
import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Plus } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const DAYS = [
  { id: 2, label: 'Mon' },
  { id: 3, label: 'Tue' },
  { id: 4, label: 'Wed' },
  { id: 5, label: 'Thu' },
  { id: 6, label: 'Fri' },
  { id: 7, label: 'Sat' },
  { id: 1, label: 'Sun' },
];

export default function TimetableScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { classes, addClassSession } = useAppContext();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [activeDay, setActiveDay] = useState(new Date().getDay() + 1); // JS getDay is 0-6 (Sun-Sat), we use 1-7 (Sun-Sat)

  const openSheet = () => bottomSheetRef.current?.present();

  const handleAddClass = (course: string, time: string, location: string, days: number[]) => {
    addClassSession({
      subject: course,
      days: days,
      startTime: time,
      room: location,
      duration: '1h',
    });
    bottomSheetRef.current?.dismiss();
  };

  const filteredClasses = classes.filter(c => c.days && c.days.includes(activeDay));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Timetable</Text>
      </View>

      <View style={styles.daysRowContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
          {DAYS.map(day => (
            <Pressable
              key={day.id}
              onPress={() => setActiveDay(day.id)}
              style={[
                styles.dayTab,
                {
                  backgroundColor: activeDay === day.id ? colors.primary : colors.card,
                  borderColor: activeDay === day.id ? colors.primary : colors.border
                }
              ]}
            >
              <Text style={{ color: activeDay === day.id ? '#fff' : colors.text, fontWeight: '700' }}>
                {day.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredClasses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No classes scheduled for today. Enjoy!</Text>
          </View>
        ) : (
          filteredClasses.map((item, index) => (
            <Animated.View key={item.id} entering={FadeIn} exiting={FadeOut}>
              <ClassCard item={item} index={index} />
            </Animated.View>
          ))
        )}
      </ScrollView>

      <Pressable style={[styles.fab, { backgroundColor: colors.primary }]} onPress={openSheet}>
        <Plus color="#fff" size={24} />
      </Pressable>

      <AddClassSheet ref={bottomSheetRef} onAddClass={handleAddClass} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 48, paddingBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  daysRowContainer: { marginBottom: 16 },
  daysScroll: { paddingHorizontal: 20, gap: 10 },
  dayTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 120 },
  emptyContainer: { marginTop: 80, alignItems: 'center' },
  emptyText: { fontSize: 16, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 32, right: 24, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 },
});
