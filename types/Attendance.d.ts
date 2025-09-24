export type AttendanceBase = {
  id: string;
  latitude: string;
  longitude: string;
  address: string;
  destination: string;
  radius: number;
  createdAt: string;
  type?: 'check-in' | 'check-out';
  imageUri?: string;
};

export type AttendanceRecord = Omit<AttendanceBase, 'location' | 'radius'>;
