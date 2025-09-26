import { ATTENDACE_HISTORY_LIMIT } from '@/constants/global';
import { http } from '@/services/apiRequest';
import { AttendanceDetailRes, AttendanceReq, AttendanceRes } from '@/types/Attendance';

const attendanceRequest = {
  createAttendance: async (data: AttendanceReq) => {
    return await http.post('/attendance/check-attendance', data);
  },
  getAttendance: async (page: number): Promise<AttendanceRes | null> => {
    return await http.get<AttendanceRes | null>(
      `/attendance/list?page=${page}&limit=${ATTENDACE_HISTORY_LIMIT}`,
    );
  },
  getAttendanceDetail: async (page: number, date: string) => {
    return await http.get<AttendanceDetailRes | null>(
      `/attendance/${date}?page=${page}&limit=${ATTENDACE_HISTORY_LIMIT}`,
    );
  },
};

export default attendanceRequest;
