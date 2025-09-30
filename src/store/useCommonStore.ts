// store/useAppStore.ts
import { AttendanceType } from '@/enum/Attendance 2';
import { create } from 'zustand';

type AppState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  attendanceType: AttendanceType | undefined;
  setAttendanceType: (type: AttendanceType | undefined) => void;
  year: number;
  setYear: (year: number) => void;
};

export const useCommonStore = create<AppState>()((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  attendanceType: AttendanceType.CHECK_IN,
  setAttendanceType: (attendanceType) => set({ attendanceType }),
  year: new Date().getFullYear(),
  setYear: (year) => set({ year }),
}));
