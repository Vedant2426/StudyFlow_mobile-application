import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Clock, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ClassSession } from '@/types';

interface ClassCardProps {
  item: ClassSession;
  index: number;
}

export function ClassCard({ item, index }: ClassCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).springify()}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      
      <View style={[styles.timeColumn, { backgroundColor: colors.primary + '10', borderRightColor: colors.border }]}>
        <Clock color={colors.primary} size={20} style={{ marginBottom: 8 }} />
        <Text style={[styles.timeText, { color: colors.text }]}>{item.startTime}</Text>
        <Text style={[styles.durationText, { color: colors.mutedForeground }]}>{item.duration}</Text>
      </View>
      
      <View style={styles.detailsColumn}>
        <Text style={[styles.courseText, { color: colors.text }]}>{item.subject}</Text>
        <View style={styles.locationRow}>
          <MapPin color={colors.mutedForeground} size={14} style={{ marginRight: 4 }} />
          <Text style={[styles.locationText, { color: colors.mutedForeground }]}>{item.room}</Text>
        </View>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  timeColumn: {
    width: 100,
    padding: 16,
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsColumn: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  courseText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
