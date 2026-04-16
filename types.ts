export interface Task {
  id: string;
  title: string;
  subject: string;
  details?: string;
  dueDate: string;
  nextLectureDate?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
}

// Class/Timetable interfaces
export interface ClassSession {
  id: string;
  subject: string;
  days: number[]; // 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
  startTime: string;
  endTime?: string;
  duration?: string; // Optional for simple mobile logic
  room: string;
}

// Study session interfaces
export interface StudySession {
  id: string;
  subject: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
}

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};
