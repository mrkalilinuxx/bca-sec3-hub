import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ScheduleItem {
  id: string;
  name: string;
  details?: string;
  timestamp: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  editable: boolean;
}

export interface SubjectFile {
  id: string;
  name: string;
  file: File;
  uploadDate: string;
  size: number;
  type: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

interface DataContextType {
  schedule: Record<string, ScheduleItem>;
  timeSlots: TimeSlot[];
  subjectFiles: SubjectFile[];
  subjects: Subject[];
  updateScheduleItem: (cellId: string, item: ScheduleItem | null) => void;
  updateTimeSlot: (id: string, time: string) => void;
  addTimeSlot: () => void;
  removeTimeSlot: (id: string) => void;
  addSubjectFile: (name: string, file: File) => void;
  removeSubjectFile: (id: string) => void;
  updateSubject: (id: string, name: string) => void;
  addSubject: () => void;
  removeSubject: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '9:00 - 10:00', editable: false },
  { id: '2', time: '10:00 - 11:00', editable: false },
  { id: '3', time: '11:15 - 12:15', editable: false },
  { id: '4', time: '12:15 - 1:15', editable: false },
  { id: '5', time: '2:00 - 3:00', editable: false },
  { id: '6', time: '3:00 - 4:00', editable: false },
];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: 'Data Structures & Algorithms', color: '#3b82f6' },
  { id: '2', name: 'Database Management Systems', color: '#8b5cf6' },
  { id: '3', name: 'Object Oriented Programming', color: '#10b981' },
  { id: '4', name: 'Computer Networks', color: '#f59e0b' },
  { id: '5', name: 'Operating Systems', color: '#ef4444' },
  { id: '6', name: 'Software Engineering', color: '#06b6d4' },
  { id: '7', name: 'Web Technologies', color: '#84cc16' },
  { id: '8', name: 'Mathematics for Computing', color: '#f97316' },
  { id: '9', name: 'Computer Graphics', color: '#ec4899' },
  { id: '10', name: 'Project Work', color: '#6366f1' },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [schedule, setSchedule] = useState<Record<string, ScheduleItem>>({});
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS);
  const [subjectFiles, setSubjectFiles] = useState<SubjectFile[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);

  useEffect(() => {
    // Load schedule from localStorage
    const savedSchedule = localStorage.getItem('bca_routine_schedule');
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }

    // Load time slots from localStorage
    const savedTimeSlots = localStorage.getItem('bca_routine_time_slots');
    if (savedTimeSlots) {
      setTimeSlots(JSON.parse(savedTimeSlots));
    }

    // Load subject files from localStorage (without actual File objects)
    const savedFiles = localStorage.getItem('bca_routine_subject_files');
    if (savedFiles) {
      const fileData = JSON.parse(savedFiles);
      setSubjectFiles(fileData.map((item: any) => ({
        ...item,
        file: new File([], item.fileName) // Create dummy file object
      })));
    }

    // Load subjects from localStorage
    const savedSubjects = localStorage.getItem('bca_routine_subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  const updateScheduleItem = (cellId: string, item: ScheduleItem | null) => {
    const newSchedule = { ...schedule };
    if (item) {
      newSchedule[cellId] = item;
    } else {
      delete newSchedule[cellId];
    }
    setSchedule(newSchedule);
    localStorage.setItem('bca_routine_schedule', JSON.stringify(newSchedule));
  };

  const updateTimeSlot = (id: string, time: string) => {
    const newTimeSlots = timeSlots.map(slot =>
      slot.id === id ? { ...slot, time } : slot
    );
    setTimeSlots(newTimeSlots);
    localStorage.setItem('bca_routine_time_slots', JSON.stringify(newTimeSlots));
  };

  const addTimeSlot = () => {
    const newId = String(Date.now());
    const newSlot: TimeSlot = {
      id: newId,
      time: 'New Time Slot',
      editable: true
    };
    const newTimeSlots = [...timeSlots, newSlot];
    setTimeSlots(newTimeSlots);
    localStorage.setItem('bca_routine_time_slots', JSON.stringify(newTimeSlots));
  };

  const removeTimeSlot = (id: string) => {
    const newTimeSlots = timeSlots.filter(slot => slot.id !== id);
    setTimeSlots(newTimeSlots);
    localStorage.setItem('bca_routine_time_slots', JSON.stringify(newTimeSlots));
  };

  const addSubjectFile = (name: string, file: File) => {
    const newFile: SubjectFile = {
      id: String(Date.now()),
      name,
      file,
      uploadDate: new Date().toISOString(),
      size: file.size,
      type: file.type
    };
    const newFiles = [...subjectFiles, newFile];
    setSubjectFiles(newFiles);
    
    // Save metadata to localStorage (without the actual file)
    const fileMetadata = newFiles.map(({ file, ...rest }) => ({
      ...rest,
      fileName: file.name
    }));
    localStorage.setItem('bca_routine_subject_files', JSON.stringify(fileMetadata));
  };

  const removeSubjectFile = (id: string) => {
    const newFiles = subjectFiles.filter(file => file.id !== id);
    setSubjectFiles(newFiles);
    
    const fileMetadata = newFiles.map(({ file, ...rest }) => ({
      ...rest,
      fileName: file.name
    }));
    localStorage.setItem('bca_routine_subject_files', JSON.stringify(fileMetadata));
  };

  const updateSubject = (id: string, name: string) => {
    const newSubjects = subjects.map(subject =>
      subject.id === id ? { ...subject, name } : subject
    );
    setSubjects(newSubjects);
    localStorage.setItem('bca_routine_subjects', JSON.stringify(newSubjects));

    // Update schedule items that use this subject name
    const newSchedule = { ...schedule };
    Object.keys(newSchedule).forEach(cellId => {
      const oldSubject = subjects.find(s => s.id === id);
      if (oldSubject && newSchedule[cellId].name === oldSubject.name) {
        newSchedule[cellId] = { ...newSchedule[cellId], name };
      }
    });
    setSchedule(newSchedule);
    localStorage.setItem('bca_routine_schedule', JSON.stringify(newSchedule));
  };

  const addSubject = () => {
    const newId = String(Date.now());
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'];
    const newSubject: Subject = {
      id: newId,
      name: 'New Subject',
      color: colors[subjects.length % colors.length]
    };
    const newSubjects = [...subjects, newSubject];
    setSubjects(newSubjects);
    localStorage.setItem('bca_routine_subjects', JSON.stringify(newSubjects));
  };

  const removeSubject = (id: string) => {
    const newSubjects = subjects.filter(subject => subject.id !== id);
    setSubjects(newSubjects);
    localStorage.setItem('bca_routine_subjects', JSON.stringify(newSubjects));
  };

  return (
    <DataContext.Provider value={{
      schedule,
      timeSlots,
      subjectFiles,
      subjects,
      updateScheduleItem,
      updateTimeSlot,
      addTimeSlot,
      removeTimeSlot,
      addSubjectFile,
      removeSubjectFile,
      updateSubject,
      addSubject,
      removeSubject
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};