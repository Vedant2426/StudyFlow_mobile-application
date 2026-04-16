import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeOutLeft, FadeInRight } from 'react-native-reanimated';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: task.completed ? withTiming(0.6) : withTiming(1),
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleToggle = () => {
    Haptics.impactAsync(task.completed ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
    onToggle(task.id);
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return { bg: colors.destructiveTransparent, color: colors.destructive };
      case 'medium': return { bg: '#fbbf2420', color: '#fbbf24' };
      case 'low': return { bg: '#34d39920', color: '#34d399' };
      default: return { bg: colors.primaryTransparent, color: colors.primary };
    }
  };

  return (
    <Animated.View 
      entering={FadeInRight}
      exiting={FadeOutLeft}
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }, animatedStyle]}>
      <Pressable 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleToggle} 
        style={styles.innerContainer}
      >
        <View style={styles.checkWrapper}>
          {task.completed ? (
            <CheckCircle2 color={colors.primary} size={28} />
          ) : (
            <Circle color={colors.mutedForeground} size={28} />
          )}
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text, textDecorationLine: task.completed ? 'line-through' : 'none' }]}>
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.subject, { color: colors.primary }]}>{task.subject}</Text>
            <Text style={[styles.dueDate, { color: colors.mutedForeground }]}>• {task.dueDate}</Text>
            {task.priority && (() => {
              const { bg, color } = getPriorityColor();
              return (
                <View style={[styles.priorityBadge, { backgroundColor: bg }]}>
                  <AlertCircle size={12} color={color} style={{ marginRight: 4 }}/>
                  <Text style={[styles.priorityText, { color }]}>{task.priority.toUpperCase()}</Text>
                </View>
              );
            })()}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkWrapper: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  subject: {
    fontSize: 13,
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 13,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  }
});
