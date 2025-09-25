// store/useAppStore.ts
import { AttendanceType } from '@/enum/Attendance';
import { create } from 'zustand';

type AppState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  attendanceType: AttendanceType | undefined;
  setAttendanceType: (type: AttendanceType | undefined) => void;
};

export const useCommonStore = create<AppState>()((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  attendanceType: AttendanceType.CHECK_IN,
  setAttendanceType: (attendanceType) => set({ attendanceType }),
}));
