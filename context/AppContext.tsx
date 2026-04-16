import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ClassSession, StudySession, Task } from '../types';

import { requestPermissionsAsync, scheduleClassNotification } from '../services/NotificationService';

const generateId = () => {
  // Use crypto.randomUUID if available, otherwise fall back to timestamp + random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return Date.now().toString(36) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
};

interface AppContextType {
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;

  // Classes
  classes: ClassSession[];
  addClassSession: (classSession: Omit<ClassSession, 'id'>) => void;
  updateClassSession: (classSession: ClassSession) => void;
  deleteClassSession: (id: string) => void;

  // Study sessions
  studySessions: StudySession[];
  currentStudySession: StudySession | null;
  startStudySession: (subject: string) => void;
  stopStudySession: (minutes: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [currentStudySession, setCurrentStudySession] = useState<StudySession | null>(null);

  // Load data from AsyncStorage on initial load
  useEffect(() => {
    const initApp = async () => {
      try {
        await requestPermissionsAsync();
        const storedTasks = await AsyncStorage.getItem('smartstudy-tasks');
        const storedClasses = await AsyncStorage.getItem('smartstudy-classes');
        const storedSessions = await AsyncStorage.getItem('smartstudy-study-sessions');

        if (storedTasks) setTasks(JSON.parse(storedTasks));
        if (storedClasses) setClasses(JSON.parse(storedClasses));
        if (storedSessions) setStudySessions(JSON.parse(storedSessions));
      } catch (e) {
        console.error('Failed to load data from storage', e);
      }
    };
    initApp();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem('smartstudy-tasks', JSON.stringify(tasks)),
          AsyncStorage.setItem('smartstudy-classes', JSON.stringify(classes)),
          AsyncStorage.setItem('smartstudy-study-sessions', JSON.stringify(studySessions))
        ]);
      } catch (error) {
        console.error('Failed to save data to AsyncStorage:', error);
      }
    };
    saveData();
  }, [tasks, classes, studySessions]);

  // Task functions
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    // Validation
    if (!task.title || task.title.trim().length === 0) {
      console.error('Task title is required');
      return;
    }
    if (!task.subject || task.subject.trim().length === 0) {
      console.error('Task subject is required');
      return;
    }
    if (task.dueDate && isNaN(new Date(task.dueDate).getTime())) {
      console.error('Invalid due date format');
      return;
    }

    const newTask: Task = {
      ...task,
      title: task.title.trim(),
      subject: task.subject.trim(),
      details: task.details?.trim() || '',
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask: Task) => {
    // Validation
    if (!updatedTask.title || updatedTask.title.trim().length === 0) {
      console.error('Task title is required');
      return;
    }
    if (!updatedTask.subject || updatedTask.subject.trim().length === 0) {
      console.error('Task subject is required');
      return;
    }
    
    const sanitizedTask = {
      ...updatedTask,
      title: updatedTask.title.trim(),
      subject: updatedTask.subject.trim(),
      details: updatedTask.details?.trim() || ''
    };
    
    setTasks(tasks.map(task => task.id === sanitizedTask.id ? sanitizedTask : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  // Class functions
  const addClassSession = async (classSession: Omit<ClassSession, 'id'>) => {
    // Validation
    if (!classSession.subject || classSession.subject.trim().length === 0) {
      console.error('Class subject is required');
      return;
    }
    if (!classSession.startTime || classSession.startTime.trim().length === 0) {
      console.error('Class start time is required');
      return;
    }
    if (!classSession.room || classSession.room.trim().length === 0) {
      console.error('Class room is required');
      return;
    }
    if (!classSession.days || classSession.days.length === 0) {
      console.error('Class days are required');
      return;
    }

    const newClassSession: ClassSession = {
      ...classSession,
      subject: classSession.subject.trim(),
      room: classSession.room.trim(),
      id: generateId()
    };
    setClasses(prev => [...prev, newClassSession].sort((a, b) => a.startTime.localeCompare(b.startTime)));

    // Schedule recurring notifications for all selected days
    try {
      await scheduleClassNotification(newClassSession.subject, newClassSession.startTime, newClassSession.room, newClassSession.days);
    } catch (error) {
      console.error('Failed to schedule notifications for class:', error);
    }
  };

  const updateClassSession = (updatedClassSession: ClassSession) => {
    setClasses(classes.map(cls => cls.id === updatedClassSession.id ? updatedClassSession : cls));
  };

  const deleteClassSession = (id: string) => {
    setClasses(classes.filter(cls => cls.id !== id));
  };

  // Study session functions
  const startStudySession = (subject: string) => {
    // Validation
    if (!subject || subject.trim().length === 0) {
      console.error('Study session subject is required');
      return;
    }

    const newSession: StudySession = {
      id: generateId(),
      subject: subject.trim(),
      startTime: new Date().toISOString(),
      endTime: null,
      duration: null
    };
    setCurrentStudySession(newSession);
  };

  const stopStudySession = (durationInMinutes: number) => {
    if (currentStudySession) {
      const endTime = new Date().toISOString();
      const completedSession: StudySession = {
        ...currentStudySession,
        endTime,
        duration: durationInMinutes
      };
      setStudySessions(prev => [...prev, completedSession]);
      setCurrentStudySession(null);
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,

    classes,
    addClassSession,
    updateClassSession,
    deleteClassSession,

    studySessions,
    currentStudySession,
    startStudySession,
    stopStudySession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
