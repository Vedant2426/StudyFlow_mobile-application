import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/types';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface AddTaskSheetProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
}

export const AddTaskSheet = forwardRef((props: AddTaskSheetProps, ref: React.ForwardedRef<BottomSheetModal>) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const snapPoints = useMemo(() => ['65%'], []);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const renderBackdrop = useCallback(
    (bp: any) => <BottomSheetBackdrop {...bp} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  const handleSave = () => {
    if (title.trim()) {
      props.onAddTask({
        title,
        subject: subject || 'General',
        dueDate: date.toISOString().split('T')[0],
        priority,
      });
      setTitle('');
      setSubject('');
      setPriority('medium');
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return { bg: colors.destructiveTransparent, border: colors.destructive };
      case 'medium': return { bg: '#fbbf2420', border: '#fbbf24' };
      case 'low': return { bg: '#34d39920', border: '#34d399' };
      default: return { bg: colors.primaryTransparent, border: colors.primary };
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>New Assignment</Text>

        <Text style={[styles.label, { color: colors.text }]}>Task Name</Text>
        <BottomSheetTextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="e.g., Read Chapter 5"
          placeholderTextColor={colors.mutedForeground}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: colors.text }]}>Subject</Text>
        <BottomSheetTextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="e.g., History"
          placeholderTextColor={colors.mutedForeground}
          value={subject}
          onChangeText={setSubject}
        />

        <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
        <View style={styles.priorityRow}>
          {['low', 'medium', 'high'].map(p => {
            const isSelected = priority === p;
            const { bg, border } = getPriorityColor(p);
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p as any)}
                style={[
                  styles.priorityChip,
                  {
                    backgroundColor: isSelected ? bg : colors.card,
                    borderColor: isSelected ? border : colors.border
                  }
                ]}
              >
                <Text style={{ color: isSelected ? border : colors.mutedForeground, fontWeight: '600' }}>
                  {p.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>Due Date</Text>
        {Platform.OS === 'android' ? (
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.dateButton, { borderColor: colors.border }]}>
            <Text style={{ color: colors.text }}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
        ) : (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {showDatePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: title.trim() ? colors.primary : colors.mutedForeground }]}
          onPress={handleSave}
          disabled={!title.trim()}
        >
          <Text style={styles.saveButtonText}>Add Task</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddTaskSheet.displayName = 'AddTaskSheet';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dateButton: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
  },
  saveButton: {
    marginTop: 'auto',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
