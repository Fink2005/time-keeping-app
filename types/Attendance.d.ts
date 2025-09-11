export type AttendanceBase = {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  location: string;
  radius: number;
  createdAt: string;
};

export type AttendanceRecord = Omit<AttendanceBase, 'location' | 'radius'> & {
  type: 'check-in' | 'check-out';
};
