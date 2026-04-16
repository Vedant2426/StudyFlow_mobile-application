import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface AddClassSheetProps {
  onAddClass: (course: string, time: string, location: string, days: number[]) => void;
}

const DAYS_OF_WEEK = [
  { id: 1, label: 'S' },
  { id: 2, label: 'M' },
  { id: 3, label: 'T' },
  { id: 4, label: 'W' },
  { id: 5, label: 'T' },
  { id: 6, label: 'F' },
  { id: 7, label: 'S' },
];

export const AddClassSheet = forwardRef((props: AddClassSheetProps, ref: React.ForwardedRef<BottomSheetModal>) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const snapPoints = useMemo(() => ['75%'], []);

  const [course, setCourse] = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [date, setDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const renderBackdrop = useCallback(
    (bp: any) => <BottomSheetBackdrop {...bp} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  const handleTimeChange = (_: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setTimeStr(selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const toggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId].sort());
    }
  };

  const handleSave = () => {
    if (course.trim() && timeStr.trim() && selectedDays.length > 0) {
      props.onAddClass(course, timeStr, locationStr || 'TBD', selectedDays);
      setCourse('');
      setLocationStr('');
      setTimeStr('');
      setSelectedDays([]);
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
        <Text style={[styles.title, { color: colors.text }]}>New Class</Text>

        <Text style={[styles.label, { color: colors.text }]}>Course Name</Text>
        <BottomSheetTextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="e.g., Computer Science 101"
          placeholderTextColor={colors.mutedForeground}
          value={course}
          onChangeText={setCourse}
        />

        <Text style={[styles.label, { color: colors.text }]}>Location</Text>
        <BottomSheetTextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="e.g., Room 302"
          placeholderTextColor={colors.mutedForeground}
          value={locationStr}
          onChangeText={setLocationStr}
        />

        <Text style={[styles.label, { color: colors.text }]}>Days of the Week</Text>
        <View style={styles.daysRow}>
          {DAYS_OF_WEEK.map(day => {
            const isSelected = selectedDays.includes(day.id);
            return (
              <TouchableOpacity
                key={day.id}
                onPress={() => toggleDay(day.id)}
                style={[
                  styles.dayChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border
                  }
                ]}
              >
                <Text style={{ color: isSelected ? '#fff' : colors.text, fontWeight: '700' }}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>Start Time</Text>
        {Platform.OS === 'android' ? (
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={[styles.dateButton, { borderColor: colors.border }]}>
            <Text style={{ color: timeStr ? colors.text : colors.mutedForeground }}>
              {timeStr || 'Select Time'}
            </Text>
          </TouchableOpacity>
        ) : (
          <DateTimePicker value={date} mode="time" display="default" onChange={handleTimeChange} />
        )}

        {showTimePicker && Platform.OS === 'android' && (
          <DateTimePicker value={date} mode="time" display="default" onChange={handleTimeChange} />
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: (course.trim() && timeStr.trim() && selectedDays.length > 0) ? colors.primary : colors.mutedForeground }
          ]}
          onPress={handleSave}
          disabled={!(course.trim() && timeStr.trim() && selectedDays.length > 0)}
        >
          <Text style={styles.saveButtonText}>Add Weekly Class</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddClassSheet.displayName = 'AddClassSheet';

const styles = StyleSheet.create({
  contentContainer: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 16 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dayChip: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  dateButton: { borderWidth: 1, padding: 16, borderRadius: 12 },
  saveButton: { marginTop: 'auto', padding: 18, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
