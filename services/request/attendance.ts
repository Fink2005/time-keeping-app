import { ATTENDACE_HISTORY_LIMIT } from '@/constants/global';
import { http } from '@/services/apiRequest';
import {
  AttendanceByYearRes,
  AttendanceDetailRes,
  AttendanceLastedStatusReq,
  AttendanceReq,
  AttendanceRes,
} from '@/types/Attendance';

const attendanceRequest = {
  createAttendance: async (data: AttendanceReq): Promise<AttendanceRes | null> => {
    return await http.post<AttendanceRes | null>({
      endpoint: '/attendance/check-attendance',
      data,
    });
  },
  getAttendance: async (page: number): Promise<AttendanceRes | null> => {
    return await http.get<AttendanceRes | null>({
      endpoint: `/attendance/list?page=${page}&limit=${ATTENDACE_HISTORY_LIMIT}`,
    });
  },
  getAttendanceLastedStatus: async (): Promise<AttendanceLastedStatusReq | null> => {
    return await http.get<AttendanceLastedStatusReq | null>({
      endpoint: `/attendance/lasted-status`,
    });
  },
  getAttendanceByYear: async (year: number): Promise<AttendanceByYearRes | null> => {
    return await http.get<AttendanceByYearRes | null>({
      endpoint: `/attendance/attendance-by-year/${year}`,
    });
  },
  getAttendanceDetail: async (page: number, date: string) => {
    return await http.get<AttendanceDetailRes | null>({
      endpoint: `/attendance/${date}?page=${page}&limit=${ATTENDACE_HISTORY_LIMIT}`,
    });
  },
};

export default attendanceRequest;
