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

interface DataContextType {
  schedule: Record<string, ScheduleItem>;
  timeSlots: TimeSlot[];
  subjectFiles: SubjectFile[];
  updateScheduleItem: (cellId: string, item: ScheduleItem | null) => void;
  updateTimeSlot: (id: string, time: string) => void;
  addTimeSlot: () => void;
  removeTimeSlot: (id: string) => void;
  addSubjectFile: (name: string, file: File) => void;
  removeSubjectFile: (id: string) => void;
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

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [schedule, setSchedule] = useState<Record<string, ScheduleItem>>({});
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(DEFAULT_TIME_SLOTS);
  const [subjectFiles, setSubjectFiles] = useState<SubjectFile[]>([]);

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

  return (
    <DataContext.Provider value={{
      schedule,
      timeSlots,
      subjectFiles,
      updateScheduleItem,
      updateTimeSlot,
      addTimeSlot,
      removeTimeSlot,
      addSubjectFile,
      removeSubjectFile
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