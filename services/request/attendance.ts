import { http } from '@/services/apiRequest';
import { AttendanceReq, AttendanceRes } from '@/types/Attendance';

const attendanceRequest = {
  createAttendance: async (data: AttendanceReq) => {
    return await http.post('/attendance/check-attendance', data);
  },
  getAttendance: async (): Promise<AttendanceRes | null> => {
    return await http.get<AttendanceRes | null>('/attendance/attendances');
  },
};

export default attendanceRequest;
