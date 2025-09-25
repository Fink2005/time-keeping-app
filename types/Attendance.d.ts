export type AttendanceType = 'CHECK_IN' | 'CHECK_OUT';

export type AttendanceReq = {
  lat: string;
  lng: string;
  address: string;
  location?: {
    name: string;
  };
  radius?: number;
  locationId?: string;
  type?: AttendanceType;
  imageUri?: string;
};

export type AttendanceRes = {
  data: (AttendanceReq & {
    id: string;
    userId: number;
    createdAt: string;
  })[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Derived type (without location info)
export type AttendanceRecord = Omit<AttendanceReq, 'location' | 'radius'>;
