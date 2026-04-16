import { TaskCard } from '@/components/cards/TaskCard';
import { AddTaskSheet } from '@/components/forms/AddTaskSheet';
import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { useAppTheme } from '@/context/ThemeContext';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Calendar as CalendarIcon, List as ListIcon, Plus, Search } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function TasksScreen() {
  const { activeColorScheme } = useAppTheme();
  const colors = Colors[activeColorScheme];

  const { tasks, addTask, toggleTaskCompletion } = useAppContext();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const filteredTasks = useMemo(() => {
    const searchLower = search.toLowerCase();
    return tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchLower) ||
        t.subject.toLowerCase().includes(searchLower);
      const matchFilter = filter === 'all' ? true :
        filter === 'pending' ? !t.completed : t.completed;
      return matchSearch && matchFilter;
    });
  }, [tasks, search, filter]);

  const markedDates = useMemo(() => {
    const marks: any = {};
    tasks.forEach(task => {
      if (!task.completed && task.dueDate) {
        try {
          const date = new Date(task.dueDate);
          if (isNaN(date.getTime())) {
            console.warn('Invalid date format for task:', task.id, task.dueDate);
            return;
          }
          const formattedDate = date.toISOString().split('T')[0];
          marks[formattedDate] = {
            marked: true,
            dotColor: colors.destructive || '#ef4444'
          };
        } catch (error) {
          console.error('Error processing date for task:', task.id, error);
        }
      }
    });
    return marks;
  }, [tasks, colors.destructive]);

  const openSheet = () => bottomSheetRef.current?.present();

  const handleAddTask = (newTask: any) => {
    // Save dueDate natively as ISO date standard
    addTask({ ...newTask, completed: false });
    bottomSheetRef.current?.dismiss();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tasks</Text>
        <Pressable
          style={[styles.viewToggle, { borderColor: colors.border }]}
          onPress={() => setViewMode(v => v === 'list' ? 'calendar' : 'list')}
        >
          {viewMode === 'list' ? <CalendarIcon color={colors.text} size={20} /> : <ListIcon color={colors.text} size={20} />}
        </Pressable>
      </View>

      <View style={styles.controls}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search color={colors.mutedForeground} size={20} />
          <TextInput
            placeholder="Search assignments..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {viewMode === 'list' && (
          <View style={styles.filterRow}>
            {(['all', 'pending', 'completed'] as const).map(f => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[
                  styles.filterPill,
                  { backgroundColor: filter === f ? colors.primary : colors.card, borderColor: filter === f ? colors.primary : colors.border }
                ]}
              >
                <Text style={{ color: filter === f ? '#fff' : colors.text, fontWeight: '600' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {viewMode === 'calendar' ? (
        <Animated.View entering={FadeIn} style={{ flex: 1, paddingHorizontal: 20 }}>
          <Calendar
            markedDates={markedDates}
            theme={{
              calendarBackground: 'transparent',
              textSectionTitleColor: colors.mutedForeground,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.mutedForeground + '50',
              dotColor: colors.primary,
              monthTextColor: colors.text,
              arrowColor: colors.primary,
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
          />
        </Animated.View>
      ) : (
        <Animated.View style={{ flex: 1 }} entering={FadeIn}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No matching tasks found.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredTasks}
              renderItem={({ item }) => (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <TaskCard task={item} onToggle={toggleTaskCompletion} />
                </Animated.View>
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Animated.View>
      )}

      <Pressable style={[styles.fab, { backgroundColor: colors.primary }]} onPress={openSheet}>
        <Plus color="#fff" size={24} />
      </Pressable>

      <AddTaskSheet ref={bottomSheetRef} onAddTask={handleAddTask} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 48, paddingBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  viewToggle: { padding: 10, borderWidth: 1, borderRadius: 12 },

  controls: { paddingHorizontal: 20, marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },

  filterRow: { flexDirection: 'row', gap: 8 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },

  listContainer: { paddingHorizontal: 20, paddingBottom: 120 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 32, right: 24, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 6 },
});
